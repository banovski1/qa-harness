#!/usr/bin/env node
// Gate for the api-map. Purely static — this never calls the real API, only
// the YAML files under apiMapDir. Parallel to check-analysis.mjs.
//
//   node scripts/framework-generator/check-api-map.mjs [--strict <resource>...]
//
// Run from the repo root. Exits non-zero on any failure. `--strict` additionally
// promotes that resource's droppedFields warnings to failures.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { METHODS, SOURCES } from './request-spec.mjs';
import { readApiMap } from './api-map-reader.mjs';

const strictArgIndex = process.argv.indexOf('--strict');
const strictTargets = new Set(
  (strictArgIndex === -1 ? [] : process.argv.slice(strictArgIndex + 1)).map((s) => s.replace(/\.yaml$/, '')),
);

const rawConfig = yaml.load(readFileSync(join('scripts', 'framework-generator', 'generator-config.yaml'), 'utf8'));
const config = {
  apiMapDir: process.env.API_MAP_DIR ?? rawConfig.apiMapDir ?? join('analysis', 'api-map'),
  // This gate checks whatever files are on disk regardless of whether generation
  // is toggled on, so `enabled` is forced true here rather than read from config.
  api: { include: {}, exclude: {}, ...(rawConfig.api ?? {}), enabled: true },
};

const failures = [];
const warnings = [];

if (!existsSync(config.apiMapDir)) {
  console.log(`[check-api-map] ${config.apiMapDir} does not exist — nothing to check. Run smart-api-map.mjs first.`);
  process.exit(0);
}

// ---- schema-level checks, per raw file ---------------------------------------

const files = readdirSync(config.apiMapDir).filter((f) => f.endsWith('.yaml')).sort();
const allOperationIds = new Map(); // operationId -> [files]

for (const file of files) {
  const raw = yaml.load(readFileSync(join(config.apiMapDir, file), 'utf8'));
  if (!raw?.resource) { failures.push(`${file}: no 'resource:' key`); continue; }
  if (raw.source && !SOURCES.includes(raw.source)) {
    failures.push(`${file}: unknown source '${raw.source}'. Known: ${SOURCES.join(', ')}`);
  }

  for (const op of Array.isArray(raw.operations) ? raw.operations : []) {
    if (!op?.operationId) { failures.push(`${file}: an operation has no 'operationId'`); continue; }
    if (!METHODS.includes(op.method)) {
      failures.push(`${file}: ${op.operationId} has unknown method '${op.method}'. Known: ${METHODS.join(', ')}`);
    }
    if (!op.path || !/^\//.test(op.path)) {
      failures.push(`${file}: ${op.operationId} path is not a canonical path: ${op.path}`);
    }

    if (!allOperationIds.has(op.operationId)) allOperationIds.set(op.operationId, []);
    allOperationIds.get(op.operationId).push(file);

    // pathParams declared must match {placeholders} in the path, and vice versa.
    const placeholders = [...String(op.path ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
    const declared = (op.pathParams ?? []).map((p) => p.name);
    for (const name of placeholders) {
      if (!declared.includes(name)) failures.push(`${file}: ${op.operationId} path has '{${name}}' with no matching pathParams entry`);
    }
    for (const name of declared) {
      if (!placeholders.includes(name)) failures.push(`${file}: ${op.operationId} declares pathParams '${name}' not present in the path`);
    }

    if (Array.isArray(op.droppedFields) && op.droppedFields.length > 0) {
      const msg = `${file}: ${op.operationId} dropped field(s) during normalization: ${op.droppedFields.join('; ')}`;
      if (strictTargets.has(raw.resource) || strictTargets.has(file.replace(/\.yaml$/, ''))) failures.push(msg);
      else warnings.push(msg);
    }
  }
}

for (const [operationId, inFiles] of allOperationIds) {
  if (inFiles.length > 1) failures.push(`duplicate operationId '${operationId}' across ${inFiles.join(', ')}`);
}

// ---- model-level checks. Inherits readApiMap's own throws on malformed files.

const model = readApiMap(config);

const includeTags = config.api.include?.tags ?? [];
const excludeTags = config.api.exclude?.tags ?? [];
const knownResources = new Set(files.map((f) => yaml.load(readFileSync(join(config.apiMapDir, f), 'utf8'))?.resource));
for (const tag of [...includeTags, ...excludeTags]) {
  if (!knownResources.has(tag)) warnings.push(`api.include/exclude references tag '${tag}' that matches no api-map file`);
}

// ---- report -------------------------------------------------------------------

for (const w of warnings) console.warn(`[check-api-map] warn  ${w}`);
for (const f of failures) console.error(`[check-api-map] FAIL  ${f}`);

console.log(
  `[check-api-map] ${files.length} file(s), ${model.stats.resources} resource(s), `
  + `${model.stats.operations} operation(s), ${model.stats.droppedFields} dropped field(s).`,
);

if (failures.length > 0) {
  console.error(`[check-api-map] ${failures.length} failure(s).`);
  process.exit(1);
}
console.log(`[check-api-map] ok${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
