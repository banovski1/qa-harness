// One-shot migration helper: rewrite `strategy: css` locators in a map file as the
// `strategy: template` form, but only where a configured template reproduces the
// selector exactly. Prints what it changed and leaves everything else alone.
//
//   node to-templates.mjs ui-map-results/application-map/<slug>.yaml [--write]

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

const [target, ...flags] = process.argv.slice(2);
const write = flags.includes('--write');
const templates = yaml.load(
  readFileSync(join('scripts', 'framework-generator', 'generator-config.yaml'), 'utf8'),
)?.locatorTemplates ?? {};

// Turn each template into a regex that recovers the label from a rendered selector.
const matchers = Object.entries(templates).map(([id, pattern]) => {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { id, re: new RegExp(`^${escaped.replaceAll('\\{label\\}', '(.+?)')}$`) };
});

const lines = readFileSync(target, 'utf8').split('\n');
const changes = [];

const out = lines.map((line) => {
  const m = /^(\s*locator: \{ strategy: css, args: \[")(.*)("\] \})$/.exec(line);
  if (!m) return line;
  const selector = m[2].replace(/\\"/g, '"');

  for (const { id, re } of matchers) {
    const hit = re.exec(selector);
    if (!hit) continue;
    const label = hit[1].replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const indent = line.slice(0, line.indexOf('locator:'));
    changes.push(`${id}("${label}")  <-  ${selector}`);
    return `${indent}locator: { strategy: template, args: ["${id}"], name: "${label}" }`;
  }
  return line;
});

for (const c of changes) console.log(`  ${c}`);
console.log(`${changes.length} locator(s) ${write ? 'rewritten' : 'would be rewritten'} in ${target}`);
if (write) writeFileSync(target, out.join('\n'));
