#!/usr/bin/env node
// Pulls (or loads) the target app's API spec and normalizes it into this
// repo's own request vocabulary, one YAML file per resource under
// analysis/<app>/api-map/. Deterministic — no browser, no AI judgment is
// needed to parse a self-describing JSON document.
//
//   npm run smart-api-map --prefix scripts/framework-generator -- [app-config.yaml] [--strict]
//
// Run from the repo root. Tries apiSpec.specUrl/specPath first; on failure,
// falls back to apiSpec.fallbackSpec (already in request-spec vocabulary).
// Fails loudly if neither resolves — never writes a silently empty map.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { fromOpenApi, fromFallback, toYamlObject } from './request-spec.js';
import { appAnalysisDir } from '../project-config.js';
import { errorMessage, isRecord, list, record } from './types.js';
import type { Operation } from './types.js';

interface ApiSpecConfig { specUrl?: string; specPath?: string; fallbackSpec?: string; fetchAuth?: { header?: string; valueFromEnv?: string } }
interface MappedResource { resource: string; source: string; sourceRef: string | null; operations: Operation[] }

const DEFAULT_APP_CONFIG = 'app-config.yaml';

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const configPath = args.find((a) => !a.startsWith('--')) ?? DEFAULT_APP_CONFIG;
  const apiMapDir = process.env.API_MAP_DIR ?? join(appAnalysisDir(), 'api-map');

  if (!existsSync(configPath)) throw new Error(`Config file not found: ${configPath}`);
  const appConfig = yaml.load(readFileSync(configPath, 'utf8'));
  const rawApiSpec = isRecord(appConfig) ? appConfig.apiSpec : null;
  if (!isRecord(rawApiSpec)) throw new Error(`No 'apiSpec:' block in ${configPath}. Add specUrl/specPath and, optionally, fallbackSpec.`);
  const auth = isRecord(rawApiSpec.fetchAuth) ? rawApiSpec.fetchAuth : {};
  const apiSpec: ApiSpecConfig = {
    specUrl: rawApiSpec.specUrl == null ? undefined : String(rawApiSpec.specUrl),
    specPath: rawApiSpec.specPath == null ? undefined : String(rawApiSpec.specPath),
    fallbackSpec: rawApiSpec.fallbackSpec == null ? undefined : String(rawApiSpec.fallbackSpec),
    fetchAuth: { header: auth.header == null ? undefined : String(auth.header), valueFromEnv: auth.valueFromEnv == null ? undefined : String(auth.valueFromEnv) },
  };

  let pulled = null;
  let pullError: unknown = null;
  if (apiSpec.specUrl || apiSpec.specPath) {
    try {
      pulled = await pullOpenApi(apiSpec);
    } catch (err) {
      pullError = err;
    }
  }

  let resources;
  let source;
  if (pulled) {
    resources = pulled;
    source = 'openapi';
    console.log(`[smart-api-map] pulled spec from ${apiSpec.specUrl ?? apiSpec.specPath}`);
  } else if (apiSpec.fallbackSpec) {
    if (pullError) console.warn(`[smart-api-map] spec pull failed (${errorMessage(pullError)}); using fallbackSpec`);
    resources = loadFallback(apiSpec.fallbackSpec);
    source = 'manual';
  } else {
    throw new Error(
      `Could not pull an OpenAPI spec${pullError ? ` (${errorMessage(pullError)})` : ''} and no 'apiSpec.fallbackSpec' `
      + 'is configured. Set apiSpec.specUrl/specPath to a reachable doc, or add a fallbackSpec file.',
    );
  }

  const union = mergeFallbackExtras(resources, apiSpec.fallbackSpec, source);

  mkdirSync(apiMapDir, { recursive: true });
  let opCount = 0;
  for (const resource of union) {
    const filePath = join(apiMapDir, `${toKebabResource(resource.resource)}.yaml`);
    const doc = {
      resource: resource.resource,
      source: resource.source,
      ...(resource.sourceRef ? { sourceRef: resource.sourceRef } : {}),
      operations: resource.operations.map(toYamlObject),
    };
    writeFileSync(filePath, yaml.dump(doc, { lineWidth: -1 }), 'utf8');
    opCount += resource.operations.length;
  }

  console.log(`[smart-api-map] wrote ${union.length} resource(s), ${opCount} operation(s) to ${apiMapDir} (source: ${source})`);
}

