// The closed request vocabulary shared by the OpenAPI normalizer, the manual
// fallback spec, and the emitted api-map. Mirrors locator-spec.ts: a small
// enum plus a normalizer, so the generator never has to know whether an
// operation came from a pulled OpenAPI doc or a hand-written fallback file.

import { isRecord, list, record } from './types.js';
import type { Operation, RequestSpecSchema } from './types.js';
export type { Operation, RequestSpecSchema, SchemaProperty } from './types.js';

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
export const SOURCES = ['openapi', 'manual'];

// A deliberate narrowing of JSON Schema. Anything unrepresentable (oneOf,
// allOf, discriminators, $ref cycles) is dropped rather than guessed at, the
// same stance fromMap takes on an unusable locator.
export const SCHEMA_KINDS = ['object', 'array', 'primitive'];

/**
 * @typedef {{ name: string, type: string, required?: boolean, nullable?: boolean }} SchemaProperty
 * @typedef {{ kind: 'object', properties: SchemaProperty[] }
 *          | { kind: 'array', items: RequestSpecSchema }
 *          | { kind: 'primitive', type: string }} RequestSpecSchema
 * @typedef {{ operationId: string, resource: string, method: string, path: string,
 *             pathParams: {name: string, type: string}[],
 *             queryParams: {name: string, type: string, required: boolean}[],
 *             requestBody: {contentType: string, schema: RequestSpecSchema}|null,
 *             responses: {status: number, contentType: string|null, schema: RequestSpecSchema|null}[],
 *             droppedFields: string[] }} Operation
 */

/** Build one normalized Operation from a raw object already in this shape. */
export function fromFallback(value: unknown, resource: unknown): Operation {
  if (!isRecord(value) || !value.operationId) throw new Error(`operation in resource '${resource}' has no operationId`);
  const raw = value;
  if (typeof raw.method !== 'string' || !METHODS.includes(raw.method)) {
    throw new Error(`${raw.operationId}: unknown method '${raw.method}'. Known: ${METHODS.join(', ')}`);
  }
  if (!raw.path || !String(raw.path).startsWith('/')) {
    throw new Error(`${raw.operationId}: path must start with '/', got ${JSON.stringify(raw.path)}`);
  }
  return {
    operationId: String(raw.operationId),
    resource: String(resource),
    method: raw.method,
    path: String(raw.path),
    pathParams: list(raw.pathParams).map(normalizeParam),
    queryParams: list(raw.queryParams).map((p) => ({ ...normalizeParam(p), required: Boolean(record(p).required) })),
    requestBody: raw.requestBody ? normalizeBody(raw.requestBody) : null,
    responses: list(raw.responses).map(normalizeResponse),
    // Carried through rather than reset: an api-map file written from a pulled
    // OpenAPI spec already recorded what fromOpenApi could not represent, and
    // re-reading it here must not silently lose that record.
    droppedFields: Array.isArray(raw.droppedFields) ? raw.droppedFields.map(String) : [],
  };
}

/**
 * Normalize one OpenAPI operation (already resolved to a single (path, method)
 * pair by the caller) into the same Operation shape a fallback file produces.
 * `dropped` accumulates field names this normalizer could not represent, so
 * the caller can report them instead of silently losing coverage.
 */
export function fromOpenApi({ operationId, resource, method, path, parameters, requestBody, responses }: { operationId: string; resource: string; method: string; path: string; parameters?: unknown; requestBody?: unknown; responses?: unknown }): Operation {
  const dropped: string[] = [];
  const pathParams = [];
  const queryParams = [];
  for (const p of list(parameters).map(record)) {
    const type = primitiveTypeOf(p.schema, dropped, `${operationId}.${p.name}`);
    if (p.in === 'path') pathParams.push({ name: String(p.name), type });
    else if (p.in === 'query') queryParams.push({ name: String(p.name), type, required: Boolean(p.required) });
  }

  const bodyJson = jsonContent(requestBody);
  const body = bodyJson
    ? { contentType: 'application/json', schema: schemaFrom(bodyJson.schema, dropped, `${operationId}.requestBody`) }
    : null;

  const out = [];
  for (const [statusText, response] of Object.entries(record(responses ?? {}))) {
    const status = Number(statusText);
    if (!Number.isInteger(status)) continue;
    const json = jsonContent(response);
    out.push({
      status,
      contentType: json ? 'application/json' : null,
      schema: json ? schemaFrom(json.schema, dropped, `${operationId}.responses.${status}`) : null,
    });
  }

  return {
    operationId: String(operationId),
    resource: String(resource),
    method: String(method).toUpperCase(),
    path: String(path),
    pathParams,
    queryParams,
    requestBody: body,
    responses: out,
    droppedFields: dropped,
  };
}

