// Renders the API layer: one client class per resource, the preconditions that
// establish state through it, and the fixtures a spec imports.
import { q, camel } from './naming.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

// NOTE: kept identical to (and not sourced from) naming.ts's `header` — see pages.ts.
const HEADER = (model: AppModel) =>
  `// GENERATED — rewritten on every run. Put nothing here you want to keep.\n` +
  `// Source: analysis.json (${model.app.repoCommit.slice(0, 10)})\n`;

/** One class per resource: the CRUD the API declares, and nothing invented. */
export function renderResources(model: AppModel): string {
  const resources = (model.api as any).resources as Record<string, any>;
  const lines: string[] = [
    HEADER(model),
    `import { ApiClient, fillPath, idOf } from './ApiClient.ts';`,
    `import type { APIRequestContext } from '@playwright/test';`,
    `import { BASE_URL } from '../config/constants.ts';`,
    '',
  ];

  for (const [name, r] of Object.entries(resources)) {
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

    lines.push(
      `/** ${r.establishes ? `Creating one makes true: ${r.establishes}.`
        : r.ops?.create ? `Action endpoints only: a POST here leaves nothing to read back.`
        : `Read-only: this API declares no create for ${name}.`}`,
      r.requires?.length ? ` *  Requires: ${r.requires.join(', ')} — create those first. */` : ` */`,
      `export class ${name}Api {`,
      `  constructor(private readonly api: ApiClient) {}`,
      '',
      body.join('\n\n') || '  // The API declares no operations for this resource.',
      `}`,
      '',
    );
  }

  // An API can declare a resource called Client — Cal.com does — so the raw client
  // cannot occupy an obvious name, and a resource that still collides is suffixed
  // rather than silently shadowing it.
  const RESERVED = new Set(['http', 'constructor']);
  const names = Object.keys(resources);
  const property = new Map<string, string>();
  for (const name of names) {
    let candidate = camel(name);
    while (RESERVED.has(candidate) || [...property.values()].includes(candidate)) candidate += 'Resource';
    property.set(name, candidate);
  }
  lines.push(
    `/** Every resource the API declares, on one object. */`,
    `export class Api {`,
    `  readonly http: ApiClient;`,
    ...names.map(n => `  readonly ${property.get(n)}: ${n}Api;`),
    '',
    `  constructor(request: APIRequestContext, baseUrl = BASE_URL) {`,
    `    this.http = new ApiClient(request, baseUrl);`,
    ...names.map(n => `    this.${property.get(n)} = new ${n}Api(this.http);`),
    `  }`,
    `}`,
    '',
    `export { idOf };`,
    '',
  );
  return lines.join('\n');
}

/** The state a test needs before it starts, and how to undo it afterwards. */
export function renderPreconditions(model: AppModel): string {
  const resources = (model.api as any).resources as Record<string, any>;
  // Only resources whose creation can be observed afterwards. A login is not a fixture.
  const creatable = Object.entries(resources).filter(([, r]) => (r as any).establishes);
  // Must match the property names Api actually exposes, collisions included.
  const RESERVED = new Set(['http', 'constructor']);
  const property = new Map<string, string>();
  for (const name of Object.keys(resources)) {
    let candidate = camel(name);
    while (RESERVED.has(candidate) || [...property.values()].includes(candidate)) candidate += 'Resource';
    property.set(name, candidate);
  }
  const prop = (name: string) => property.get(name) ?? camel(name);
  const lines: string[] = [
    HEADER(model),
    `import { Api, idOf } from './resources.generated.ts';`,
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
    `  /** Undo everything this test made, newest first. Failures are reported, never thrown. */`,
    `  async cleanup(): Promise<void> {`,
    `    for (const record of [...this.created].reverse()) {`,
    `      try {`,
    `        await record.undo();`,
    `      } catch (error) {`,
    `        console.warn(\`cleanup failed for \${record.label}: \${(error as Error).message.split('\\n')[0]}\`);`,
    `      }`,
    `    }`,
    `    this.created.length = 0;`,
    `  }`,
    `}`,
    '',
  );
  return lines.join('\n');
}

/** The fixtures a spec actually imports. */
export function renderFixtures(model: AppModel): string {
  return [
    HEADER(model),
    `import { test as base } from '@playwright/test';`,
    `import { Api } from '../api/resources.generated.ts';`,
    `import { Preconditions } from '../api/preconditions.generated.ts';`,
    '',
    `export const test = base.extend<{ api: Api; given: Preconditions }>({`,
    `  api: async ({ request }, use) => {`,
    `    await use(new Api(request));`,
    `  },`,
    `  // Named "given" so a spec reads as a sentence: given.employee().`,
    `  given: async ({ api }, use) => {`,
    `    const preconditions = new Preconditions(api);`,
    `    await use(preconditions);`,
    `    await preconditions.cleanup();`,
    `  },`,
    `});`,
    '',
    `export { expect } from '@playwright/test';`,
    '',
  ].join('\n');
}
