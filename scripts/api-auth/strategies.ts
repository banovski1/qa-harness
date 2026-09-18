/**
 * One function per auth shape. Each returns the credential a later request must
 * carry, or an explanation of why it could not get one. No application is named.
 */
import { Jar, send, csrfToken, deepFind, type Sent } from './http.ts';
// @ts-ignore - the shared .env reader is plain JS used across the pipeline
import { loadEnv } from '../config/profile.mjs';
import type { AuthBlock, Observation, ReplayRule } from './types.ts';

export interface Credential {
  jar: Jar;
  headers: Record<string, string>;
  /** How the caller should describe what proved the login. */
  via: 'header' | 'cookie';
  name: string;
  /**
   * Set only by the browser rung: how to rebuild this credential outside the browser.
   * The HTTP strategies know their own protocol and need no replay rule.
   */
  replay?: ReplayRule;
}

export interface Attempt {
  credential: Credential | null;
  reason: string;
  observations: Observation[];
  /**
   * What this attempt learned by doing it, as opposed to what the analysis claimed.
   * The login page's path is the case in point: `auth.csrf.from` is prose, and the
   * path actually fetched is a fact only a run can establish.
   */
  facts?: { loginPagePath?: string };
}

const isRedirect = (status: number) => status >= 300 && status < 400;

function summarise(sent: Sent): string {
  const body = sent.body.trim().replace(/\s+/g, ' ');
  return body.length > 180 ? `${body.slice(0, 180)}…` : body || '(empty body)';
}

