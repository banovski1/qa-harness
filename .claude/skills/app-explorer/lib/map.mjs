#!/usr/bin/env node
// Builds the application map: the menus, the screens they lead to, and what is
// on each screen. Minutes, not hours — the map is the coarse layer, and the
// deep crawl and the user's own recordings sharpen it later.
import { execFile } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parseYaml } from './yaml-lite.mjs';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flag = (name, fallback) => { const at = args.indexOf('--' + name); return at === -1 ? fallback : args[at + 1]; };

const profilePath = flag('profile');
if (!profilePath) {
  console.error('usage: map.mjs --profile <analysis/<app>/app-profile.yaml> [--session <name>] [--budget-min 8] [--modules-per-batch 3]');
  process.exit(2);
}

const profile = parseYaml(await readFile(profilePath, 'utf8'));
const outDir = dirname(profilePath);
const session = flag('session', profile.session || 'app-map');
const budgetMin = Number(flag('budget-min', (profile.budget || {}).mapMinutes || 8));
const modulesPerBatch = Number(flag('modules-per-batch', 3));
const maxScreensPerModule = Number(flag('max-per-module', (profile.budget || {}).maxScreensPerModule || 8));
const only = flag('only', null);          // one module, for working on the crawl itself
const perModuleMs = Number(flag('per-module-seconds', 75)) * 1000;

const settings = {
  settleTimeout: 6000, navTimeout: 20000, clickTimeout: 5000, sampleMs: 120, maxSamples: 25, quietSamples: 2,
  ...(profile.settings || {}),
};

const log = (...parts) => console.log('[map]', ...parts);
const started = Date.now();

const authConfig = profile.auth ? {
  loginUrl: profile.auth.loginUrl || profile.baseUrl,
  steps: (profile.auth.steps || []).map((step) => ({
    ...step,
    value: typeof step.value === 'string' && step.value.startsWith('env:') ? (process.env[step.value.slice(4)] ?? '') : step.value,
  })),
  readyWhen: profile.auth.readyWhen || null,
} : null;

const EXTRACTOR = await readFile(join(here, 'map-extract.js'), 'utf8');
const TEMPLATE = await readFile(join(here, 'map-batch.js'), 'utf8');
const DISCOVER = await readFile(join(here, 'map-discover.js'), 'utf8');

async function runCode(source) {
  const file = join(outDir, '.map-batch.js');
  await writeFile(file, source, 'utf8');
  // The CLI can exit non-zero having already printed a complete result — a warning
  // on the way out is not a failed crawl. The output decides, not the exit code.
  let stdout;
  try {
    ({ stdout } = await run('playwright-cli', ['-s=' + session, '--raw', 'run-code', '--filename=' + file], {
      maxBuffer: 128 * 1024 * 1024,
    }));
  } catch (error) {
    stdout = error.stdout || '';
    if (!stdout.includes('{')) {
      throw new Error(`${error.message}\n${stdout.slice(0, 600)}\n${(error.stderr || '').slice(0, 600)}`);
    }
  }
  const start = stdout.indexOf('{');
  if (start === -1) throw new Error('run-code returned no JSON:\n' + stdout.slice(0, 600));
  return JSON.parse(stdout.slice(start, stdout.lastIndexOf('}') + 1));
}

const bundle = (template, config) => template
  .replace('__CONFIG__', JSON.stringify(config))
  .replace('__EXTRACTOR_SRC__', JSON.stringify(EXTRACTOR));

// ---- 1. Find the primary menu. Everything else hangs off this.
log('discovering the primary menu…');
const discovery = await runCode(bundle(DISCOVER, {
  baseUrl: profile.baseUrl,
  auth: authConfig,
  ...settings,
}));
if (!discovery.ok) throw new Error('discovery failed: ' + (discovery.error || 'unknown'));

const modules = discovery.primary.items
  .map((item, index) => ({ name: item.name, index, url: item.href ? new URL(item.href, profile.baseUrl).href : null }))
  .filter((m) => m.name)
  .filter((m) => !only || only.split(',').map((n) => n.trim().toLowerCase()).includes(m.name.toLowerCase()));
log(`primary menu: ${modules.length} modules — ${modules.map((m) => m.name).join(', ')}`);

// ---- 2. Walk them, a few per call so a stall costs one batch and not the run.
const primaryNames = modules.map((m) => m.name);
const allResults = [];
const allErrors = [];
const allNotes = [];
for (let i = 0; i < modules.length; i += modulesPerBatch) {
  const slice = modules.slice(i, i + modulesPerBatch);
  const remaining = budgetMin * 60000 - (Date.now() - started);
  if (remaining < 15000) { allErrors.push({ error: `budget of ${budgetMin} min exhausted after ${allResults.length} modules` }); break; }
  log(`batch ${Math.floor(i / modulesPerBatch) + 1}: ${slice.map((m) => m.name).join(', ')} (${Math.round(remaining / 1000)}s left)`);
  try {
    const batch = await runCode(bundle(TEMPLATE, {
      modules: slice, primaryNames, auth: null, maxScreensPerModule,
      baseUrl: profile.baseUrl,
      exclude: profile.exclude || [],
      contentSelector: settings.contentSelector || null,
      // Each module gets its own share, so the last one in a batch is not starved
      // by the first. A batch still cannot outlive what is left of the run.
      budgetMs: Math.min(remaining, perModuleMs * slice.length), ...settings,
    }));
    allResults.push(...(batch.results || []));
    allErrors.push(...(batch.errors || []));
    allNotes.push(...(batch.notes || []));
  } catch (error) {
    allErrors.push({ modules: slice.map((m) => m.name), error: String(error.message).slice(0, 300) });
    log('batch failed:', String(error.message).slice(0, 200));
  }
}

