/**
 * The round-trip gate is the first thing in this pipeline that runs emitted code, so
 * what it covers — and what it declines to guess at — is worth pinning down.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderRoundTripGate, gateCoverage } from '../emit/gate.ts';
import { staticProject } from '../emit/project.ts';
import { renderPreconditions } from '../emit/api.ts';
import { fixtureModel, verified } from './fixtures/model.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

function model(): AppModel {
  const m = verified(fixtureModel());
  m.api.resources = {
    Employee: {
      establishes: 'an employee exists', requires: [],
      ops: {
        create: { path: '/api/v2/pim/employees', requiredFields: ['firstName'], optionalFields: [], requiredKnown: true },
        get: { path: '/api/v2/pim/employees/{empNumber}' },
        delete: { path: '/api/v2/pim/employees' },
        actions: [],
      },
    },
    User: {
      establishes: 'a user exists', requires: ['Employee'],
      ops: {
        create: { path: '/api/v2/admin/users', requiredFields: [], optionalFields: ['username'], requiredKnown: false },
        get: { path: '/api/v2/admin/users/{id}' },
        delete: { path: '/api/v2/admin/users' },
        actions: [],
      },
    },
    Config: { establishes: null, requires: [], ops: { list: { path: '/api/v2/config' }, actions: [] } },
  } as never;
  return m;
}

test('a resource that can be created alone is round-tripped; one with a dependency is skipped', () => {
  const { covered, skipped } = gateCoverage(model());
  assert.deepEqual(covered, ['Employee']);
  assert.deepEqual(skipped, [{ name: 'User', requires: ['Employee'] }]);
});

test('a resource that establishes nothing is not a fixture and gets no test', () => {
  const { covered, skipped } = gateCoverage(model());
  assert.ok(!covered.includes('Config'));
  assert.ok(!skipped.some(s => s.name === 'Config'));
});

test('the covered resource is created, read back, deleted strictly, and proven gone', () => {
  const gate = renderRoundTripGate(model());
  assert.match(gate, /await given\.employee\(\)/);
  assert.match(gate, /api\.employee\.get\(\{ empNumber: id \}\)/);
  assert.match(gate, /cleanup\(\{ strict: true \}\)/);
  // The assertion that catches a delete which answered happily and removed nothing.
  assert.match(gate, /rejects\.toThrow\(\)/);
});

test('a skipped resource says what it is waiting for, and never guesses the link', () => {
  const gate = renderRoundTripGate(model());
  assert.match(gate, /test\.skip\('User: needs an existing Employee'/);
  assert.ok(!/given\.user\(/.test(gate), 'it must not invent how a User reaches its Employee');
});

test('strict cleanup throws while ordinary cleanup only warns', () => {
  const preconditions = renderPreconditions(model());
  assert.match(preconditions, /async cleanup\(\{ strict = false \}/);
  assert.match(preconditions, /if \(!strict\) console\.warn/);
  assert.match(preconditions, /if \(strict && failures\.length\)/);
});

test('the gate is absent from an ordinary run and present behind the flag', () => {
  const config = staticProject(model()).find(f => f.path === 'playwright.config.ts')!.contents;
  assert.match(config, /process\.env\.API_GATE \? \[\{ name: 'api-gate'/);

  const pkg = JSON.parse(staticProject(model()).find(f => f.path === 'package.json')!.contents);
  assert.equal(pkg.scripts['gate:api'], 'API_GATE=1 playwright test --project=api-gate');
});

test('an app with no API resources gets no gate and no gate script', () => {
  const m = verified(fixtureModel());
  (m.api as any).resources = {};
  const files = staticProject(m);
  const config = files.find(f => f.path === 'playwright.config.ts')!.contents;
  assert.ok(!config.includes('api-gate'));
  const pkg = JSON.parse(files.find(f => f.path === 'package.json')!.contents);
  assert.ok(!('gate:api' in pkg.scripts));
});

test('the gate warns in its own header that it writes to the target application', () => {
  const gate = renderRoundTripGate(model());
  assert.match(gate, /WRITES TO THE TARGET APPLICATION/);
  assert.match(gate, /1 resource\(s\) covered, 1 skipped/);
});
