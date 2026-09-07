#!/usr/bin/env node
// Gate for the analysis the generator reads. Purely static — this opens no browser and
// contacts no app, only the JSON the repo analyzer wrote.
//
//   npm run check-analysis --prefix scripts/framework-generator -- [--strict <route>...]
//
// Run from the repo root. Exits non-zero on any failure. `--strict` promotes the warnings
// for the named routes to failures.
//
// The failures worth having a gate for are the quiet ones. A stale analysis still parses
// and still generates a framework — it just describes an app that has moved on. A route
// path that lost its leading slash still produces a page object, pointing at a URL that
// does not exist. Neither announces itself at generation time, so both are checked here.

import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { fromMap } from './locator-spec.js';
import { readApplicationModel } from './analysis-reader.js';
import { errorMessage, isRecord, list, record } from './types.js';
import type { ApplicationConfig } from './types.js';

const strictArgIndex = process.argv.indexOf('--strict');
const strictTargets = new Set(strictArgIndex === -1 ? [] : process.argv.slice(strictArgIndex + 1));

// The gate reads only analysis settings; generation-only config is not required here.
const CONFIG_PATH = join('scripts', 'framework-generator', 'generator-config.yaml');
const rawConfig = record(yaml.load(readFileSync(CONFIG_PATH, 'utf8')));
const rawApi = record(rawConfig.api ?? {});
const config: ApplicationConfig = {
  analysisDir: String(rawConfig.analysisDir ?? 'analysis'),
  locatorTemplates: Object.fromEntries(Object.entries(record(rawConfig.locatorTemplates ?? {})).map(([key, value]) => [key, String(value)])),
  navigation: list(rawConfig.navigation).map(record),
  pages: { folderSegment: 'auto', dropParamSegments: true, mergeDuplicates: true, ...record(rawConfig.pages ?? {}) },
  api: { enabled: Boolean(rawApi.enabled), ...(rawApi.pathPrefix == null ? {} : { pathPrefix: String(rawApi.pathPrefix) }) },
};

const REQUIRED = ['pages-and-routes.json', 'frontend-components.json'];
const OPTIONAL = ['live-urls.json', 'label-dictionary.json', 'api-documentation.json'];

const failures: string[] = [];
const warnings: string[] = [];

// ---- the files exist and parse -----------------------------------------------

for (const name of REQUIRED) {
  const file = join(config.analysisDir, name);
  if (!existsSync(file)) failures.push(`${name}: missing. Run the repo analyzer from the repo root.`);
}
for (const name of OPTIONAL) {
  if (!existsSync(join(config.analysisDir, name))) warnings.push(`${name}: missing — the generator will fall back to a default.`);
}
if (failures.length > 0) report();

const routeData = readAnalysis('pages-and-routes.json');
const componentData = readAnalysis('frontend-components.json');

// ---- provenance: is this analysis describing the app as it is now? -----------

const appPath = String(routeData.app ?? componentData.app ?? '');
if (!appPath) {
  warnings.push('no `app` recorded in the analysis — provenance cannot be checked.');
} else if (!existsSync(appPath)) {
  warnings.push(`the analysed app is no longer at '${appPath}' — freshness cannot be checked.`);
} else {
  const head = gitSha(appPath);
  const analysed = shaFromReport('pages-and-routes.md');
  if (head && analysed && head !== analysed) {
    failures.push(
      `analysis is stale: it describes '${appPath}' at ${analysed}, which is now at ${head}. `
      + 'Re-run the repo analyzer — a stale analysis generates a framework for an app that has moved on.',
    );
  }
}

// ---- routes ------------------------------------------------------------------