main().catch((err: unknown) => {
  console.error('[smart-api-map] ERROR', errorMessage(err));
  process.exit(1);
});

// ---- pulling -------------------------------------------------------------

async function pullOpenApi(apiSpec: ApiSpecConfig): Promise<MappedResource[]> {
  const raw = apiSpec.specPath ? readFileSync(apiSpec.specPath, 'utf8') : await fetchSpec(apiSpec);
  const doc: unknown = JSON.parse(raw);
  return normalizeOpenApiDoc(doc);
}

async function fetchSpec(apiSpec: ApiSpecConfig): Promise<string> {
  const headers: Record<string, string> = {};
  const auth = apiSpec.fetchAuth;
  if (auth?.header && auth?.valueFromEnv) {
    const value = process.env[auth.valueFromEnv];
    if (!value) throw new Error(`env var '${auth.valueFromEnv}' (apiSpec.fetchAuth.valueFromEnv) is not set`);
    headers[auth.header] = value;
  }
  if (!apiSpec.specUrl) throw new Error('apiSpec.specUrl is required to fetch a spec');
  const response = await fetch(apiSpec.specUrl, { headers });
  if (!response.ok) throw new Error(`GET ${apiSpec.specUrl} -> ${response.status} ${response.statusText}`);
  return response.text();
}

/** OpenAPI doc -> resource[] in this repo's vocabulary, grouped by first tag (or 'default'). */
function normalizeOpenApiDoc(value: unknown): MappedResource[] {
  const doc = record(value);
  const byResource = new Map<string, Operation[]>();
  for (const [path, methods] of Object.entries(record(doc.paths ?? {}))) {
    for (const [method, value] of Object.entries(record(methods))) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      const operation = record(value);
      const resource = String(list(operation.tags)[0] ?? 'default');
      const operationId = String(operation.operationId ?? `${method}${path.replace(/[{}\/]/g, '_')}`);
      const op = fromOpenApi({
        operationId,
        resource,
        method,
        path,
        parameters: operation.parameters,
        requestBody: operation.requestBody,
        responses: operation.responses,
      });
      const operations = byResource.get(resource) ?? [];
      operations.push(op);
      byResource.set(resource, operations);
    }
  }
  return [...byResource.entries()].map(([resource, operations]) => ({
    resource, source: 'openapi', sourceRef: null, operations,
  }));
}

// ---- fallback --------------------------------------------------------------

function loadFallback(path: string): MappedResource[] {
  if (!existsSync(path)) throw new Error(`apiSpec.fallbackSpec file not found: ${path}`);
  const raw = yaml.load(readFileSync(path, 'utf8'));
  if (!isRecord(raw) || !Array.isArray(raw.resources)) throw new Error(`${path}: expected a top-level 'resources:' list`);
  return raw.resources.map(record).map((r) => ({
    resource: String(r.resource),
    source: 'manual',
    sourceRef: null,
    operations: list(r.operations).map((op) => fromFallback(op, r.resource)),
  }));
}

/**
 * When a pulled spec exists AND a fallback file is configured, the fallback's
 * operationIds not already present in the pulled spec are unioned in — this
 * is how an app with a partial OpenAPI doc still gets full coverage. Pulled
 * spec wins on a genuine operationId collision.
 */
function mergeFallbackExtras(resources: MappedResource[], fallbackPath: string | undefined, source: string): MappedResource[] {
  if (source !== 'openapi' || !fallbackPath || !existsSync(fallbackPath)) return resources;
  const fallback = loadFallback(fallbackPath);
  const byResource = new Map(resources.map((r) => [r.resource, r]));

  for (const fbResource of fallback) {
    const existing = byResource.get(fbResource.resource);
    if (!existing) {
      byResource.set(fbResource.resource, fbResource);
      continue;
    }
    const knownIds = new Set(existing.operations.map((op) => op.operationId));
    for (const op of fbResource.operations) {
      if (knownIds.has(op.operationId)) {
        console.warn(`[smart-api-map] fallback operation '${op.operationId}' already present from pulled spec — keeping pulled version`);
        continue;
      }
      existing.operations.push(op);
    }
  }
  return [...byResource.values()];
}

function toKebabResource(resource: unknown): string {
  return String(resource).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9]+/g, '-').toLowerCase().replace(/^-+|-+$/g, '');
}