function resolve(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

/**
 * Credentials come from the root `.env`, or from the real environment, which wins —
 * so CI can set APP_PASSWORD without a file.
 *
 * Reading the file matters: `.env` is a data file, not a shell script. A value like
 * `APP_NAME=OrangeHRM (open-source demo)` is perfectly legal in it and cannot be
 * `source`d, so "export it first" is not a thing a caller can reliably do. Requiring
 * that was the same mistake as defaulting a missing password to an empty string: a
 * configuration that exists, is correct, and is silently not read.
 */
export function credentialsFromEnv(): { username: string; password: string } | null {
  const env = loadEnv() as Record<string, string | undefined>;
  const username = env.APP_USERNAME;
  const password = env.APP_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

/**
 * A JSON body posted to a login endpoint that answers with a token.
 * The token's field name is not assumed: any string called `token`, `jwt`,
 * `accessToken` or `access_token` anywhere in the response counts.
 */
export async function tokenLogin(baseUrl: string, auth: AuthBlock): Promise<Attempt> {
  const observations: Observation[] = [];
  const account = credentialsFromEnv();
  if (!account) return { credential: null, reason: 'APP_USERNAME / APP_PASSWORD are not set', observations };

  const login = auth.loginEndpoint;
  if (!login?.path) return { credential: null, reason: 'api.json records no login path', observations };

  const url = resolve(baseUrl, login.path);
  const jar = new Jar();
  const body = shapeLoginBody(login.request, account.username, account.password);
  const sent = await send(url, {
    jar,
    method: (login.method ?? 'POST').toUpperCase(),
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  observations.push({
    step: 'login',
    request: `${login.method ?? 'POST'} ${url}`,
    status: sent.status,
    ok: sent.status < 400,
    detail: summarise(sent),
  });

  const token = ['token', 'jwt', 'accessToken', 'access_token', 'id_token']
    .map((key) => deepFind(sent.json, key))
    .find((value): value is string => Boolean(value));

  if (!token) {
    // 401/403 means the flow is right and the account is wrong — a different fix
    // from a 404 or a 500, so say which one this was.
    const rejected = sent.status === 401 || sent.status === 403 || sent.status === 422;
    return {
      credential: null,
      reason: rejected
        ? `the login endpoint rejected these credentials (${sent.status}) — the flow looks right, the account does not`
        : sent.status >= 400
          ? `login answered ${sent.status}`
          : `login answered ${sent.status} but the body carried no token field`,
      observations,
    };
  }

  const template = auth.header?.value ?? 'Bearer {token}';
  const name = auth.header?.name ?? 'Authorization';
  return {
    credential: { jar, headers: { [name]: template.replace(/\{[^}]*\}/, token) }, via: 'header', name },
    reason: `login answered ${sent.status} with a token`,
    observations,
  };
}

/** Mirror the request shape api.json recorded, substituting the real credentials. */
function shapeLoginBody(shape: unknown, username: string, password: string): unknown {
  if (!shape || typeof shape !== 'object') return { username, password, email: username };
  const fill = (node: unknown): unknown => {
    if (node === null || typeof node !== 'object') return node;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (value !== null && typeof value === 'object') out[key] = fill(value);
      else if (/^(email|username|user|login|identifier)$/i.test(key)) out[key] = username;
      else if (/^(password|pass|secret)$/i.test(key)) out[key] = password;
      else out[key] = value;
    }
    return out;
  };
  return fill(shape);
}

/** HTTP Basic against an endpoint that both authenticates and answers. */
export async function basicLogin(baseUrl: string, auth: AuthBlock): Promise<Attempt> {
  const observations: Observation[] = [];
  const account = credentialsFromEnv();
  if (!account) return { credential: null, reason: 'APP_USERNAME / APP_PASSWORD are not set', observations };

  const login = auth.loginEndpoint;
  if (!login?.path) return { credential: null, reason: 'api.json records no login path', observations };

  const encoded = Buffer.from(`${account.username}:${account.password}`).toString('base64');
  const headers: Record<string, string> = { Authorization: `Basic ${encoded}` };
  // Some apps want the same credential under a vendor header as well; api.json says which.
  for (const [name, value] of Object.entries(login.headers ?? {})) {
    if (/^authorization$/i.test(name)) continue;
    if (/base64/i.test(value)) headers[name] = encoded;
  }

  const url = resolve(baseUrl, login.path);
  const jar = new Jar();
  const sent = await send(url, { jar, method: (login.method ?? 'GET').toUpperCase(), headers });
  observations.push({
    step: 'login',
    request: `${login.method ?? 'GET'} ${url}`,
    status: sent.status,
    ok: sent.status < 400,
    detail: summarise(sent),
  });

  if (sent.status >= 400) return { credential: null, reason: `login answered ${sent.status}`, observations };
  return {
    credential: { jar, headers, via: 'header', name: 'Authorization' },
    reason: `Basic credentials answered ${sent.status}`,
    observations,
  };
}

/**
 * A form POST that sets a session cookie. The CSRF token, when api.json records
 * one, is read from the login page in the same jar — a token minted in another
 * session is rejected, and that is the failure this step exists to catch.
 */
export async function sessionLogin(baseUrl: string, auth: AuthBlock, loginPageUrl?: string): Promise<Attempt> {
  const observations: Observation[] = [];
  const account = credentialsFromEnv();
  if (!account) return { credential: null, reason: 'APP_USERNAME / APP_PASSWORD are not set', observations };

  const login = auth.loginEndpoint;
  if (!login?.path) return { credential: null, reason: 'api.json records no login path', observations };

  const jar = new Jar();
  const form = new URLSearchParams();
  const facts: Attempt['facts'] = {};

  const csrfField = auth.csrf?.field;
  if (csrfField) {
    // `fromPath` is a path the analysis states outright, so it beats the UI login URL
    // from the profile: an app that mints its token at a JSON pre-login endpoint keeps
    // nothing on the login page, and the generic URL would silently win and find none.
    const pageUrl = auth.csrf?.fromPath
      ? resolve(baseUrl, auth.csrf.fromPath)
      : loginPageUrl ?? resolve(baseUrl, String(auth.csrf?.from ?? '').match(/\/\S+/)?.[0] ?? '/');
    const page = await send(pageUrl, { jar });
    // The path this run actually used. `auth.csrf.from` is a sentence; this is a fact.
    facts.loginPagePath = new URL(pageUrl).pathname;
    // Read under the name the app publishes, send under the name it accepts.
    const readAs = auth.csrf?.readAs ?? csrfField;
    const token = csrfToken(page.body, readAs);
    const named = readAs === csrfField ? csrfField : `${readAs} (posted as ${csrfField})`;
    observations.push({
      step: 'csrf',
      request: `GET ${pageUrl}`,
      status: page.status,
      ok: Boolean(token),
      detail: token ? `read ${named} (${token.length} chars)` : `no ${readAs} at ${new URL(pageUrl).pathname}`,
    });
    if (!token) {
      return { credential: null, reason: `${new URL(pageUrl).pathname} carried no ${readAs}`, observations, facts };
    }
    form.set(csrfField, token);
  }

  for (const [field, source] of Object.entries(login.fields ?? {})) {
    if (field === csrfField) continue;
    if (source === 'env:APP_USERNAME') form.set(field, account.username);
    else if (source === 'env:APP_PASSWORD') form.set(field, account.password);
  }
  if (!form.has('username') && !form.has('email') && Object.keys(login.fields ?? {}).length === 0) {
    form.set('username', account.username);
    form.set('password', account.password);
  }

  const url = resolve(baseUrl, login.path);
  const sent = await send(url, {
    jar,
    method: (login.method ?? 'POST').toUpperCase(),
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  const location = sent.headers.get('location') ?? '';
  observations.push({
    step: 'login',
    request: `${login.method ?? 'POST'} ${url}`,
    status: sent.status,
    ok: isRedirect(sent.status) || sent.status < 400,
    detail: isRedirect(sent.status) ? `redirect → ${location}` : summarise(sent),
  });

  // A form login that fails usually answers 200 and re-renders the login page,
  // or redirects straight back to it. Both are failures, not successes.
  const bouncedBack = isRedirect(sent.status) && /login|signin|sign-in/i.test(location);
  if (sent.status >= 400 || bouncedBack) {
    return {
      credential: null,
      reason: bouncedBack ? `login redirected back to ${location}` : `login answered ${sent.status}`,
      observations,
      facts,
    };
  }

  const expected = auth.success?.cookie;
  const cookieName = expected && jar.has(expected) ? expected : jar.names().at(-1);
  if (!cookieName) return { credential: null, reason: 'no cookie was set by the login', observations, facts };

  return {
    credential: { jar, headers: {}, via: 'cookie', name: cookieName },
    reason: `login answered ${sent.status} and set ${cookieName}`,
    observations,
    facts,
  };
}
