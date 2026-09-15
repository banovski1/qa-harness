/**
 * The cascade's job is to stop a wrong `auth.kind` from ending the run.
 *
 * Before this existed, `verify-auth.ts` read `kind`, picked one strategy, ran it once,
 * and reported `failed` if it did not work — for an app whose login may be perfectly
 * fine under one of the other two shapes.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cascadeFor } from '../cascade.ts';

test('the declared kind is tried first, and every other HTTP shape still follows', () => {
  assert.deepEqual(
    cascadeFor({ kind: 'token', loginEndpoint: { path: '/login' } }),
    ['token', 'session', 'basic'],
  );
  assert.deepEqual(
    cascadeFor({ kind: 'session', loginEndpoint: { path: '/login' } }),
    ['session', 'token', 'basic'],
  );
});

test('the login request shape outranks the label on the block', () => {
  // `kind` says session; the endpoint asks for Basic. The request is the better evidence.
  const order = cascadeFor({ kind: 'session', loginEndpoint: { path: '/me', auth: 'basic' } });
  assert.equal(order[0], 'basic');
  assert.deepEqual([...order].sort(), ['basic', 'session', 'token']);
});

test('a base64 hint in the login headers also means Basic', () => {
  const order = cascadeFor({
    kind: 'none',
    loginEndpoint: { path: '/me', headers: { 'X-Auth': 'base64(user:pass)' } },
  });
  assert.equal(order[0], 'basic');
});

test('an unrecognised kind still tries all three HTTP shapes', () => {
  assert.deepEqual(
    cascadeFor({ kind: 'undocumented-in-spec', loginEndpoint: { path: '/login' } }),
    ['session', 'token', 'basic'],
  );
});

test('the browser rung is appended only when a UI login was recorded, and always last', () => {
  const without = cascadeFor({ kind: 'session', loginEndpoint: { path: '/login' } });
  assert.ok(!without.includes('browser'), 'nothing for the rung to perform');

  const withUi = cascadeFor({
    kind: 'session',
    loginEndpoint: { path: '/login' },
    uiLogin: { loginUrl: 'https://app/login', steps: [{ action: 'click', selector: 'button' }] },
  } as never);
  assert.equal(withUi.at(-1), 'browser');
  assert.equal(withUi.filter(s => s === 'browser').length, 1);
});

test('the browser rung can be excluded explicitly', () => {
  const order = cascadeFor(
    { kind: 'session', uiLogin: { steps: [{ selector: 'button' }] } } as never,
    { includeBrowser: false },
  );
  assert.ok(!order.includes('browser'));
});
