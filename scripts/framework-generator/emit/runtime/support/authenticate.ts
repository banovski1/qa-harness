// Authentication, as it was proven against the running application.
//
// The plan beside this file was not read out of source and hoped for: `verify-auth.ts`
// executed it, and a protected read refused an anonymous caller and admitted the
// credential it produced. What that tool proved is what this replays.
//
// The probe at the end matters as much as the login. A form login that fails usually
// answers 200 and re-renders the login page, so "the request succeeded" is not evidence
// of anything. `verifyWith` names an endpoint observed to discriminate.
import type { APIRequestContext } from '@playwright/test';
import { AUTH_PLAN, type AuthPlan, type ReplaySource } from '../config/auth-plan.ts';
import { requiredEnv } from '../utils/env.ts';

export class AuthError extends Error {
  constructor(message: string) {
    super(
      `${message}\n` +
      `  strategy: ${AUTH_PLAN.strategy} (proven by scripts/api-auth/verify-auth.ts)\n` +
      `  If the application's login has changed, re-run: npm run verify-auth -- --write`,
    );
    this.name = 'AuthError';
  }
}

/**
 * Find a CSRF token on a login page.
 *
 * A framework rarely puts it where its own form field name suggests. A `_token` on the
 * POST may be a `<meta name="csrf-token">`, a `:token` prop on a mounted component, or
 * a key in an inlined JSON blob — and the value may be HTML-entity-encoded and
 * JSON-quoted on top of that. Every spelling is tried before the page is called
 * tokenless, because "no token" and "the token is spelled differently" are the same
 * symptom and very different bugs.
 */
export function csrfFrom(html: string, field: string): string | null {
  const bare = field.replace(/^[_:-]+/, '');
  const aliases = [...new Set([field, bare, `_${bare}`, `csrf-${bare}`, `csrf_${bare}`, 'csrf-token', 'csrfToken'])];

  for (const alias of aliases) {
    const name = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      // <input name="_token" value="…"> in either attribute order
      new RegExp(`name=["']${name}["'][^>]*?\\svalue=["']([^"']*)["']`, 'i'),
      new RegExp(`value=["']([^"']*)["'][^>]*?\\sname=["']${name}["']`, 'i'),
      // <meta name="csrf-token" content="…">
      new RegExp(`name=["']${name}["'][^>]*?\\scontent=["']([^"']*)["']`, 'i'),
      // a plain or framework-bound attribute: token="…" / :token="…" / v-bind:token="…"
      new RegExp(`(?:^|\\s)(?::|v-bind:)?${name}=["']([^"']*)["']`, 'i'),
      // "_token": "…" inside an inlined JSON blob
      new RegExp(`["']${name}["']\\s*:\\s*["']([^"']*)["']`, 'i'),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (!match) continue;
      // Entity-decode, then unwrap the quotes a JSON-encoded string leaves behind.
      const value = match[1]
        .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'")
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/^"(.*)"$/s, '$1').trim();
      if (value) return value;
    }
  }
  return null;
}

/** Find a token by key anywhere in a JSON body. Field names vary; the shape does not. */
function deepFind(value: unknown, keys: string[]): string | null {
  if (value === null || typeof value !== 'object') return null;
  for (const [name, held] of Object.entries(value as Record<string, unknown>)) {
    if (keys.includes(name) && typeof held === 'string' && held) return held;
    const nested = deepFind(held, keys);
    if (nested) return nested;
  }
  return null;
}

async function sessionLogin(request: APIRequestContext, plan: AuthPlan, username: string, password: string) {
  const form: Record<string, string> = { username, password };

  if (plan.csrf) {
    const page = await request.get(plan.csrf.fromPath);
    if (!page.ok()) throw new AuthError(`The login page answered ${page.status()}.`);
    const token = csrfFrom(await page.text(), plan.csrf.field);
    if (!token) {
      throw new AuthError(
        `The login page carried no "${plan.csrf.field}". A token minted in another ` +
        `session is rejected, so it must be read from this one.`,
      );
    }
    form[plan.csrf.field] = token;
  }

  const response = await request.fetch(plan.login.path, {
    method: plan.login.method, form, maxRedirects: 0,
  });

  const location = response.headers().location ?? '';
  const expected = plan.success?.status;
  const wanted = plan.success?.redirectIncludes;
  const bouncedBack = /login|signin|sign-in/i.test(location);

  if ((expected && response.status() !== expected) || (wanted && !location.includes(wanted)) || bouncedBack) {
    throw new AuthError(
      `Login was refused: HTTP ${response.status()}${location ? `, redirect ${location}` : ''}.` +
      (bouncedBack ? ' It redirected back to the login page, which means the credentials were rejected.' : ''),
    );
  }
}

