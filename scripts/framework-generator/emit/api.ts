// Renders the API layer: one client class per resource, the preconditions that
// establish state through it, and the fixtures a spec imports.
import { q, camel, header } from './naming.ts';
import { authFacts } from './auth.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

function docFor(r: any, name: string): string {
  const lead = r.establishes ? `Creating one makes true: ${r.establishes}.`
    : r.ops?.create ? `Action endpoints only: a POST here leaves nothing to read back.`
    : `Read-only: this API declares no create for ${name}.`;
  const requires = r.requires?.length ? `\n *  Requires: ${r.requires.join(', ')} — create those first.` : '';
  return `${lead}${requires}`;
}

function bodyFor(name: string, r: any): string[] {
  const ops = r.ops ?? {};
  const body: string[] = [];
  const doc = (op: any) => op.summary ? `  /** ${op.summary}. */\n` : '';

  if (ops.list) body.push(`${doc(ops.list)}  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {\n    return this.api.get<T>(${q(ops.list.path)}, params);\n  }`);
  if (ops.get) body.push(`${doc(ops.get)}  async get<T = any>(params: Record<string, string | number>): Promise<T> {\n    return this.api.get<T>(fillPath(${q(ops.get.path)}, params));\n  }`);
  if (ops.create) {
    const fields = [...ops.create.requiredFields, ...ops.create.optionalFields];
    const note = ops.create.requiredKnown
      ? `Required by the spec: ${ops.create.requiredFields.join(', ') || 'nothing'}.`
      : `The spec declares fields but not which are mandatory, so nothing is defaulted here.`;
    body.push(
      `  /**\n   * ${ops.create.summary ?? `Create a ${name}`}.\n   *\n   * ${note}\n` +
      (fields.length ? `   * Fields the spec declares: ${fields.join(', ')}.\n` : '') +
      `   */\n  async create<T = any>(data: Record<string, unknown>): Promise<T> {\n    return this.api.post<T>(${q(ops.create.path)}, data);\n  }`);
  }
  if (ops.update) body.push(`${doc(ops.update)}  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {\n    return this.api.${ops.update.method === 'PATCH' ? 'patch' : 'put'}<T>(fillPath(${q(ops.update.path)}, params), data);\n  }`);
  if (ops.delete) body.push(`${doc(ops.delete)}  async remove(params: Record<string, string | number>): Promise<void> {\n    await this.api.delete(fillPath(${q(ops.delete.path)}, params));\n  }`);
  // An action's name has to survive two endpoints that differ only by a trailing
  // id: /candidates/{id}/history and /candidates/{id}/history/{historyId} are a
  // list and a fetch, and naming both getHistory does not compile.
  const takenNames = new Set(['list', 'get', 'create', 'update', 'remove']);
  for (const action of (ops.actions ?? []).slice(0, 12)) {
    const segments = action.path.split('/').filter(Boolean);
    const firstParam = segments.findIndex((seg: string) => /^[{:]/.test(seg));
    const trailing = firstParam === -1 ? segments : segments.slice(firstParam + 1);
    const literals = trailing.filter((seg: string) => !/^[{:]/.test(seg));
    const endsWithParam = /^[{:]/.test(trailing[trailing.length - 1] ?? '');
    const base = camel([
      action.method.toLowerCase(),
      ...(literals.length ? literals : ['record']),
      ...(endsWithParam && literals.length ? ['by', 'id'] : []),
    ].join(' '));
    // Still a last resort: two different paths can reduce to the same words.
    let name = base;
    for (let n = 2; takenNames.has(name); n++) name = `${base}${n}`;
    takenNames.add(name);
    body.push(`${doc(action)}  async ${name}<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {\n    return this.api.call<T>(${q(action.method)}, fillPath(${q(action.path)}, params), { data });\n  }`);
  }

  return body;
}

/** The property name each resource takes on the Api object, collisions resolved once. */
export function resourceProperties(model: AppModel): Map<string, string> {
  const RESERVED = new Set(['http', 'constructor']);
  const property = new Map<string, string>();
  for (const name of Object.keys((model.api.resources ?? {}) as Record<string, unknown>)) {
    let candidate = camel(name);
    while (RESERVED.has(candidate) || [...property.values()].includes(candidate)) candidate += 'Resource';
    property.set(name, candidate);
  }
  return property;
}

/** One resource, one file: the CRUD the API declares and nothing invented. */
export function renderResource(name: string, resource: any, model: AppModel): string {
  const body = bodyFor(name, resource);
  return [
    header(model),
    `import { fillPath, type ApiClient } from './ApiClient.ts';`,
    '',
    `/** ${docFor(resource, name)} */`,
    `export class ${name}Api {`,
    `  constructor(private readonly api: ApiClient) {}`,
    '',
    body.join('\n\n') || '  // The API declares no operations for this resource.',
    `}`,
    '',
  ].join('\n');
}

/** Every resource the API declares, on one object. */
export function renderApi(model: AppModel): string {
  const property = resourceProperties(model);
  const names = [...property.keys()];
  return [
    header(model),
    `import type { APIRequestContext } from '@playwright/test';`,
    `import { ApiClient, idOf } from './ApiClient.ts';`,
    `import { BASE_URL } from '../config/constants.ts';`,
    ...names.map(n => `import { ${n}Api } from './${n}Api.ts';`),
    '',
    `/** Every resource the API declares, on one object. */`,
    `export class Api {`,
    `  readonly http: ApiClient;`,
    ...names.map(n => `  readonly ${property.get(n)}: ${n}Api;`),
    '',
    `  constructor(request: APIRequestContext, baseUrl = BASE_URL, headers: Record<string, string> = {}) {`,
    `    this.http = new ApiClient(request, baseUrl, headers);`,
    ...names.map(n => `    this.${property.get(n)} = new ${n}Api(this.http);`),
    `  }`,
    `}`,
    '',
    `export { idOf };`,
    '',
  ].join('\n');
}

/** The state a test needs before it starts, and how to undo it afterwards. */
export function renderPreconditions(model: AppModel): string {
  const resources = (model.api as any).resources as Record<string, any>;
  // Only resources whose creation can be observed afterwards. A login is not a fixture.
  const creatable = Object.entries(resources).filter(([, r]) => (r as any).establishes);
  // Must match the property names Api actually exposes, collisions included.
  const property = resourceProperties(model);
  const prop = (name: string) => property.get(name) ?? camel(name);
  const lines: string[] = [
    header(model),
    `import { Api, idOf } from './Api.ts';`,
    `import { uniqueName } from '../utils/unique-name.ts';`,
    '',
    `/**`,
    ` * Establishes state through the API, and remembers how to remove it.`,
    ` *`,
    ` * Each method is named after the sentence it makes true. Dependencies are stated,`,
    ` * never resolved automatically: a helper that quietly created three other records`,
    ` * would make a failing test impossible to read.`,
    ` */`,
    `export class Preconditions {`,
    `  private readonly created: { label: string; undo: () => Promise<void> }[] = [];`,
    '',
    `  constructor(private readonly api: Api) {}`,
    '',
  ];

  for (const [name, r] of creatable) {
    const res = r as any;
    const required = res.ops.create.requiredFields as string[];
    const nameField = [...required, ...res.ops.create.optionalFields].find((f: string) => /^(name|title|firstName|lastName|username)$/i.test(f));
    const defaults = nameField ? `{ ${nameField}: uniqueName(${q(name)}), ...overrides }` : `{ ...overrides }`;
    const deleteOp = res.ops.delete;
    // The field to read out of the response is the one the delete path asks for. Conduit
    // deletes an article by {slug} and never returns an "id", so looking for "id" here
    // would throw on a record that is perfectly addressable.
    const keys = (deleteOp?.path.match(/\{(\w+)\}/g) ?? []).map((s: string) => s.slice(1, -1));
    const idField = keys[keys.length - 1] ?? 'id';
    const undo = deleteOp
      ? `    this.created.push({\n      label: \`${name} \${id}\`,\n      undo: () => this.api.${prop(name)}.remove({ ${keys.map((k: string) => `${k}: id`).join(', ')} }),\n    });`
      : `    // The API declares no delete for ${name}: this record cannot be cleaned up.`;
    lines.push(
      `  /** Makes true: ${res.establishes}.${res.requires.length ? ` Needs an existing ${res.requires.join(' and ')} — pass their ids in overrides.` : ''} */`,
      `  async ${camel(name)}(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {`,
      `    const payload = ${defaults};`,
      `    const response = await this.api.${prop(name)}.create(payload);`,
      `    const id = idOf(response, ${q(idField)});`,
      undo,
      `    return { id, data: response };`,
      `  }`,
      '',
    );
  }

  lines.push(
    `  /**`,
    `   * Undo everything this test made, newest first.`,
    `   *`,
    `   * A cleanup failure is reported and not thrown, because a test that already`,
    `   * passed should not be failed by its own teardown. Pass \`strict\` to invert`,
    `   * that: the round-trip gate needs a delete that quietly removes nothing to be`,
    `   * an error, since a silent no-op is the exact defect it exists to catch.`,
    `   */`,
    `  async cleanup({ strict = false }: { strict?: boolean } = {}): Promise<void> {`,
    `    const failures: string[] = [];`,
    `    for (const record of [...this.created].reverse()) {`,
    `      try {`,
    `        await record.undo();`,
    `      } catch (error) {`,
    `        const detail = \`\${record.label}: \${(error as Error).message.split('\\n')[0]}\`;`,
    `        failures.push(detail);`,
    `        if (!strict) console.warn(\`cleanup failed for \${detail}\`);`,
    `      }`,
    `    }`,
    `    this.created.length = 0;`,
    `    if (strict && failures.length) {`,
    `      throw new Error(\`\${failures.length} record(s) could not be removed:\\n  \${failures.join('\\n  ')}\`);`,
    `    }`,
    `  }`,
    `}`,
    '',
  );
  return lines.join('\n');
}

/** The fixtures a spec actually imports. */
export function renderFixtures(model: AppModel): string {
  const facts = authFacts(model);
  // A browser-proven login cannot be replayed from scratch here: the setup project
  // performs it once and this context inherits the session it saved.
  const fromStorage = facts?.strategy === 'browser';

  const api = fromStorage
    ? [
        `  api: async ({ playwright, baseURL }, use) => {`,
        `    // The credential was harvested from the browser, so it arrives as saved`,
        `    // state rather than a login this context can perform itself.`,
        `    const state = JSON.parse(readFileSync(STORAGE_STATE, 'utf8'));`,
        `    const request = await playwright.request.newContext({`,
        `      baseURL, storageState: STORAGE_STATE, extraHTTPHeaders: replayHeaders(state),`,
        `    });`,
        `    try {`,
        `      await use(new Api(request, baseURL));`,
        `    } finally {`,
        `      await request.dispose();`,
        `    }`,
        `  },`,
      ]
    : [
        `  api: async ({ playwright, baseURL }, use) => {`,
        `    // A context of its own, deliberately anonymous at birth. Inheriting the`,
        `    // worker's \`request\` fixture would carry no credential: the browser's`,
        `    // storage state does not reach it, and every call would be unauthenticated.`,
        `    const request = await playwright.request.newContext({`,
        `      baseURL, storageState: { cookies: [], origins: [] },`,
        `    });`,
        `    try {`,
        `      const headers = await authenticate(request);`,
        `      await use(new Api(request, baseURL, headers));`,
        `    } finally {`,
        `      await request.dispose();`,
        `    }`,
        `  },`,
      ];

  return [
    header(model),
    `import { test as base } from '@playwright/test';`,
    ...(fromStorage ? [`import { readFileSync } from 'node:fs';`] : []),
    `import { Api } from '../api/Api.ts';`,
    `import { Preconditions } from '../api/Preconditions.ts';`,
    fromStorage
      ? `import { replayHeaders } from '../support/authenticate.ts';`
      : `import { authenticate } from '../support/authenticate.ts';`,
    ...(fromStorage ? [`import { STORAGE_STATE } from '../config/constants.ts';`] : []),
    '',
    `export const test = base.extend<{ api: Api; given: Preconditions }>({`,
    ...api,
    `  // Named "given" so a spec reads as a sentence: given.employee().`,
    `  given: async ({ api }, use) => {`,
    `    const preconditions = new Preconditions(api);`,
    `    try {`,
    `      await use(preconditions);`,
    `    } finally {`,
    `      // In a finally, so a failing test still removes what it made.`,
    `      await preconditions.cleanup();`,
    `    }`,
    `  },`,
    `});`,
    '',
    `export { expect } from '@playwright/test';`,
    '',
  ].join('\n');
}
