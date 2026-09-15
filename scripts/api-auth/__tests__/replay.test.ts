/**
 * The replay derivation is a pure function of what was observed, so it is tested
 * without a browser. These four cases are the ones that decide whether the browser
 * rung works on an app nobody has tried it against.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveReplay, describeReplay } from '../replay.ts';

test('double-submit CSRF: the cookie reaches the header it is copied into', () => {
  const rule = deriveReplay({
    headers: {
      'X-XSRF-TOKEN': 'aBcD1234efGH5678',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://app.example.com/dashboard',
    },
    cookies: { 'XSRF-TOKEN': 'aBcD1234efGH5678', session: 'sess-abcdefgh' },
  });

  assert.deepEqual(rule.headers['X-XSRF-TOKEN'], { from: 'cookie', key: 'XSRF-TOKEN' });
  assert.equal(rule.cookies, true);
  // Browser-default headers must never become part of the credential.
  assert.ok(!('Content-Type' in rule.headers));
  assert.ok(!('User-Agent' in rule.headers));
  assert.ok(!('Referer' in rule.headers));
  assert.equal(rule.underivable, undefined);
});

test('a bearer token in localStorage yields a template, not a literal', () => {
  const rule = deriveReplay({
    headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.payload.sig' },
    cookies: {},
    localStorage: { access_token: 'eyJhbGciOiJIUzI1NiJ9.payload.sig', theme: 'dark' },
  });

  assert.deepEqual(rule.headers.Authorization, {
    from: 'localStorage',
    key: 'access_token',
    template: 'Bearer {}',
  });
  assert.equal(rule.cookies, false);
});

test('a plain cookie session derives no headers at all', () => {
  const rule = deriveReplay({
    headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
    cookies: { orangehrm: 'abcdefghijklmnop' },
  });

  assert.deepEqual(rule.headers, {});
  assert.equal(rule.cookies, true);
});

test('a header matching nothing in storage is reported, never emitted', () => {
  const rule = deriveReplay({
    headers: { 'X-Tenant-Signature': 'opaque-value-from-nowhere' },
    cookies: { session: 'sess-abcdefgh' },
  });

  assert.deepEqual(rule.headers, {}, 'an untraceable value must not be emitted as a literal');
  assert.deepEqual(rule.underivable, ['X-Tenant-Signature']);
  assert.match(describeReplay(rule), /could not be traced to storage/);
});

test('the longest stored value wins, so a short value inside a token cannot hijack it', () => {
  const rule = deriveReplay({
    headers: { Authorization: 'Bearer long-token-value-here' },
    cookies: { noise: 'long-tok' },
    localStorage: { token: 'long-token-value-here' },
  });

  assert.equal(rule.headers.Authorization.key, 'token');
  assert.equal(rule.headers.Authorization.template, 'Bearer {}');
});