/** Narrow an OpenAPI schema into the closed RequestSpecSchema shape, or null if unrepresentable. */
function schemaFrom(value: unknown, dropped: string[], where: string): RequestSpecSchema | null {
  if (!value) return null;
  const schema = record(value);
  if (schema.oneOf || schema.allOf || schema.anyOf || schema.$ref) {
    dropped.push(`${where}: unrepresentable schema (oneOf/allOf/anyOf/$ref)`);
    return null;
  }
  if (schema.type === 'array') {
    return { kind: 'array', items: schemaFrom(schema.items, dropped, `${where}[]`) ?? { kind: 'primitive', type: 'unknown' } };
  }
  if (schema.type === 'object' || schema.properties) {
    const required = new Set(list(schema.required));
    const properties = [];
    for (const [name, propSchema] of Object.entries(record(schema.properties ?? {}))) {
      // A real-world doc can carry a malformed property with an empty key
      // (seen in OrangeHRM's own spec) — drop it rather than emit an
      // unusable field name, the same "narrow or drop" stance as elsewhere.
      if (!name) { dropped.push(`${where}: property with an empty name dropped`); continue; }
      properties.push({
        name,
        type: primitiveTypeOf(propSchema, dropped, `${where}.${name}`),
        required: required.has(name),
        nullable: Boolean(isRecord(propSchema) && propSchema.nullable),
      });
    }
    return { kind: 'object', properties };
  }
  return { kind: 'primitive', type: primitiveTypeOf(schema, dropped, where) };
}

const PRIMITIVE_TYPES = new Set(['string', 'number', 'integer', 'boolean']);

function primitiveTypeOf(value: unknown, dropped: string[], where: string): string {
  const schema = isRecord(value) ? value : {};
  const type = schema.type;
  if (typeof type === 'string' && PRIMITIVE_TYPES.has(type)) return type === 'integer' ? 'number' : type;
  if (type === 'object' || type === 'array' || schema.properties) {
    dropped.push(`${where}: nested ${type ?? 'object'} narrowed to 'unknown'`);
  }
  return 'unknown';
}

function normalizeParam(p: unknown): { name: string; type: string } {
  if (!isRecord(p) || !p.name) throw new Error(`param is missing 'name'`);
  return { name: String(p.name), type: String(p.type ?? 'string') };
}

function normalizeBody(value: unknown): NonNullable<Operation['requestBody']> {
  const raw = record(value);
  return { contentType: String(raw.contentType ?? 'application/json'), schema: normalizeSchema(raw.schema) };
}

function normalizeResponse(value: unknown): Operation['responses'][number] {
  const raw = record(value);
  return {
    status: Number(raw.status),
    contentType: raw.schema ? String(raw.contentType ?? 'application/json') : null,
    schema: raw.schema ? normalizeSchema(raw.schema) : null,
  };
}

function normalizeSchema(value: unknown): RequestSpecSchema | null {
  if (!value) return null;
  const schema = record(value);
  if (typeof schema.kind !== 'string' || !SCHEMA_KINDS.includes(schema.kind)) {
    throw new Error(`unknown schema kind '${schema.kind}'. Known: ${SCHEMA_KINDS.join(', ')}`);
  }
  if (schema.kind === 'array') return { kind: 'array', items: normalizeSchema(schema.items) };
  if (schema.kind === 'primitive') return { kind: 'primitive', type: String(schema.type ?? 'unknown') };
  return { kind: 'object', properties: list(schema.properties).map((p) => ({ ...normalizeParam(p), required: Boolean(record(p).required), nullable: Boolean(record(p).nullable) })) };
}

/** Emit one Operation as the YAML shape written under analysis/api-map/. */
export function toYamlObject(op: Operation) {
  return {
    operationId: op.operationId,
    method: op.method,
    path: op.path,
    ...(op.pathParams.length ? { pathParams: op.pathParams } : {}),
    ...(op.queryParams.length ? { queryParams: op.queryParams } : {}),
    ...(op.requestBody ? { requestBody: op.requestBody } : {}),
    responses: op.responses,
    ...(op.droppedFields.length ? { droppedFields: op.droppedFields } : {}),
  };
}

function jsonContent(value: unknown): Record<string, unknown> | null {
  if (!isRecord(value) || !isRecord(value.content)) return null;
  const json = value.content['application/json'];
  return isRecord(json) ? json : null;
}
