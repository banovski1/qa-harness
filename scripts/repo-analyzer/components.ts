#!/usr/bin/env node
// Skill A — every UI component in the app, parsed with its own framework's parser, plus any
// test-id attribute already present in the markup as a *suggested* locator strategy.
//
//   node scripts/repo-analyzer/components.mjs [--app <app-clone>] [--dry-run]

import fs from 'node:fs';
import path from 'node:path';
import {STRATEGIES} from '../framework-generator/locator-spec.mjs';
import {detect} from './detect.js';
import {buildComponentIndex, templatesFrom} from './elements-vue.js';
import {loadCatalogue} from './i18n.js';
import {TEST_ID_ATTRS} from './parsers.js';
import {ANALYSIS_DIR, header, outPath, reportWritten, table, writeReport} from './report.js';
import {findFiles, parseArgs, readJson, readText, rel, REPO_ROOT, resolveAppPath, unique} from './util.js';
import yaml from 'js-yaml';
import type {ComponentCollection, ComponentRecord, DetectionResult, LabelDictionaryReport, RoutesReport, RouteRecord, TemplateMap} from './types.js';

// A parser-less framework gets a naive listing, and a naive listing must stay conservative:
// only files that look like components by convention, never every source file in the tree.
const NAIVE_PATH = /(^|\/)(components?|pages|views|screens|templates)(\/|$)/;
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;

function classify(relPath: string) {
  if (/(^|\/)pages?(\/|$)/.test(relPath)) return 'page';
  if (/(^|\/)(views|screens)(\/|$)/.test(relPath)) return 'view';
  if (/(^|\/)layouts?(\/|$)/.test(relPath)) return 'layout';
  return 'component';
}

const GENERATOR_CONFIG = path.join('scripts', 'framework-generator', 'generator-config.yaml');

/**
 * The `locatorTemplates:` ids the generator config defines.
 *
 * The analyzer reads the generator's config for the same reason it imports `STRATEGIES` from it:
 * the two must agree about the locator vocabulary, and the generator owns it. A missing or empty
 * config yields an empty set, and the ladder falls through rather than proposing a template the
 * generator cannot expand.
 */
function configuredTemplates(): Record<string, unknown> {
  try {
    return (yaml.load(readText(path.join(REPO_ROOT, GENERATOR_CONFIG)) ?? '') as {locatorTemplates?: Record<string, unknown>} | null)?.locatorTemplates ?? {};
  } catch {
    return {};
  }
}

/**
 * @param detection  the result of detect()
 * @param options.templateFor  kind -> locatorTemplates id. Defaults to whatever the generator
 *   config defines. Tests pass this explicitly so their expectations do not shift when someone
 *   edits a config file elsewhere in the repo.
 */
export async function collectComponents(detection: DetectionResult, options: {templateFor?: TemplateMap} = {}): Promise<ComponentCollection> {
  const entry = detection.frontend.entry;
  // All three are built once and shared by every parse: the catalogue turns a `$t()` key into a
  // label, the index lets a parse follow a child component tag to its file, and templateFor is what
  // the ladder may use for a label the markup does not associate.
  const catalogue = await loadCatalogue(detection.appPath);
  const templateFor = options.templateFor ?? templatesFrom(configuredTemplates());
  const naive = Boolean(entry.naive) || entry.id === 'lit';
  const files = findFiles(detection.frontend.sourceRoot, (file) => {
    if (!entry.extensions.some((ext) => file.endsWith(ext))) return false;
    if (/\.(spec|test|stories|d)\.[jt]sx?$/.test(file)) return false;
    if (entry.filePredicate && !entry.filePredicate(file, detection)) return false;
    if (!naive) return true;
    const relPath = rel(detection.frontend.sourceRoot, file);
    return NAIVE_PATH.test(relPath) || PASCAL_CASE.test(path.basename(file, path.extname(file)));
  }, {maxDepth: 10});

  const componentIndex = buildComponentIndex(files, (file) => path.basename(file, path.extname(file)));

  const components = [];
  const errors = [];
  for (const file of files) {
    const source = readText(file) ?? '';
    const parsed = await entry.parse(file, source, {catalogue: catalogue.entries, componentIndex, templateFor});
    const relPath = rel(detection.appPath, file);
    if (parsed.error) errors.push({file: relPath, error: parsed.error});
    components.push({
      name: parsed.name,
      file: relPath,
      kind: classify(rel(detection.frontend.sourceRoot, file)),
      framework: entry.label,
      props: parsed.props ?? [],
      testIds: parsed.testIds ?? [],
      elements: parsed.elements ?? [],
      skippedElements: parsed.skippedElements ?? 0,
    });
  }
  return {components, errors, naive, catalogue, templateFor};
}

