/** The narrow schema shape request-spec.mjs normalizes an OpenAPI/fallback schema into. */
export type RequestSpecSchema =
  | { kind: 'object'; properties: { name: string; type: string; required?: boolean; nullable?: boolean }[] }
  | { kind: 'array'; items: RequestSpecSchema }
  | { kind: 'primitive'; type: string };

/**
 * Assert that `value` matches `schema`, throwing with a path-qualified message on
 * the first mismatch. 'unknown' typed fields are accepted as-is — the normalizer
 * already recorded them as dropped in the api-map, so re-flagging them here would
 * just repeat a known limitation as a test failure.
 */
export function assertShape(value: unknown, schema: RequestSpecSchema, path = '$'): void {
  if (schema.kind === 'array') {
    if (!Array.isArray(value)) throw new Error(`${path}: expected array, got ${typeof value}`);
    value.forEach((item, i) => assertShape(item, schema.items, `${path}[${i}]`));
    return;
  }
  if (schema.kind === 'object') {
    if (typeof value !== 'object' || value === null) throw new Error(`${path}: expected object, got ${typeof value}`);
    for (const prop of schema.properties) {
      const propValue = (value as Record<string, unknown>)[prop.name];
      if (propValue === undefined) {
        if (prop.required) throw new Error(`${path}.${prop.name}: missing required property`);
        continue;
      }
      if (propValue === null) {
        if (!prop.nullable) throw new Error(`${path}.${prop.name}: null is not allowed`);
        continue;
      }
      assertPrimitive(propValue, prop.type, `${path}.${prop.name}`);
    }
    return;
  }
  assertPrimitive(value, schema.type, path);
}

function assertPrimitive(value: unknown, type: string, path: string): void {
  if (type === 'unknown') return;
  const actual = typeof value;
  if (type === 'number' && actual !== 'number') throw new Error(`${path}: expected number, got ${actual}`);
  if (type === 'string' && actual !== 'string') throw new Error(`${path}: expected string, got ${actual}`);
  if (type === 'boolean' && actual !== 'boolean') throw new Error(`${path}: expected boolean, got ${actual}`);
}