// ---- 3. Write the map
const elapsed = Math.round((Date.now() - started) / 1000);
const screens = allResults.reduce((n, m) => n + m.screens.length, 0);
const map = {
  app: profile.app || profile.name || 'app',
  baseUrl: profile.baseUrl,
  generatedAt: new Date().toISOString(),
  elapsedSeconds: elapsed,
  totals: {
    modules: allResults.length,
    screens,
    tables: allResults.reduce((n, m) => n + m.screens.filter((s) => s.collections.length).length, 0),
    errors: allErrors.length,
  },
  modules: allResults,
  notes: allNotes,
  errors: allErrors,
};
const SECTIONS = ['app', 'source', 'components', 'api', 'map', 'screens', 'testability'];

async function writeMapSection(dir, value) {
  const path = join(dir, 'analysis.json');
  const current = existsSync(path) ? JSON.parse(await readFile(path, 'utf8')) : {};
  current.map = value;
  const ordered = {};
  for (const key of SECTIONS) if (key in current) ordered[key] = current[key];
  await writeFile(path, JSON.stringify(ordered, null, 2) + '\n');
}

await mkdir(outDir, { recursive: true });
// Two views of one thing: the section is what an agent reads, the YAML is what a person
// reads, and both are written from the same object so they cannot drift apart.
await writeMapSection(outDir, map);
await writeFile(join(outDir, 'app-map.yaml'), renderYaml(map));
log(`${allResults.length} modules, ${screens} screens, ${allNotes.length} skipped, ${allErrors.length} errors in ${elapsed}s`);
log('written to', join(outDir, 'app-map.yaml'));

// A map is read far more often than it is parsed, so it gets a readable form.
function renderYaml(map) {
  const q = (s) => {
    const text = String(s ?? '');
    return /^[\w .\-/#()&']+$/.test(text) && !/^\s|\s$/.test(text) ? text : JSON.stringify(text);
  };
  const out = [
    `# ${map.app} — application map`,
    `# ${map.totals.modules} modules, ${map.totals.screens} screens, crawled in ${map.elapsedSeconds}s`,
    `# Menus and surfaces only. Nothing here was created, updated or deleted.`,
    `app: ${q(map.app)}`,
    `baseUrl: ${q(map.baseUrl)}`,
    `generatedAt: ${q(map.generatedAt)}`,
    `modules:`,
  ];
  for (const module of map.modules) {
    out.push(`  - module: ${q(module.module)}`);
    if (module.menu.length) {
      out.push(`    menu:`);
      for (const item of module.menu) {
        out.push(`      - ${q(item.name)}${item.hasPopup ? '   # opens a submenu' : ''}`);
        for (const child of item.children || []) out.push(`        - ${q(child)}`);
      }
    }
    for (const list of module.valueLists || []) {
      out.push(`    valueList: ${q(list.path)}   # ${list.count} entries — ${list.note}`);
    }
    if (module.landedElsewhere) out.push(`    landedElsewhere: ${q(module.landedElsewhere)}   # the module URL did not lead to this module`);
    out.push(`    screens:`);
    for (const screen of module.screens) {
      out.push(`      - name: ${q(screen.name)}`);
      out.push(`        url: ${q(screen.url)}`);
      if (screen.heading) out.push(`        heading: ${q(screen.heading)}`);
      if (screen.landedElsewhere) out.push(`        landedElsewhere: ${q(screen.landedElsewhere)}`);
      if (screen.buttons.length) {
        out.push(`        buttons: [${screen.buttons.map((b) => q(b.name)).join(', ')}]`);
      }
      if (screen.fields.length) {
        out.push(`        fields:`);
        for (const field of screen.fields) {
          const options = field.options ? `  # ${field.options.slice(0, 6).join(' | ')}` : '';
          out.push(`          - ${q(field.name)} (${field.type})${options}`);
        }
      }
      // A screen with two tables must not emit the key twice, or the file stops
      // being YAML.
      if (screen.collections.length) {
        out.push(`        tables:`);
        for (const collection of screen.collections) {
          out.push(`          - kind: ${collection.kind}`);
          out.push(`            columns: [${collection.columns.map(q).join(', ')}]`);
          out.push(`            rows: ${collection.rows}`);
        }
      }
    }
  }
  if (map.notes.length) {
    out.push(`# places the crawl chose not to go, and why`);
    out.push(`notes:`);
    for (const note of map.notes) out.push(`  - ${q(`${note.module}: ${note.skipped} — ${note.why}`)}`);
  }
  if (map.errors.length) {
    out.push(`errors:`);
    for (const error of map.errors) out.push(`  - ${q(JSON.stringify(error))}`);
  }
  return out.join('\n') + '\n';
}