/**
 * Join the extracted elements onto the routes that render them, keyed by route path.
 *
 * This is the file a recording is repaired against: a codegen step carries a URL, the URL
 * gives a route, and the route gives the labels its fields actually have. A route whose
 * component could not be resolved is left out entirely rather than written empty — "no
 * elements" and "unknown" have to stay distinguishable.
 */
export function buildLabelDictionary(components: ComponentRecord[], routes: RouteRecord[]): LabelDictionaryReport['routes'] {
  const byFile = new Map(components.map((component) => [component.file, component]));
  const dictionary: LabelDictionaryReport['routes'] = {};
  for (const route of routes) {
    if (!route.component) continue;
    const component = byFile.get(route.component);
    if (!component || component.elements.length === 0) continue;
    dictionary[route.path] = {
      component: route.component,
      elements: component.elements,
    };
  }
  return dictionary;
}

/**
 * A test-id found in source is a strategy *candidate*: nothing here has proved it resolves to
 * exactly one element on a rendered page, which is what the map requires. The shape is validated
 * against the generator's closed vocabulary so the two cannot drift apart.
 */
function locatorSpecFor(value: string) {
  const spec = {strategy: 'getByTestId', args: [value]};
  if (!STRATEGIES.includes(spec.strategy)) {
    throw new Error(`getByTestId is no longer in the generator's locator vocabulary: ${STRATEGIES.join(', ')}`);
  }
  return spec;
}

