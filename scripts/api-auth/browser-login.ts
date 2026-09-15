/**
 * The last rung: let the browser do the login, then take what it ends up holding.
 *
 * This exists for the flows no HTTP shape can perform — OAuth2 redirects, SSO/SAML,
 * TOTP MFA — where the browser follows the whole dance natively. It is slow and it
 * needs a browser, so the cascade only reaches it when every HTTP shape has failed.
 *
 * Two things make it a real strategy rather than a shortcut:
 *
 *   1. the replay rule is *derived from what the application itself sent*, not from
 *      guessing which storage key holds a token (see replay.ts);
 *   2. the credential it returns is proved through the ordinary bare-HTTP probe, never
 *      through the browser that produced it. A logged-in browser proves the browser is
 *      logged in — it says nothing about whether the credential survives extraction,
 *      and that gap is exactly the defect this whole change exists to close.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile, mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Jar } from './http.ts';
import { deriveReplay, describeReplay, type Harvest } from './replay.ts';
import { credentialsFromEnv, type Attempt, type Credential } from './strategies.ts';
import type { AuthBlock, Observation, ReplayRule } from './types.ts';

const run = promisify(execFile);
const HERE = dirname(fileURLToPath(import.meta.url));
const SESSION = 'auth-harvest';

interface UiLogin {
  loginUrl?: string;
  steps?: { action?: string; selector: string; value?: string }[];
  readyWhen?: string;
}

interface HarvestResult {
  ok: boolean;
  reason?: string;
  url?: string;
  cookies?: Record<string, string>;
  localStorage?: Record<string, string>;
  sessionStorage?: Record<string, string>;
  observed?: { url: string; method: string; headers: Record<string, string> }[];
  steps?: { step: string; ok: boolean; detail: string }[];
}

/** Substitute the real credentials into the recorded steps. Values never come from a file. */
function fillSteps(steps: UiLogin['steps'], username: string, password: string) {
  return (steps ?? []).map(step => {
    const value = typeof step.value === 'string' && step.value.startsWith('env:')
      ? (step.value === 'env:APP_USERNAME' ? username : step.value === 'env:APP_PASSWORD' ? password : process.env[step.value.slice(4)] ?? '')
      : step.value;
    return { action: step.action ?? 'click', selector: step.selector, value };
  });
}

async function harvest(config: unknown): Promise<HarvestResult> {
  const template = await readFile(join(HERE, 'harvest-batch.js'), 'utf8');
  const source = template.replace('__CONFIG__', JSON.stringify(config));
  const dir = await mkdtemp(join(tmpdir(), 'auth-harvest-'));
  const file = join(dir, 'harvest.js');
  await writeFile(file, source, 'utf8');

  let stdout = '';
  try {
    // The CLI can exit non-zero having already printed a complete result, so the
    // output decides rather than the exit code — the same rule the crawler follows.
    ({ stdout } = await run('playwright-cli', ['-s=' + SESSION, '--raw', 'run-code', '--filename=' + file], {
      maxBuffer: 32 * 1024 * 1024,
    }));
  } catch (error) {
    stdout = (error as { stdout?: string }).stdout ?? '';
    if (!stdout.includes('{')) {
      const message = (error as Error).message.split('\n')[0];
      return { ok: false, reason: `playwright-cli could not run the login: ${message}` };
    }
  }

  const start = stdout.indexOf('{');
  if (start === -1) return { ok: false, reason: 'the browser returned no result' };
  try {
    return JSON.parse(stdout.slice(start, stdout.lastIndexOf('}') + 1)) as HarvestResult;
  } catch {
    return { ok: false, reason: 'the browser returned output that was not JSON' };
  }
}

/** Rebuild the harvested credential as something a bare HTTP client can send. */
function credentialFrom(result: HarvestResult, rule: ReplayRule): Credential {
  const jar = new Jar();
  // The Jar absorbs Set-Cookie lines, which is the only way in; a harvested cookie
  // is presented the same way so nothing has to know where it came from.
  jar.absorb(new Response('', {
    headers: Object.entries(result.cookies ?? {}).map(
      ([name, value]) => ['set-cookie', `${name}=${value}`] as [string, string],
    ),
  }));

  const headers: Record<string, string> = {};
  const stores: Record<string, Record<string, string>> = {
    cookie: result.cookies ?? {},
    localStorage: result.localStorage ?? {},
    sessionStorage: result.sessionStorage ?? {},
  };
  for (const [name, source] of Object.entries(rule.headers)) {
    const value = stores[source.from]?.[source.key];
    if (!value) continue;
    headers[name] = source.template ? source.template.replace('{}', value) : value;
  }

  const cookieNames = Object.keys(result.cookies ?? {});
  return {
    jar,
    headers,
    via: Object.keys(headers).length && !cookieNames.length ? 'header' : 'cookie',
    name: cookieNames.at(-1) ?? Object.keys(headers)[0] ?? 'harvested',
    replay: rule,
  };
}

export async function browserLogin(baseUrl: string, auth: AuthBlock): Promise<Attempt> {
  const observations: Observation[] = [];
  const account = credentialsFromEnv();
  if (!account) return { credential: null, reason: 'APP_USERNAME / APP_PASSWORD are not set', observations };

  const ui = (auth as { uiLogin?: UiLogin }).uiLogin;
  if (!ui?.steps?.length) {
    return { credential: null, reason: 'the analysis records no uiLogin steps to perform', observations };
  }

  const loginUrl = ui.loginUrl ?? new URL('/', baseUrl).toString();
  const result = await harvest({
    loginUrl,
    steps: fillSteps(ui.steps, account.username, account.password),
    readyWhen: ui.readyWhen ?? null,
  });

  observations.push({
    step: 'login',
    request: `BROWSER ${loginUrl}`,
    status: result.ok ? 200 : null,
    ok: Boolean(result.ok),
    detail: result.ok
      ? `signed in, landed on ${result.url}`
      : result.reason ?? 'the browser login failed',
  });

  if (!result.ok) {
    return { credential: null, reason: result.reason ?? 'the browser login failed', observations };
  }

  const cookieCount = Object.keys(result.cookies ?? {}).length;
  const observed = result.observed?.[0];
  if (!observed && !cookieCount) {
    return {
      credential: null,
      reason: 'the browser login left no cookie and made no same-origin request to learn from',
      observations,
    };
  }

  // No observed request means we can still replay cookies — but say so, because a
  // header-borne credential would be silently missing and every POST would 403.
  const harvestInput: Harvest = {
    headers: observed?.headers ?? {},
    cookies: result.cookies ?? {},
    localStorage: result.localStorage,
    sessionStorage: result.sessionStorage,
  };
  const rule = deriveReplay(harvestInput);

  observations.push({
    step: 'probe-anonymous',
    request: observed ? `${observed.method} ${observed.url}` : '(no same-origin request observed)',
    status: null,
    ok: true,
    detail: observed
      ? `replay derived: ${describeReplay(rule)}`
      : `no request to learn from — replaying cookies only (${cookieCount} cookie${cookieCount === 1 ? '' : 's'})`,
  });

  return {
    credential: credentialFrom(result, rule),
    reason: observed
      ? `browser login succeeded; ${describeReplay(rule)}`
      : 'browser login succeeded; cookies replayed without an observed request',
    observations,
  };
}
