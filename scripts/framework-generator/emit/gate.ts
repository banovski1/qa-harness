// The API round-trip gate: the first thing in this pipeline that executes what the
// generator emitted.
//
// Everything before it checks text. A draft is read by a human, a typecheck reads
// types, and the smoke check proves only that Playwright can load the project. All of
// which a no-op delete, an unauthenticated fixture and a guessed id field pass
// comfortably — they did, and a person found them by hand afterwards.
//
// Four steps per resource, and the fourth is the one that matters: **read the record
// back after deleting it**. A `DELETE` against a collection endpoint with no body
// returns something plausible and removes nothing, and only reading afterwards tells
// "deleted" apart from "pretended to".
import { q, camel, header } from './naming.ts';
import { resourceProperties } from './api.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

export interface GateCoverage {
  covered: string[];
  /** Resources whose creation needs another record to exist first. */
  skipped: { name: string; requires: string[] }[];
}

/**
 * Which resources this gate can round-trip alone.
 *
 * A resource with `requires` needs another record before it can be created, and
 * resolving that automatically would mean guessing which field carries the dependency's
 * id — `User.empNumber` meaning "an Employee id" is exactly the kind of inference that
 * produced a delete call with no arguments. Those are skipped, loudly, until record
 * identity is a recorded fact rather than a derivation.
 */
export function gateCoverage(model: AppModel): GateCoverage {
  const resources = (model.api as any).resources ?? {};
  const covered: string[] = [];
  const skipped: { name: string; requires: string[] }[] = [];

  for (const [name, resource] of Object.entries(resources) as [string, any][]) {
    if (!resource.establishes || !resource.ops?.create) continue;
    if (resource.requires?.length) skipped.push({ name, requires: resource.requires });
    else covered.push(name);
  }
  return { covered, skipped };
}

function testFor(name: string, resource: any, prop: string): string[] {
  const readsBack = Boolean(resource.ops?.get);
  const deletes = Boolean(resource.ops?.delete);
  const lines: string[] = [
    `test(${q(`${name}: create, read back, delete, confirm gone`)}, async ({ api, given }) => {`,
    `  const { id } = await given.${camel(name)}();`,
    `  expect(id, 'the create response carried no usable id').toBeTruthy();`,
    '',
  ];

  if (readsBack) {
    lines.push(
      `  // If this throws, the id above is not the one this API addresses records by.`,
      `  const fetched = await api.${prop}.get({ ${idParams(resource)} });`,
      `  expect(fetched, 'the record could not be read back after creation').toBeTruthy();`,
      '',
    );
  }

  if (!deletes) {
    lines.push(
      `  // This API declares no delete, so the record stays. Said out loud rather than`,
      `  // left as a quietly growing pile of test data.`,
      `  test.info().annotations.push({ type: 'no-cleanup', description: ${q(`${name} cannot be removed through the API`)} });`,
      `});`,
    );
    return lines;
  }

  lines.push(
    `  // Strict: a delete that removes nothing must fail here rather than warn.`,
    `  await given.cleanup({ strict: true });`,
    '',
  );

  if (readsBack) {
    lines.push(
      `  // The step that catches a delete which answered happily and did nothing.`,
      `  await expect(async () => {`,
      `    await api.${prop}.get({ ${idParams(resource)} });`,
      `  }, 'the record was still readable after being deleted').rejects.toThrow();`,
    );
  } else {
    lines.push(
      `  // This API offers no way to read one record, so "gone" cannot be proven here.`,
      `  // The strict cleanup above is the whole of the evidence.`,
      `  test.info().annotations.push({ type: 'unverified-delete', description: ${q(`${name} has no get to confirm removal`)} });`,
    );
  }

  lines.push(`});`);
  return lines;
}

/** The arguments a `get` needs, taken from its own path. */
function idParams(resource: any): string {
  const keys = (String(resource.ops?.get?.path ?? '').match(/\{(\w+)\}/g) ?? [])
    .map((s: string) => s.slice(1, -1));
  return keys.length ? keys.map((k: string) => `${k}: id`).join(', ') : '';
}

export function renderRoundTripGate(model: AppModel): string {
  const resources = (model.api as any).resources ?? {};
  const property = resourceProperties(model);
  const { covered, skipped } = gateCoverage(model);

  const body: string[] = [];
  for (const name of covered) {
    body.push(...testFor(name, resources[name], property.get(name) ?? camel(name)), '');
  }
  for (const { name, requires } of skipped) {
    body.push(
      `test.skip(${q(`${name}: needs an existing ${requires.join(' and ')}`)}, () => {`,
      `  // Creating one of these needs another record first, and which field carries`,
      `  // that id is not recorded anywhere — only guessable from its name. Guessing is`,
      `  // what this gate exists to catch, so it does not guess.`,
      `});`,
      '',
    );
  }

  return [
    header(model),
    `// Round-trips every resource that can be created on its own: create it, read it`,
    `// back, delete it, then prove it is gone.`,
    `//`,
    `// THIS WRITES TO THE TARGET APPLICATION. It is excluded from the default test run`,
    `// and only appears as a project when API_GATE is set:`,
    `//`,
    `//   npm run gate:api`,
    `//`,
    `// ${covered.length} resource(s) covered, ${skipped.length} skipped for unmet dependencies.`,
    `import { test, expect } from '../src/fixtures/test.ts';`,
    '',
    ...body,
  ].join('\n');
}
