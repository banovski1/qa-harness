/**
 * What the generator emits for authentication.
 *
 * Every assertion here corresponds to a defect a person found by hand: an API fixture
 * that inherited a context carrying no credential, a login transcribed from CSS
 * selectors while a proven one sat unused, and `process.env.X ?? ''` turning a missing
 * password into a valid-looking empty string.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderAuthPlan, authFacts } from '../emit/auth.ts';
import { renderFixtures } from '../emit/api.ts';
import { staticProject } from '../emit/project.ts';
import { emit, assertAuthVerified } from '../emit/emit.ts';
import { fixtureModel, verified } from './fixtures/model.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

function withResources(): AppModel {
  const model = verified(fixtureModel());
  model.api.resources = {
    Employee: {
      establishes: 'an employee exists', requires: [],
      ops: {
        create: { path: '/api/v2/pim/employees', requiredFields: ['firstName'], optionalFields: [], requiredKnown: true },
        get: { path: '/api/v2/pim/employees/{empNumber}' },
        delete: { path: '/api/v2/pim/employees' },
        actions: [],
      },
    },
  } as never;
  return model;
}

test('the emitted plan carries the strategy that was proven, not the kind that was read', () => {
  const model = withResources();
  (model.api as any).auth.kind = 'token';          // what the source suggested
  (model.api as any).authVerification.strategy = 'session';  // what actually worked

  const plan = renderAuthPlan(model);
  assert.match(plan, /"strategy": "session"/);
});

test('the plan verifies itself against the endpoint the probe proved discriminating', () => {
  const plan = renderAuthPlan(withResources());
  assert.match(plan, /"verifyWith"/);
  assert.match(plan, /"path": "\/api\/v2\/me"/);
});

test('credentials are emitted as variable names, never as values', () => {
  const plan = renderAuthPlan(withResources());
  assert.match(plan, /"username": "APP_USERNAME"/);
  assert.ok(!/password"\s*:\s*"(?!APP_PASSWORD)/.test(plan), 'no literal password may be emitted');
});

test('a csrf block without fromPath is refused rather than scraped out of prose', () => {
  const model = withResources();
  delete (model.api as any).auth.csrf.fromPath;
  assert.throws(() => renderAuthPlan(model), /fromPath/);
});

test('the API fixture builds its own context and authenticates it', () => {
  const fixtures = renderFixtures(withResources());
  // The defect: `async ({ request }, use)` inherits a context with no credential.
  assert.ok(!/api: async \(\{ request \}/.test(fixtures), 'must not inherit the bare request fixture');
  assert.match(fixtures, /playwright\.request\.newContext/);
  assert.match(fixtures, /await authenticate\(request\)/);
  assert.match(fixtures, /await request\.dispose\(\)/);
});

test('cleanup runs in a finally, so a failing test still removes what it made', () => {
  const fixtures = renderFixtures(withResources());
  const given = fixtures.slice(fixtures.indexOf('given:'));
  assert.match(given, /try \{[\s\S]*await use\(preconditions\)[\s\S]*\} finally \{[\s\S]*cleanup\(\)/);
});

test('a proven cookie login makes the setup project use the API, not the login screen', () => {
  const files = staticProject(withResources());
  const setup = files.find(f => f.path === 'tests/auth.setup.ts')!.contents;
  assert.match(setup, /import \{ authenticate \}/);
  assert.ok(!setup.includes('page.locator'), 'a proven API login needs no browser');
});

test('a browser-proven login keeps the UI setup and replays the observed headers', () => {
  const model = withResources();
  (model.api as any).authVerification.strategy = 'browser';
  (model.api as any).authVerification.credential = {
    via: 'cookie', name: 'session',
    replay: { cookies: true, headers: { 'X-XSRF-TOKEN': { from: 'cookie', key: 'XSRF-TOKEN' } } },
  };

  const setup = staticProject(model).find(f => f.path === 'tests/auth.setup.ts')!.contents;
  assert.match(setup, /page\.locator/, 'the browser rung logs in through the UI');

  const fixtures = renderFixtures(model);
  assert.match(fixtures, /replayHeaders/);

  const plan = renderAuthPlan(model);
  assert.match(plan, /"X-XSRF-TOKEN"/);
});

test('no emitted file turns a missing credential into an empty string', () => {
  const model = withResources();
  const writer = emit(model, null, '/tmp/does-not-matter', { dryRun: true });
  assert.ok(writer.planned.length > 0);
  for (const file of staticProject(model)) {
    assert.ok(
      !/process\.env\.\w+\s*\?\?\s*''/.test(file.contents),
      `${file.path} defaults a credential to an empty string`,
    );
  }
});

test('emission is refused when the login was never verified', () => {
  const model = withResources();
  (model.api as any).authVerification = { verdict: 'failed', reason: 'nope', attempts: [] };
  assert.throws(() => assertAuthVerified(model), /proven login/);

  delete (model.api as any).authVerification;
  assert.throws(() => assertAuthVerified(model), /missing/);
});

test('an app with no API resources needs no login to generate', () => {
  const model = fixtureModel();
  (model.api as any).resources = {};
  assert.doesNotThrow(() => assertAuthVerified(model));
  assert.equal(authFacts(model), null);
});
