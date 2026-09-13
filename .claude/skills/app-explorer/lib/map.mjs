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
import { loadProfile, ROOT } from '../../../../scripts/config/profile.mjs';

const run = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const flag = (name, fallback) => { const at = args.indexOf('--' + name); return at === -1 ? fallback : args[at + 1]; };

const profile = loadProfile();
const outDir = ROOT;
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
const SECTIONS = ['app', 'source', 'conventions', 'api', 'map', 'components', 'screens', 'testability', 'recordings', 'stats'];

// Ordered first, then anything this file does not know about — a writer that dropped an
// unrecognised key would silently delete another skill's section the moment the contract
// grew. Section order is fixed so a re-run diffs only its own work.
function reorder(current) {
  const ordered = {};
  for (const key of SECTIONS) if (key in current) ordered[key] = current[key];
  for (const key of Object.keys(current)) if (!(key in ordered)) ordered[key] = current[key];
  return ordered;
}


async function writeMapSection(dir, value) {
  const path = join(dir, 'analysis.json');
  const current = existsSync(path) ? JSON.parse(await readFile(path, 'utf8')) : {};
  current.map = value;
  await writeFile(path, JSON.stringify(reorder(current), null, 2) + '\n');
}

await mkdir(outDir, { recursive: true });
await writeMapSection(outDir, map);
log(`${allResults.length} modules, ${screens} screens, ${allNotes.length} skipped, ${allErrors.length} errors in ${elapsed}s`);
log('written to', join(outDir, 'analysis.json'), '§ map');
