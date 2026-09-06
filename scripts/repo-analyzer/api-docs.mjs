#!/usr/bin/env node
// Skill D — the API surface `test-preconditions` reasons about, found in three tiers:
//   A  an existing spec shipped with the app        (used verbatim, then stop)
//   B  the backend framework's own route convention (via the backend registry)
//   C  anything only resolvable once the app boots  (recorded, never guessed)
//
//   node scripts/repo-analyzer/api-docs.mjs [--app <app-clone>] [--cross-check <a known-good spec>]

import path from 'node:path';
import yaml from 'js-yaml';
import {detect} from './detect.mjs';
import {paramsOf} from './registry-backend.mjs';
import {header, outPath, reportWritten, table, writeReport} from './report.mjs';
import {REPO_ROOT, findFiles, parseArgs, readText, rel, resolveAppPath, unique} from './util.mjs';

const SPEC_NAMES = /^(openapi|swagger|api[-_.]?spec)\.(ya?ml|json)$/i;

function loadSpec(file) {
  const text = readText(file);
  if (!text) return null;
  try {
    return file.endsWith('.json') ? JSON.parse(text) : yaml.load(text);
  } catch {
    return null;
  }
}

/** Tier A — an OpenAPI/Swagger document that ships with the app is authoritative. */
function tierA(appPath) {
  for (const file of findFiles(appPath, (_f, base) => SPEC_NAMES.test(base), {maxDepth: 5})) {
    const spec = loadSpec(file);
    if (!spec?.paths) continue;
    const endpoints = [];
    for (const [routePath, operations] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(operations ?? {})) {
        if (typeof operation !== 'object') continue;
        endpoints.push({
          path: routePath,
          methods: [method.toUpperCase()],
          purpose: operation.summary ?? operation.operationId ?? (operation.tags ?? []).join(', ') ?? null,
          params: paramsOf(routePath),
          source: rel(appPath, file),
        });
      }
    }
    if (endpoints.length > 0) {
      return {tier: 'A', how: `spec file \`${rel(appPath, file)}\``, endpoints, specFile: file, servers: spec.servers ?? []};
    }
  }
  return null;
}

/** Tier B — the backend framework declares its routes; the registry knows where. */
async function tierB(detection, apiPrefix) {
  if (!detection.backend) return null;
  const all = await detection.backend.entry.routes(detection.backend.root);
  const endpoints = all
    .filter((route) => route.path.startsWith(apiPrefix))
    .map((route) => ({
      path: route.path,
      methods: route.methods,
      purpose: route.purpose ? String(route.purpose).split('\\').pop() : null,
      params: paramsOf(route.path),
      source: route.source,
    }));
  if (endpoints.length === 0) return null;
  return {tier: 'B', how: `${detection.backend.label} — ${detection.backend.method}`, endpoints, servers: []};
}

function mergeByPath(endpoints) {
  const merged = new Map();
  for (const endpoint of endpoints) {
    const existing = merged.get(endpoint.path);
    if (existing) {
      existing.methods = unique([...existing.methods, ...endpoint.methods]).sort();
      existing.purpose = existing.purpose ?? endpoint.purpose;
    } else {
      merged.set(endpoint.path, {...endpoint, methods: unique(endpoint.methods).sort()});
    }
  }
  return [...merged.values()].sort((a, b) => a.path.localeCompare(b.path));
}

/** Compare the extracted path set against a known-good spec, so a broken extractor is visible. */
function crossCheck(endpoints, specFile) {
  const spec = loadSpec(specFile);
  if (!spec?.paths) return null;
  const specPaths = new Set(Object.keys(spec.paths));
  const foundPaths = new Set(endpoints.map((e) => e.path));
  return {
    specFile: rel(REPO_ROOT, specFile),
    specCount: specPaths.size,
    foundCount: foundPaths.size,
    missing: [...specPaths].filter((p) => !foundPaths.has(p)).sort(),
    extra: [...foundPaths].filter((p) => !specPaths.has(p)).sort(),
  };
}

function render(detection, result, apiPrefix, comparison) {
  const endpoints = mergeByPath(result?.endpoints ?? []);
  const lines = [
    header('API documentation', detection, [
      `**Tier**: ${result ? `${result.tier} — ${result.how}` : 'C — nothing statically resolvable'}`,
      `**Endpoints found**: ${endpoints.length}`,
      `**API prefix**: \`${apiPrefix}\``,
    ]),
    table(['Endpoint', 'Methods', 'Purpose', 'Params', 'Source'], endpoints.map((endpoint) => [
      `\`${endpoint.path}\``,
      endpoint.methods.join(', '),
      endpoint.purpose,
      endpoint.params.length > 0 ? endpoint.params.map((p) => `\`{${p}}\``).join(', ') : null,
      `\`${endpoint.source}\``,
    ])),
    '',
    '## Tier C — requires running the app',
    '',
    result
      ? 'Endpoints composed by middleware or registered at boot do not appear in source and are not listed above. Anything a test needs that is missing here has to be confirmed against a running instance — it is absent, not disproven.'
      : 'No spec file was found and no backend route convention matched this app. Every endpoint therefore falls into this tier: run the app and observe its traffic. Nothing has been guessed.',
    '',
  ];
  if (comparison) {
    lines.push(
      '## Cross-check',
      '',
      `Compared against \`${comparison.specFile}\`: ${comparison.foundCount} extracted vs ${comparison.specCount} in the spec.`,
      '',
      table(['Delta', 'Count', 'Examples'], [
        ['In the spec, not extracted', comparison.missing.length, comparison.missing.slice(0, 5).map((p) => `\`${p}\``).join(', ')],
        ['Extracted, not in the spec', comparison.extra.length, comparison.extra.slice(0, 5).map((p) => `\`${p}\``).join(', ')],
      ]),
      '',
    );
  }
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs();
  const appPath = resolveAppPath(args.app);
  const detection = detect(appPath, {frontendRoot: args.frontendRoot, backendRoot: args.backendRoot});
  const apiPrefix = args.apiPrefix ? String(args.apiPrefix) : '/api';
  const result = tierA(appPath) ?? (await tierB(detection, apiPrefix));
  const comparison = args.crossCheck
    ? crossCheck(mergeByPath(result?.endpoints ?? []), path.resolve(REPO_ROOT, String(args.crossCheck)))
    : null;
  const written = writeReport({
    outFile: outPath(args, 'api-documentation.md'),
    body: render(detection, result, apiPrefix, comparison),
    data: {app: appPath, tier: result?.tier ?? 'C', how: result?.how ?? null, endpoints: mergeByPath(result?.endpoints ?? [])},
    dryRun: Boolean(args.dryRun),
  });
  reportWritten(written, [`tier ${result?.tier ?? 'C'}: ${mergeByPath(result?.endpoints ?? []).length} endpoint(s)`]);
}

export {tierA, tierB, mergeByPath, crossCheck, render as renderApiDocs};