function render(detection: DetectionResult, {components, errors, naive, catalogue}: ComponentCollection) {
  const sorted = [...components].sort((a, b) => a.file.localeCompare(b.file));
  const testIdRows = [];
  for (const component of sorted) {
    for (const hit of component.testIds) {
      testIdRows.push([
        `\`${component.file}\``,
        `\`${hit.attr}\``,
        `\`${hit.value}\``,
        `\`${JSON.stringify(locatorSpecFor(hit.value))}\``,
      ]);
    }
  }
  const conventions = unique(sorted.flatMap((c) => c.testIds.map((t) => t.attr)));
  const elementRows = [];
  for (const component of sorted) {
    for (const element of component.elements ?? []) {
      elementRows.push([
        `\`${component.file}\``,
        `\`${element.name}\``,
        element.component,
        element.label,
        element.rung,
        `\`${JSON.stringify(element.locator)}\``,
      ]);
    }
  }

  return [
    header('Frontend components', detection, [
      `**Components found**: ${sorted.length}${naive ? ' (naive listing — no parser for this framework)' : ''}`,
      `**Test-id convention**: ${conventions.length > 0 ? conventions.map((c) => `\`${c}\``).join(', ') : 'none found — this app tags no element with any of ' + TEST_ID_ATTRS.map((a) => `\`${a}\``).join(', ')}`,
      `**Elements extracted**: ${elementRows.length} (${sorted.reduce((n, c) => n + (c.skippedElements ?? 0), 0)} skipped — recognised controls with no resolvable label)`,
      `**Label catalogue**: ${catalogue.label}${catalogue.size > 0 ? ` — ${catalogue.size} key(s)` : ''}`,
      `**Parse errors**: ${errors.length}`,
    ]),
    table(['Component', 'File', 'Kind', 'Framework', 'Props'], sorted.map((component) => [
      component.name,
      `\`${component.file}\``,
      component.kind,
      component.framework,
      component.props.length > 0 ? component.props.map((p) => `\`${p}\``).join(', ') : null,
    ])),
    '',
    '## Suggested test-id locators — UNVERIFIED',
    '',
    testIdRows.length === 0
      ? 'No test-id attribute of any convention appears in this app\'s markup, so there is nothing to suggest here — see the extracted elements below, which reach the ladder by label instead.'
      : 'Each row is a **candidate**, not a locator. Static source cannot show that a value resolves to exactly one element on a rendered page, so a spec built from one stays `// UNVERIFIED` until a recording confirms it.',
    '',
    testIdRows.length > 0 ? table(['File', 'Attribute', 'Value', 'Suggested locator spec'], testIdRows) : '',
    '',
    '## Extracted elements — UNVERIFIED',
    '',
    elementRows.length === 0
      ? 'No element carried a label, test id or named attribute this extractor could resolve.'
      : 'One row per element the markup describes well enough to locate. **Rung** is its place on the'
        + ' locator ladder (`scripts/framework-generator/locator-ladder.mjs`), 1 best. These are'
        + ' *candidates*: static source cannot prove a locator resolves to exactly one element on a'
        + ' rendered page, so a spec built from one carries `// UNVERIFIED` until a recording confirms it.',
    '',
    elementRows.length > 0 ? table(['File', 'Name', 'Kind', 'Label', 'Rung', 'Locator spec'], elementRows) : '',
    errors.length > 0 ? `\n## Parse errors\n\n${table(['File', 'Error'], errors.map((e) => [`\`${e.file}\``, e.error]))}` : '',
  ].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs();
  const detection = detect(resolveAppPath(args.app), {frontendRoot: args.frontendRoot});
  const result = await collectComponents(detection);
  const written = writeReport({
    outFile: outPath(args, 'frontend-components.md'),
    body: render(detection, result),
    data: {app: detection.appPath, framework: detection.frontend.framework, components: result.components},
    dryRun: Boolean(args.dryRun),
  });
  const elementCount = result.components.reduce((n, c) => n + c.elements.length, 0);
  const skipped = result.components.reduce((n, c) => n + c.skippedElements, 0);
  const summary = [
    `${result.components.length} component(s), ${elementCount} element(s) (${skipped} skipped — no resolvable label), `
    + `${result.components.reduce((n, c) => n + c.testIds.length, 0)} test-id(s), ${result.errors.length} parse error(s)`,
  ];

  // The dictionary needs the route table to key on, so it is written only once routes.mjs has
  // run. Skipping it is a normal first-run outcome, not a failure — say so and carry on.
  const routesFile = path.join(ANALYSIS_DIR, 'pages-and-routes.json');
  const routeData = readJson<RoutesReport>(routesFile);
  if (!args.dryRun && routeData?.routes) {
    const dictionary = buildLabelDictionary(result.components, routeData.routes);
    const outFile = path.join(ANALYSIS_DIR, 'label-dictionary.json');
    fs.writeFileSync(outFile, `${JSON.stringify({
      app: detection.appPath,
      framework: detection.frontend.framework,
      catalogue: result.catalogue.id,
      routes: dictionary,
    }, null, 2)}\n`, 'utf8');
    written.written.push(rel(REPO_ROOT, outFile));
    summary.push(`${Object.keys(dictionary).length} route(s) carry elements`);
  } else if (!args.dryRun) {
    summary.push('no analysis/pages-and-routes.json yet — run routes.mjs, then re-run this to write label-dictionary.json');
  }

  reportWritten(written, summary);
}

export {render as renderComponents};
