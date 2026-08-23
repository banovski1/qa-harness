#!/usr/bin/env node
// Application map in, Playwright test framework out.
//
// Reads the map produced by the smart-map skill and generates a component-object-model
// framework in the language named in the config. This file is orchestration only:
// it validates the config, builds the model, hands it to a language adapter, and
// applies the write policy. It never branches on the language.
//
//   node scripts/framework-generator/generate.mjs [path/to/generator-config.yaml] [--dry-run]
//
// Run from the repo root so mapDir and outputDir resolve correctly.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { fromMap } from './locator-spec.mjs';
import { readApplicationMap } from './map-reader.mjs';
import { adapterFor, SUPPORTED_LANGUAGES } from './languages/index.mjs';
import { FileWriter } from './file-writer.mjs';

const DEFAULT_CONFIG = join('scripts', 'framework-generator', 'generator-config.yaml');

const DEFAULTS = {
  language: 'typescript',
  projectName: 'playwright-framework',
  outputDir: './generated-framework',
  baseUrl: '',
  mapDir: join('ui-map-results', 'application-map'),
  loginConfig: null,
  pages: { folderSegment: 'auto', dropParamSegments: true, mergeDuplicates: true },
  elements: { sharedChromeThreshold: 0.8, includeUnstable: true, includeStates: true },
  waits: { spinnerSelector: '[role="progressbar"], [aria-busy="true"]' },
  tests: { generateSmokeSpecs: true },
  locatorTemplates: {},
};

// Every template id the generator knows how to emit a factory for, and the component
// kinds that use it. An id absent from the config simply has no factory.
export const TEMPLATE_IDS = ['labelledInput', 'labelledTextarea', 'labelledSelect', 'topNavTab', 'tableByColumn'];

// ---- entry point -------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const configPath = args.find((a) => !a.startsWith('--')) ?? DEFAULT_CONFIG;

  const config = loadConfig(configPath);
  const adapter = adapterFor(config.language);
  console.log(`[framework-gen] ${config.language} -> ${config.outputDir}${dryRun ? ' (dry run)' : ''}`);

  const model = readApplicationMap(config);
  if (model.stats.folderSegmentDetected) {
    console.log(`[framework-gen] grouping pages by URL segment ${model.stats.folderSegment} (auto-detected): ` +
      `${[...new Set(model.pages.map((p) => p.group))].sort().join(', ')}`);
  }
  console.log(`[framework-gen] read ${model.stats.files} map file(s): ${model.pages.length} page object(s), ` +
    `${model.stats.elementsRead} element(s), ${model.stats.sharedChrome} shared in navigation`);

  const context = { config, model, adapter };
  const writer = new FileWriter(config.outputDir, { dryRun });

  for (const dir of adapter.emptyDirs(context)) writer.ensureDir(dir);
  for (const file of adapter.staticFiles(context)) writer.write(file);

  let pageObjects = 0;
  const unimplemented = adapter.renderPage(model.pages[0], context) === null;
  if (unimplemented) {
    console.warn(`[framework-gen] page objects are not implemented for ${config.language} yet — emitted scaffold only`);
  } else {
    for (const page of model.pages) {
      for (const file of adapter.renderPage(page, context)) writer.write(file);
      const spec = adapter.renderTest(page, context);
      if (spec) writer.write(spec);
      pageObjects += 1;
    }
    writer.write(report(context));
  }

  if (dryRun) printPlan(writer);
  console.log(`[framework-gen] done: ${pageObjects} page object(s), ${writer.summary()}.`);
}

main().catch((err) => {
  console.error('[framework-gen] ERROR', err.message);
  process.exit(1);
});

// ---- config ------------------------------------------------------------------

