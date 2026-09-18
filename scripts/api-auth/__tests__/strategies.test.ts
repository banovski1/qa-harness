/**
 * Characterisation tests: what the three strategies do today, before the cascade
 * refactor touches how they are chosen. A behaviour these pin down and the refactor
 * changes is a regression, not an improvement.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sessionLogin, tokenLogin, basicLogin } from '../strategies.ts';
import { wire, withCredentials, BASE } from './helpers.ts';

const sessionAuth = {
  kind: 'session',
  loginEndpoint: {
    method: 'POST',
    path: '/auth/validate',
    fields: { username: 'env:APP_USERNAME', password: 'env:APP_PASSWORD', _token: 'from the login page' },
  },
  csrf: { field: '_token', from: 'a hidden input on /auth/login' },
  success: { status: 302, cookie: 'app_session', redirect: '/dashboard' },
};

test('sessionLogin reads the CSRF token, posts the form, and keeps the cookie', async () => {
  const restore = withCredentials();
  const net = wire([
    { path: '/auth/login', body: `<input name="_token" value="tok-123">` },
    {
      path: '/auth/validate', method: 'POST', status: 302,
      headers: { location: `${BASE}/dashboard` },
      cookies: ['app_session=abc; Path=/; HttpOnly'],
    },
  ]);
  try {
    const attempt = await sessionLogin(BASE, sessionAuth as never);
    assert.ok(attempt.credential, attempt.reason);
    assert.equal(attempt.credential.via, 'cookie');
    assert.equal(attempt.credential.name, 'app_session');
    // The token must be read in the same jar as the POST, or the app rejects it.
    assert.deepEqual(net.calls, [`GET ${BASE}/auth/login`, `POST ${BASE}/auth/validate`]);
    assert.equal(attempt.observations[0].step, 'csrf');
    assert.equal(attempt.observations[1].step, 'login');
  } finally {
    net.restore();
    restore();
  }
});

test('sessionLogin treats a redirect back to the login page as a failure', async () => {
  const restore = withCredentials();
  const net = wire([
    { path: '/auth/login', body: `<input name="_token" value="tok-123">` },
    { path: '/auth/validate', method: 'POST', status: 302, headers: { location: `${BASE}/auth/login` } },
  ]);
  try {
    const attempt = await sessionLogin(BASE, sessionAuth as never);
    assert.equal(attempt.credential, null);
    assert.match(attempt.reason, /redirected back/);
  } finally {
    net.restore();
    restore();
  }
});

test('sessionLogin reports a tokenless login page rather than posting without one', async () => {
  const restore = withCredentials();
  const net = wire([{ path: '/auth/login', body: '<html>no token here</html>' }]);
  try {
    const attempt = await sessionLogin(BASE, sessionAuth as never);
    assert.equal(attempt.credential, null);
    assert.match(attempt.reason, /_token/);
    assert.deepEqual(net.calls, [`GET ${BASE}/auth/login`], 'must not post without the token');
  } finally {
    net.restore();
    restore();
  }
});

test('tokenLogin finds the token under any of the usual field names', async () => {
  const restore = withCredentials();
  const net = wire([
    { path: '/api/login', method: 'POST', body: JSON.stringify({ data: { accessToken: 'jwt-xyz' } }) },
  ]);
  try {
    const attempt = await tokenLogin(BASE, {
      kind: 'token',
      loginEndpoint: { method: 'POST', path: '/api/login' },
    } as never);
    assert.ok(attempt.credential, attempt.reason);
    assert.equal(attempt.credential.via, 'header');
    assert.equal(attempt.credential.headers.Authorization, 'Bearer jwt-xyz');
  } finally {
    net.restore();
    restore();
  }
});

test('tokenLogin distinguishes a rejected credential from a broken flow', async () => {
  const restore = withCredentials();
  const net = wire([{ path: '/api/login', method: 'POST', status: 401, body: '{"error":"bad"}' }]);
  try {
    const attempt = await tokenLogin(BASE, {
      kind: 'token', loginEndpoint: { method: 'POST', path: '/api/login' },
    } as never);
    assert.equal(attempt.credential, null);
    assert.match(attempt.reason, /the flow looks right, the account does not/);
  } finally {
    net.restore();
    restore();
  }
});

test('basicLogin sends an Authorization header and keeps it as the credential', async () => {
  const restore = withCredentials('admin', 'secret');
  const net = wire([{ path: '/api/me', body: '{"ok":true}' }]);
  try {
    const attempt = await basicLogin(BASE, {
      kind: 'basic', loginEndpoint: { method: 'GET', path: '/api/me' },
    } as never);
    assert.ok(attempt.credential, attempt.reason);
    const expected = `Basic ${Buffer.from('admin:secret').toString('base64')}`;
    assert.equal(attempt.credential.headers.Authorization, expected);
  } finally {
    net.restore();
    restore();
  }
});

test('every strategy refuses an empty credential rather than trying it', async () => {
  // Empty rather than deleted on purpose. Credentials are read from the root `.env`
  // with the real environment winning, so an empty value is how a caller actually
  // arrives with nothing — and an empty password must never be attempted as if it
  // were one. Deleting the variables here would just fall through to the real file.
  const before = { u: process.env.APP_USERNAME, p: process.env.APP_PASSWORD };
  process.env.APP_USERNAME = '';
  process.env.APP_PASSWORD = '';
  try {
    for (const strategy of [sessionLogin, tokenLogin, basicLogin]) {
      const attempt = await strategy(BASE, { loginEndpoint: { path: '/x' } } as never);
      assert.equal(attempt.credential, null);
      assert.match(attempt.reason, /APP_USERNAME/);
    }
  } finally {
    if (before.u === undefined) delete process.env.APP_USERNAME; else process.env.APP_USERNAME = before.u;
    if (before.p === undefined) delete process.env.APP_PASSWORD; else process.env.APP_PASSWORD = before.p;
  }
});

test('sessionLogin reads the token under readAs and posts it under field', async () => {
  // An app whose pre-login endpoint publishes the token as JSON under one name and
  // accepts it on the form under another. Reading and sending had been one name.
  const restore = withCredentials();
  let posted = '';
  const net = wire([
    { path: '/webapi/login/status', body: `{"XSRFToken":"tok-json-1","authenticated":false}` },
    { path: '/webapi/login/login', method: 'POST', status: 200, body: `{"authenticated":true}`,
      cookies: ['JSESSIONID=sid-1; Path=/; HttpOnly'] },
  ]);
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (input: unknown, init?: { method?: string; body?: unknown }) => {
    if (init?.method === 'POST') posted = String(init.body ?? '');
    return realFetch(input as never, init as never);
  }) as typeof globalThis.fetch;
  try {
    const attempt = await sessionLogin(BASE, {
      kind: 'session',
      loginEndpoint: {
        method: 'POST',
        path: '/webapi/login/login',
        fields: { username: 'env:APP_USERNAME', password: 'env:APP_PASSWORD' },
      },
      csrf: { field: 'randomToken', readAs: 'XSRFToken', fromPath: '/webapi/login/status' },
      success: { status: 200, cookie: 'JSESSIONID' },
    } as never);
    assert.ok(attempt.credential, attempt.reason);
    assert.equal(attempt.credential.name, 'JSESSIONID');
    assert.match(posted, /randomToken=tok-json-1/);
    assert.doesNotMatch(posted, /XSRFToken=/);
    assert.equal(attempt.observations[0].step, 'csrf');
    assert.match(attempt.observations[0].detail, /XSRFToken \(posted as randomToken\)/);
  } finally {
    net.restore();
    restore();
  }
});

test('sessionLogin prefers csrf.fromPath over the profile login URL', async () => {
  // The profile's AUTH_LOGIN_URL points at the SPA's own login route, which carries
  // no token. An explicit fromPath is a stated fact and must win over it.
  const restore = withCredentials();
  const net = wire([
    { path: '/webapi/login/status', body: `{"XSRFToken":"tok-json-2"}` },
    { path: '/webapi/login/login', method: 'POST', status: 200, cookies: ['JSESSIONID=sid-2; Path=/'] },
  ]);
  try {
    const attempt = await sessionLogin(BASE, {
      kind: 'session',
      loginEndpoint: { method: 'POST', path: '/webapi/login/login' },
      csrf: { field: 'randomToken', readAs: 'XSRFToken', fromPath: '/webapi/login/status' },
    } as never, `${BASE}/mco/new/#/auth/login`);
    assert.ok(attempt.credential, attempt.reason);
    assert.deepEqual(net.calls, [
      `GET ${BASE}/webapi/login/status`,
      `POST ${BASE}/webapi/login/login`,
    ]);
    assert.equal(attempt.facts?.loginPagePath, '/webapi/login/status');
  } finally {
    net.restore();
    restore();
  }
});