async function tokenLogin(request: APIRequestContext, plan: AuthPlan, username: string, password: string) {
  const response = await request.fetch(plan.login.path, {
    method: plan.login.method,
    data: { username, email: username, password },
    headers: { 'content-type': 'application/json' },
  });
  if (!response.ok()) throw new AuthError(`The login endpoint answered ${response.status()}.`);

  let body: unknown = null;
  try { body = JSON.parse(await response.text()); } catch { /* handled below */ }
  const token = deepFind(body, ['token', 'jwt', 'accessToken', 'access_token', 'id_token']);
  if (!token) throw new AuthError('The login answered successfully but carried no token field.');

  const name = plan.header?.name ?? 'Authorization';
  const template = plan.header?.template ?? 'Bearer {}';
  return { [name]: template.replace('{}', token) };
}

function basicHeader(username: string, password: string) {
  return { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` };
}

/**
 * Rebuild a browser-harvested credential from a saved storage state.
 *
 * The cookies travel in the storage state itself; only the headers the application
 * copies out of storage — an `X-XSRF-TOKEN`, a bearer read from localStorage — have
 * to be reconstructed, and the plan says exactly where each one came from.
 */
export function replayHeaders(storageState: {
  cookies?: { name: string; value: string }[];
  origins?: { localStorage?: { name: string; value: string }[] }[];
}): Record<string, string> {
  const plan = AUTH_PLAN;
  if (!plan.replay) return {};

  const stores: Record<ReplaySource['from'], Record<string, string>> = {
    cookie: Object.fromEntries((storageState.cookies ?? []).map(c => [c.name, c.value])),
    localStorage: Object.fromEntries(
      (storageState.origins ?? []).flatMap(o => (o.localStorage ?? []).map(e => [e.name, e.value])),
    ),
    sessionStorage: {},
  };

  const headers: Record<string, string> = {};
  for (const [name, source] of Object.entries(plan.replay.headers)) {
    const value = stores[source.from]?.[source.key];
    if (!value) {
      throw new AuthError(
        `The saved session carries no ${source.from} entry "${source.key}", which this ` +
        `application sends as "${name}" on every request. The session has probably expired.`,
      );
    }
    headers[name] = source.template ? source.template.replace('{}', value) : value;
  }
  return headers;
}

/**
 * Authenticate an API context in place, and prove it worked.
 *
 * Returns any headers later requests must carry. For a cookie session that is empty —
 * the context's own jar holds the credential.
 */
export async function authenticate(
  request: APIRequestContext,
  username = requiredEnv(AUTH_PLAN.fields.username),
  password = requiredEnv(AUTH_PLAN.fields.password),
): Promise<Record<string, string>> {
  const plan = AUTH_PLAN;
  let headers: Record<string, string> = {};

  if (plan.strategy === 'session') {
    await sessionLogin(request, plan, username, password);
  } else if (plan.strategy === 'token') {
    headers = await tokenLogin(request, plan, username, password);
  } else if (plan.strategy === 'basic') {
    headers = basicHeader(username, password);
  } else {
    throw new AuthError(
      'This application authenticates through its UI, so the API context takes its ' +
      'session from the setup project rather than logging in directly.',
    );
  }

  // The proof. A login that "succeeded" and a credential that opens nothing are the
  // same thing from a test's point of view, and only this call tells them apart.
  const probe = await request.fetch(plan.verifyWith.path, { method: plan.verifyWith.method, headers });
  if (!probe.ok()) {
    // 401 and 403 are different diagnoses and must not share a sentence. 401 says the
    // credential is absent or was not accepted — the login is what broke. 403 says the
    // credential arrived and was understood, and this account simply may not read this
    // endpoint: the login is fine and the probe was the wrong choice. Saying "the
    // credential did not survive the login" for a 403 sends the reader to inspect a
    // login that never failed.
    const forbidden = probe.status() === 403;
    throw new AuthError(
      `Logged in, but ${plan.verifyWith.method} ${plan.verifyWith.path} answered ` +
      `${probe.status()}. ` +
      (forbidden
        ? 'A 403 means the credential was accepted and this account is not permitted to ' +
          'read that endpoint — the login worked, and the endpoint recorded as the proof ' +
          'is one this user cannot see. Re-run: npm run verify-auth -- --write, which ' +
          'cascades until it finds a read this account is authorised for, then regenerate.'
        : 'This read is known to admit an authenticated caller, so the credential did not ' +
          'survive the login.'),
    );
  }
  return headers;
}
