#!/usr/bin/env node
// Skill A — every UI component in the app, parsed with its own framework's parser, plus any
// test-id attribute already present in the markup as a *suggested* locator strategy.
//
//   node scripts/repo-analyzer/components.mjs --app ../orangehrm [--dry-run]

import path from 'node:path';
import {STRATEGIES} from '../framework-generator/locator-spec.mjs';
import {detect} from './detect.mjs';
import {TEST_ID_ATTRS} from './parsers.mjs';
import {header, outPath, reportWritten, table, writeReport} from './report.mjs';
import {findFiles, parseArgs, readText, rel, resolveAppPath, unique} from './util.mjs';

// A parser-less framework gets a naive listing, and a naive listing must stay conservative:
// only files that look like components by convention, never every source file in the tree.
const NAIVE_PATH = /(^|\/)(components?|pages|views|screens|templates)(\/|$)/;
const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;

function classify(relPath) {
  if (/(^|\/)pages?(\/|$)/.test(relPath)) return 'page';
  if (/(^|\/)(views|screens)(\/|$)/.test(relPath)) return 'view';
  if (/(^|\/)layouts?(\/|$)/.test(relPath)) return 'layout';
  return 'component';
}

export async function collectComponents(detection) {
  const entry = detection.frontend.entry;
  const naive = Boolean(entry.naive) || entry.id === 'lit';
  const files = findFiles(detection.frontend.sourceRoot, (file) => {
    if (!entry.extensions.some((ext) => file.endsWith(ext))) return false;
    if (/\.(spec|test|stories|d)\.[jt]sx?$/.test(file)) return false;
    if (!naive) return true;
    const relPath = rel(detection.frontend.sourceRoot, file);
    return NAIVE_PATH.test(relPath) || PASCAL_CASE.test(path.basename(file, path.extname(file)));
  }, {maxDepth: 10});

  const components = [];
  const errors = [];
  for (const file of files) {
    const source = readText(file) ?? '';
    const parsed = await entry.parse(file, source);
    const relPath = rel(detection.appPath, file);
    if (parsed.error) errors.push({file: relPath, error: parsed.error});
    components.push({
      name: parsed.name,
      file: relPath,
      kind: classify(rel(detection.frontend.sourceRoot, file)),
      framework: entry.label,
      props: parsed.props ?? [],
      testIds: parsed.testIds ?? [],
    });
  }
  return {components, errors, naive};
}

/**
 * A test-id found in source is a strategy *candidate*: nothing here has proved it resolves to
 * exactly one element on a rendered page, which is what the map requires. The shape is validated
 * against the generator's closed vocabulary so the two cannot drift apart.
 */
function locatorSpecFor(value) {
  const spec = {strategy: 'getByTestId', args: [value]};
  if (!STRATEGIES.includes(spec.strategy)) {
    throw new Error(`getByTestId is no longer in the generator's locator vocabulary: ${STRATEGIES.join(', ')}`);
  }
  return spec;
}

function render(detection, {components, errors, naive}) {
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

  return [
    header('Frontend components', detection, [
      `**Components found**: ${sorted.length}${naive ? ' (naive listing — no parser for this framework)' : ''}`,
      `**Test-id convention**: ${conventions.length > 0 ? conventions.map((c) => `\`${c}\``).join(', ') : 'none found — this app tags no element with any of ' + TEST_ID_ATTRS.map((a) => `\`${a}\``).join(', ')}`,
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
      ? 'No test-id attribute of any convention appears in this app\'s markup, so there is nothing to suggest. Locators for this app have to come from a live pass (`smart-map` or a codegen recording).'
      : 'Each row is a **candidate**, not a locator. Static source cannot show that a value resolves to exactly one element on a rendered page, so none of these may enter `ui-map-results/` until a live pass confirms it.',
    '',
    testIdRows.length > 0 ? table(['File', 'Attribute', 'Value', 'Suggested locator spec'], testIdRows) : '',
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
  reportWritten(written, [
    `${result.components.length} component(s), ${result.components.reduce((n, c) => n + c.testIds.length, 0)} test-id(s), ${result.errors.length} parse error(s)`,
  ]);
}

export {render as renderComponents};
