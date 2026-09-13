/**
 * One function per auth shape. Each returns the credential a later request must
 * carry, or an explanation of why it could not get one. No application is named.
 */
import { Jar, send, csrfToken, deepFind, type Sent } from './http.ts';
import type { AuthBlock, Observation } from './types.ts';

export interface Credential {
  jar: Jar;
  headers: Record<string, string>;
  /** How the caller should describe what proved the login. */
  via: 'header' | 'cookie';
  name: string;
}

export interface Attempt {
  credential: Credential | null;
  reason: string;
  observations: Observation[];
}

const isRedirect = (status: number) => status >= 300 && status < 400;

function summarise(sent: Sent): string {
  const body = sent.body.trim().replace(/\s+/g, ' ');
  return body.length > 180 ? `${body.slice(0, 180)}…` : body || '(empty body)';
}

function resolve(baseUrl: string, path: string): string {
  return new URL(path, baseUrl).toString();
}

/** Credentials come from the environment, never from a committed file. */
export function credentialsFromEnv(): { username: string; password: string } | null {
  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;
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

  const csrfField = auth.csrf?.field;
  if (csrfField) {
    const pageUrl = loginPageUrl ?? resolve(baseUrl, String(auth.csrf?.from ?? '').match(/\/\S+/)?.[0] ?? '/');
    const page = await send(pageUrl, { jar });
    const token = csrfToken(page.body, csrfField);
    observations.push({
      step: 'csrf',
      request: `GET ${pageUrl}`,
      status: page.status,
      ok: Boolean(token),
      detail: token ? `read ${csrfField} (${token.length} chars)` : `no ${csrfField} on the login page`,
    });
    if (!token) {
      return { credential: null, reason: `the login page carried no ${csrfField}`, observations };
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
    };
  }

  const expected = auth.success?.cookie;
  const cookieName = expected && jar.has(expected) ? expected : jar.names().at(-1);
  if (!cookieName) return { credential: null, reason: 'no cookie was set by the login', observations };

  return {
    credential: { jar, headers: {}, via: 'cookie', name: cookieName },
    reason: `login answered ${sent.status} and set ${cookieName}`,
    observations,
  };
}
