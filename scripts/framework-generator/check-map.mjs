#!/usr/bin/env node
// Gate for the application map. The strict schema fails quietly — a malformed element is
// dropped with no error, and a nav locator changed on one screen silently collapses the
// shared NavigationBar — so this asserts the invariants the generator depends on.
//
//   node scripts/framework-generator/check-map.mjs [--strict <slug>...]
//
// Run from the repo root. Exits non-zero on any failure. `--strict` additionally requires the
// named files (slug or filename, repeatable) to have zero silently-dropped elements; use it for
// the files a mapping session just wrote, so legacy files don't mask a new mistake.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { readApplicationMap } from './map-reader.mjs';

// The NavigationBar is lifted from elements present on >= ceil(threshold * fileCount) pages.
// The 17 real chrome entries — sidebar module links, the brand banner, the menu search, the current
// user and the Configuration tab — sit on every mapped page. A file that drops or re-locates one of
// them collapses all 17 getters into every page object at once, which is what this number guards.
// Module-specific top-bar tabs (PIM's Employee List / Add Employee / Reports, Claim's four) are NOT
// chrome: they live on one module's pages only, and they re-inline by design as soon as a second
// module is mapped and they fall below the 80% threshold.
const EXPECTED_SHARED_CHROME = 17;

const strictArgIndex = process.argv.indexOf('--strict');
const strictTargets = new Set(
  (strictArgIndex === -1 ? [] : process.argv.slice(strictArgIndex + 1))
    .map((s) => s.replace(/\.yaml$/, '')),
);

// Only the three keys readApplicationMap reads, with the generator's own defaults. Importing
// generate.mjs to reuse loadConfig would run the generator as a side effect.
const rawConfig = yaml.load(readFileSync(join('scripts', 'framework-generator', 'generator-config.yaml'), 'utf8'));
const config = {
  mapDir: rawConfig.mapDir ?? join('ui-map-results', 'application-map'),
  pages: { folderSegment: 'auto', dropParamSegments: true, mergeDuplicates: true, ...(rawConfig.pages ?? {}) },
  elements: { sharedChromeThreshold: 0.8, includeUnstable: true, includeStates: true, ...(rawConfig.elements ?? {}) },
  locatorTemplates: { ...(rawConfig.locatorTemplates ?? {}) },
};
const failures = [];
const warnings = [];

// ---- schema-level checks, per raw file (readApplicationMap transforms too much to see these)

const files = readdirSync(config.mapDir).filter((f) => f.endsWith('.yaml')).sort();
for (const file of files) {
  const slug = file.replace(/\.yaml$/, '');
  const raw = yaml.load(readFileSync(join(config.mapDir, file), 'utf8'));

  if (!raw?.url) { failures.push(`${file}: no 'url:' key`); continue; }

  // A non-canonical URL shifts detectFolderSegment's shared prefix, which renames every
  // generated file in the project. Cheapest check here, worst failure if missed.
  if (!/^\//.test(raw.url) || /\?|https?:\/\//.test(raw.url)) {
    failures.push(`${file}: url is not a canonical path: ${raw.url}`);
  }
  if (/\/\d+(\/|$)/.test(raw.url)) {
    failures.push(`${file}: url has an uncollapsed numeric segment (expected {id}): ${raw.url}`);
  }
  if (raw.page && raw.page !== slug) {
    failures.push(`${file}: 'page:' is "${raw.page}" but the filename slug is "${slug}"`);
  }

  const seen = new Set();
  const checkNames = (list, where) => {
    for (const e of Array.isArray(list) ? list : []) {
      if (!e?.name) continue;
      const key = `${where}:${e.name}`;
      if (seen.has(key)) failures.push(`${file}: duplicate element name '${e.name}' in ${where}`);
      seen.add(key);
    }
  };
  checkNames(raw.elements, 'elements');
  for (const s of Array.isArray(raw.states) ? raw.states : []) checkNames(s.elements, `state '${s.name}'`);

  // Elements missing name/component/locator are dropped by readPage without complaint.
  const dropped = [
    ...(Array.isArray(raw.elements) ? raw.elements : []),
    ...(Array.isArray(raw.states) ? raw.states : []).flatMap((s) => s.elements ?? []),
  ].filter((e) => !e?.name || !e?.component || !e?.locator).length;

  if (dropped > 0) {
    const msg = `${file}: ${dropped} element(s) will be silently dropped (missing name, component or locator)`;
    if (strictTargets.has(slug)) failures.push(msg); else warnings.push(msg);
  }
}

// ---- model-level checks. This also inherits the hard throws: malformed file, unusable locator.

const model = readApplicationMap(config);

if (model.stats.sharedChrome !== EXPECTED_SHARED_CHROME) {
  failures.push(
    `shared navigation is ${model.stats.sharedChrome}, expected ${EXPECTED_SHARED_CHROME}. `
    + 'The chrome group moved: nav getters have duplicated into every page object. '
    + 'A rewritten file dropped or re-located a nav element — paste the chrome block verbatim.',
  );
}

// ---- report

for (const w of warnings) console.warn(`[check-map] warn  ${w}`);
for (const f of failures) console.error(`[check-map] FAIL  ${f}`);

console.log(
  `[check-map] ${model.stats.files} file(s), ${model.stats.pages} page(s), `
  + `${model.stats.elementsRead} element(s) read, ${model.stats.skippedNoLocator} dropped, `
  + `${model.stats.unstable} unstable, ${model.stats.sharedChrome} shared nav, `
  + `${model.stats.sharedStates} shared state(s), folderSegment ${model.stats.folderSegment}.`,
);

if (failures.length > 0) {
  console.error(`[check-map] ${failures.length} failure(s).`);
  process.exit(1);
}
console.log(`[check-map] ok${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