const seenPaths = new Map<string, number>();
for (const route of list(routeData.routes).map(record)) {
  const path = route.path;
  const strict = typeof path === 'string' && strictTargets.has(path);
  const say = (message: string) => (strict ? failures : warnings).push(`${path}: ${message}`);

  if (typeof path !== 'string' || !path) {
    failures.push(`a route has no usable 'path' (${JSON.stringify(route)})`);
    continue;
  }
  if (!path.startsWith('/')) say('does not start with "/" — it will be rooted, but the analyzer should emit it canonically');
  if (path.includes('?')) failures.push(`${path}: carries a query string, which is not part of a page's identity`);
  if (/^[a-z]+:\/\//.test(path)) failures.push(`${path}: is a full URL, not a path`);
  // A raw id in a path means one crawled record became the page's identity.
  if (/\/\d+(\/|$)/.test(path)) say('contains a literal numeric id — it should be collapsed to {id}');

  seenPaths.set(path, (seenPaths.get(path) ?? 0) + 1);
}
for (const [path, count] of seenPaths) {
  if (count > 1) warnings.push(`${path}: appears ${count} times in the route table`);
}

// ---- elements ----------------------------------------------------------------

const templatesUsed = new Set<unknown>();
for (const component of list(componentData.components).map(record)) {
  const names = new Set<unknown>();
  for (const element of list(component.elements).map(record)) {
    if (!element.name || !element.component || !element.locator) {
      failures.push(`${component.file}: an element is missing name, component or locator — it would be dropped silently`);
      continue;
    }
    // Two getters with one name is a compile error downstream; catching it here names the file.
    if (names.has(element.name)) failures.push(`${component.file}: duplicate element name '${element.name}'`);
    names.add(element.name);

    if (isRecord(element.locator) && element.locator.strategy === 'template') templatesUsed.add(list(element.locator.args)[0]);
    try {
      fromMap(element.locator, config.locatorTemplates);
    } catch (error) {
      failures.push(`${component.file}: element '${element.name}' has an unusable locator — ${errorMessage(error)}`);
    }
  }
}

for (const id of Object.keys(config.locatorTemplates ?? {})) {
  if (!templatesUsed.has(id)) warnings.push(`locatorTemplates.${id} is configured but no element uses it`);
}

// ---- navigation --------------------------------------------------------------

for (const entry of config.navigation ?? []) {
  if (!entry?.name || !entry.component || !entry.locator) {
    failures.push(`navigation: an entry is missing name, component or locator (${JSON.stringify(entry)})`);
    continue;
  }
  try {
    fromMap(entry.locator, config.locatorTemplates);
  } catch (error) {
    failures.push(`navigation: '${entry.name}' has an unusable locator — ${errorMessage(error)}`);
  }
}

// ---- the model the generator will actually build ------------------------------

try {
  const model = readApplicationModel(config);
  const ambiguous = model.pages.reduce((n, page) => n + page.elements.filter((e) => e.unstable).length, 0);
  if (ambiguous > 0) {
    warnings.push(
      `${ambiguous} element(s) share a locator with another element on the same page. `
      + 'They are emitted with an // UNSTABLE comment; record the flow with playwright-codegen to pin them down.',
    );
  }
  if (model.stats.routesWithoutComponent > 0) {
    warnings.push(`${model.stats.routesWithoutComponent} route(s) have no component — those page objects carry a URL and nothing else.`);
  }
  console.log(`[check-analysis] model builds: ${model.pages.length} page object(s), ${model.stats.elementsRead} element(s), `
    + `${model.stats.sharedChrome} declared in navigation`);
} catch (error) {
  failures.push(`the generator cannot build a model from this analysis: ${errorMessage(error)}`);
}

report();

// ---- helpers -----------------------------------------------------------------

function readAnalysis(name: string): Record<string, unknown> {
  try {
    return record(JSON.parse(readFileSync(join(config.analysisDir, name), 'utf8')) as unknown);
  } catch (error) {
    failures.push(`${name}: ${errorMessage(error)}`);
    report();
    return {};
  }
}

/** The commit recorded in a report's provenance header, written by report.mjs. */
function shaFromReport(name: string): string | null {
  try {
    const body = readFileSync(join(config.analysisDir, name), 'utf8');
    return /\*\*App\*\*: `[^`]*` @ `([^`]+)`/.exec(body)?.[1] ?? null;
  } catch {
    return null;
  }
}

function gitSha(dir: string): string | null {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

function report() {
  for (const warning of warnings) console.warn(`[check-analysis] WARN  ${warning}`);
  for (const failure of failures) console.error(`[check-analysis] FAIL  ${failure}`);
  if (failures.length > 0) {
    console.error(`[check-analysis] ${failures.length} failure(s), ${warnings.length} warning(s)`);
    process.exit(1);
  }
  console.log(`[check-analysis] ok — ${warnings.length} warning(s)`);
  process.exit(0);
}