/** Read, merge over defaults, and validate the generator config. */
function loadConfig(path) {
  if (!existsSync(path)) throw new Error(`Config file not found: ${path}`);
  const raw = yaml.load(readFileSync(path, 'utf8'));
  if (!raw || typeof raw !== 'object') throw new Error(`Empty config file: ${path}`);

  const config = {
    ...DEFAULTS,
    ...raw,
    pages: { ...DEFAULTS.pages, ...(raw.pages ?? {}) },
    elements: { ...DEFAULTS.elements, ...(raw.elements ?? {}) },
    waits: { ...DEFAULTS.waits, ...(raw.waits ?? {}) },
    tests: { ...DEFAULTS.tests, ...(raw.tests ?? {}) },
    locatorTemplates: { ...(raw.locatorTemplates ?? {}) },
  };

  if (!SUPPORTED_LANGUAGES.includes(config.language)) {
    throw new Error(`Unknown language: '${config.language}'. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
  if (!config.baseUrl) throw new Error("Missing 'baseUrl:' in the generator config.");
  if (!config.outputDir) throw new Error("Missing 'outputDir:' in the generator config.");
  const threshold = Number(config.elements.sharedChromeThreshold);
  if (!(threshold > 0 && threshold <= 1)) {
    throw new Error(`elements.sharedChromeThreshold must be between 0 and 1, got ${config.elements.sharedChromeThreshold}`);
  }
  config.elements.sharedChromeThreshold = threshold;

  const segment = config.pages.folderSegment;
  if (segment !== 'auto' && !(Number.isInteger(segment) && segment >= 1)) {
    throw new Error(`pages.folderSegment must be 'auto' or a positive integer, got ${JSON.stringify(segment)}`);
  }
  if (!config.waits.spinnerSelector) {
    throw new Error("waits.spinnerSelector must be a CSS selector. Remove the key to use the default.");
  }

  // A template whose id the generator does not know, or which forgets {label}, would
  // silently never match an element and quietly disable the factory it was written for.
  for (const [id, template] of Object.entries(config.locatorTemplates)) {
    if (!TEMPLATE_IDS.includes(id)) {
      throw new Error(`Unknown locatorTemplates id '${id}'. Known ids: ${TEMPLATE_IDS.join(', ')}`);
    }
    if (typeof template !== 'string' || !template.includes('{label}')) {
      throw new Error(`locatorTemplates.${id} must be a selector string containing {label}, got ${JSON.stringify(template)}`);
    }
  }

  config.login = config.loginConfig ? loadLoginFlow(config.loginConfig) : null;
  return config;
}

/**
 * The login flow is not in the application map — the mapping skill logs in before
 * it starts walking, so the locators live in scripts/app-config.yaml. Reading them
 * here is what lets the generator emit a working login helper instead of a TODO.
 * Credentials are deliberately not read: they belong in the environment.
 */
function loadLoginFlow(path) {
  if (!existsSync(path)) throw new Error(`loginConfig file not found: ${path}`);
  const spec = yaml.load(readFileSync(path, 'utf8'));
  const login = spec?.login;
  if (!login) throw new Error(`No 'login:' block in ${path}`);

  const required = ['loginUrl', 'usernameLocator', 'passwordLocator', 'submitLocator'];
  for (const key of required) {
    if (!login[key]) throw new Error(`loginConfig ${path} is missing 'login.${key}'`);
  }
  return {
    loginUrl: String(login.loginUrl),
    usernameLocator: fromMap(login.usernameLocator),
    passwordLocator: fromMap(login.passwordLocator),
    submitLocator: fromMap(login.submitLocator),
    successSignal: login.successSignal ? fromMap(login.successSignal) : null,
  };
}

// ---- reporting ---------------------------------------------------------------

/**
 * Every positional locator in the map, in one file. Burying that in code comments
 * alone would let a locator look stable when it is not. These are all legacy from
 * the deleted crawler — walking a module with the smart-map skill clears them.
 */
function report(context) {
  const { model, config } = context;
  const rows = [];
  for (const page of model.pages) {
    for (const element of page.elements) {
      if (element.unstable) rows.push([page.className, element.rawName, element.component, element.unstableReason]);
    }
  }

  let md = '# Generation report\n\n';
  md += `Generated from \`${config.mapDir}\` for \`${config.language}\`.\n\n`;
  md += '| | |\n|---|---|\n';
  md += `| Map files read | ${model.stats.files} |\n`;
  md += `| Page objects | ${model.pages.length} |\n`;
  md += `| Elements read | ${model.stats.elementsRead} |\n`;
  md += `| Skipped (no locator) | ${model.stats.skippedNoLocator} |\n`;
  md += `| Shared navigation elements | ${model.stats.sharedChrome} |\n`;
  md += `| Tables | ${model.stats.tables} |\n`;
  md += `| Unstable locators | ${model.stats.unstable} |\n`;

  // How many accessors resolve through a component factory instead of carrying a
  // selector. A drop here after a redesign means a locatorTemplate stopped matching
  // and those elements fell back to their mapped locator — same behaviour, but the
  // template needs updating.
  const locators = context.adapter.locatorStats?.(model, config);
  if (locators) md += `| Accessors via component factory | ${locators.derived} of ${locators.total} |\n`;
  md += '\n';

  if (locators) {
    md += '## Locator ownership\n\n';
    md += 'A factory accessor names only its label; the selector lives in the component,\n';
    md += 'from `locatorTemplates:` in the generator config. The rest keep the locator the\n';
    md += 'mapper verified, which is what a genuine one-off needs.\n\n';
    md += '| Resolved by | Accessors |\n|---|---|\n';
    for (const [factory, count] of locators.byFactory) md += `| \`${factory}\` | ${count} |\n`;
    md += `| its own locator | ${locators.total - locators.derived} |\n\n`;
  }

  md += '## Unstable locators\n\n';
  if (rows.length === 0) {
    md += 'None.\n';
  } else {
    md += 'These resolve by position, so they break when the page layout changes. Replace\n';
    md += 'them with a stable locator in the page object\'s protected file as you touch them.\n\n';
    md += '| Page | Element | Component | Why |\n|---|---|---|---|\n';
    for (const [page, name, component, reason] of rows) {
      md += `| ${page} | \`${name}\` | ${component} | ${reason} |\n`;
    }
  }
  return { path: 'GENERATION-REPORT.md', contents: md, kind: 'generated' };
}

function printPlan(writer) {
  for (const { path, action } of writer.planned) {
    if (action === 'unchanged') continue;
    console.log(`  ${action.padEnd(9)} ${path}`);
  }
}
