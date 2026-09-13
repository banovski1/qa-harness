// The failures that are silent.
//
// A stale analysis still parses and still generates a framework — one that describes an
// app which has moved on. So does a screen that quietly lost every control, or a
// collection with no key column. None of these throw; all of them waste a day. This
// gate turns each into an exit code.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { homedir } from 'node:os';
import type { AppModel } from './model-types.ts';
import { SECTION_OWNER, type Section } from '../analysis/analysis-types.ts';
import { modelFromAnalysis } from '../framework-generator/emit/emit.ts';

interface Finding { level: 'error' | 'warning'; message: string }

const expand = (p: string) => (p.startsWith('~') ? join(homedir(), p.slice(1)) : p);

export function checkModel(appDir: string, model: AppModel): Finding[] {
  const out: Finding[] = [];
  const err = (message: string) => out.push({ level: 'error', message });
  const warn = (message: string) => out.push({ level: 'warning', message });

  // 1. Is the analysis describing the app as it is now?
  try {
    const head = execFileSync('git', ['-C', expand(model.app.repoPath), 'rev-parse', 'HEAD'])
      .toString().trim();
    if (head !== model.app.repoCommit) {
      err(`the analysis was taken at ${model.app.repoCommit.slice(0, 10)} but the clone is now at ` +
          `${head.slice(0, 10)} — re-run the skills, then compile-model.ts`);
    }
  } catch {
    warn(`could not read ${model.app.repoPath} to compare commits; the analysis may be stale`);
  }

  // 2. Is the analysis there, and has every skill filled in its section?
  const analysisPath = join(appDir, 'analysis.json');
  if (!existsSync(analysisPath)) {
    err('analysis.json is missing — no skill has run');
  } else {
    const analysis = JSON.parse(readFileSync(analysisPath, 'utf8'));
    // Every section the contract promises, and who fills it in. A section that is
    // present but empty is a skill that has not run, not a skill that found nothing.
    const empty: Record<string, boolean> = {
      source: !analysis.source?.routes?.length,
      conventions: !analysis.conventions?.regions?.length,
      api: !analysis.api?.endpoints?.length,
      components: !Object.keys(analysis.components ?? {}).length,
      screens: !analysis.screens?.length,
      stats: !Object.keys(analysis.stats ?? {}).length,
    };
    for (const [section, isEmpty] of Object.entries(empty)) {
      if (isEmpty) err(`analysis.json has no "${section}" — ${SECTION_OWNER[section as Section]} has not run`);
    }
    if (!analysis.map?.modules?.length) {
      warn('analysis.json has no "map" — run map.mjs for the menu-level inventory');
    }
    if (analysis.api?.authVerification?.verdict !== 'verified') {
      warn(`the API login is ${analysis.api?.authVerification?.verdict ?? 'unproven'} — ` +
           'run scripts/api-auth/verify-auth.ts before building a precondition on it');
    }
  }

  // 3. Every page must be reachable and legally named.
  const names = new Set<string>();
  for (const s of model.screens) {
    if (!/^[A-Z][A-Za-z0-9]*Page$/.test(s.name)) err(`"${s.name}" is not a legal class name`);
    if (names.has(s.name)) err(`two screens are both called ${s.name}`);
    names.add(s.name);
    if (!s.path.startsWith('/')) err(`${s.name}: path "${s.path}" lost its leading slash`);
    const props = new Set<string>();
    for (const u of s.uses) {
      if (props.has(u.as)) err(`${s.name}: two controls are both called "${u.as}"`);
      props.add(u.as);
      if (!model.components[u.component]) err(`${s.name}.${u.as}: no component "${u.component}"`);
      if (!u.label && !u.field && model.components[u.component]?.kind === 'field') {
        err(`${s.name}.${u.as}: a field component with neither a label nor a field name`);
      }
    }
  }

  // 4. A crawled screen with nothing on it is a crawl that failed, not a screen that is empty.
  const empty = model.screens.filter(s => s.crawled && s.uses.length === 0);
  if (empty.length) warn(`${empty.length} crawled screen(s) carry no controls: ${empty.slice(0, 5).map(s => s.name).join(', ')}`);

  // 5. A collection nobody can address a row in is worth saying out loud.
  for (const s of model.screens) {
    for (const u of s.uses) {
      if (model.components[u.component]?.kind === 'collection' && !u.keyColumn) {
        warn(`${s.name}.${u.as}: no key column, so rows can only be counted, not named`);
      }
    }
  }

  // 6. The crawl is what makes a locator real. A model with none is a route list.
  if (!model.stats.crawled) {
    warn('nothing was crawled, so every page object is a URL and nothing else');
  }

  const unverifiedRatio = model.stats.uses ? model.stats.unverified / (model.stats.uses + model.stats.unverified) : 0;
  if (unverifiedRatio > 0.5) {
    warn(`${Math.round(unverifiedRatio * 100)}% of crawled controls could not be named. ` +
         `Check the app for an accessible-name problem before trusting the page objects.`);
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = process.argv[process.argv.indexOf('--app') + 1];
  if (!app || app.startsWith('--')) { console.error('usage: check-model.ts --app <name>'); process.exit(2); }
  const dir = join('analysis', app);
  const model: AppModel = modelFromAnalysis(app);
  const findings = checkModel(dir, model);
  for (const f of findings) console.log(`${f.level === 'error' ? 'ERROR  ' : 'warning'} ${f.message}`);
  const errors = findings.filter(f => f.level === 'error').length;
  console.log(`${app}: ${errors} error(s), ${findings.length - errors} warning(s), ` +
              `${model.stats.screens} screens, ${model.stats.crawled} crawled`);
  process.exit(errors ? 1 : 0);
}
