#!/usr/bin/env -S npx tsx
/**
 * Prove that the login recorded in analysis/<app>/api.json actually works against
 * the running instance — and that the credential it yields opens a protected read.
 *
 * A citation to a source file is a hypothesis. This turns it into a fact, and
 * stamps the fact back into api.json as `authVerification`.
 *
 *   npx tsx scripts/api-auth/verify-auth.ts --app <app> [--write] [--json]
 *   npx tsx scripts/api-auth/verify-auth.ts --all
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve as resolvePath, join } from 'node:path';
// @ts-ignore - the explorer's yaml reader is plain JS shared across the pipeline
import { parseYaml } from '../../.claude/skills/app-explorer/lib/yaml-lite.mjs';
import { Jar, send } from './http.ts';
import { tokenLogin, basicLogin, sessionLogin, credentialsFromEnv, type Credential } from './strategies.ts';
import type { AuthBlock, Endpoint, Observation, VerifyResult, Verdict } from './types.ts';

const ROOT = resolvePath(import.meta.dirname, '../..');
const ANALYSIS = join(ROOT, 'analysis');

/** How many candidate endpoints to try before giving up on finding a protected one. */
const MAX_PROBES = 6;

interface Args { apps: string[]; write: boolean; json: boolean }

function parseArgs(argv: string[]): Args {
  const args: Args = { apps: [], write: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--app') args.apps.push(argv[++i]);
    else if (argv[i] === '--all') args.apps = listApps();
    else if (argv[i] === '--write') args.write = true;
    else if (argv[i] === '--json') args.json = true;
  }
  if (args.apps.length === 0) args.apps = listApps();
  return args;
}

function listApps(): string[] {
  return readdirSync(ANALYSIS, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(ANALYSIS, entry.name, 'analysis.json')))
    .map((entry) => entry.name)
    .sort();
}

/**
 * Pick reads that ought to be protected: a GET with no path parameter, so no
 * record has to exist for it to answer. Tier A first — those are contract-declared.
 */
function probeCandidates(endpoints: Endpoint[]): Endpoint[] {
  return endpoints
    .filter((e) => e.method?.toUpperCase() === 'GET' && !e.path.includes('{') && !e.path.includes(':'))
    .filter((e) => e.auth !== false)
    .sort((a, b) => (a.tier === 'A' ? 0 : 1) - (b.tier === 'A' ? 0 : 1) || a.path.length - b.path.length)
    .slice(0, MAX_PROBES);
}

async function verify(app: string): Promise<VerifyResult> {
  const analysis = JSON.parse(readFileSync(join(ANALYSIS, app, 'analysis.json'), 'utf8')) as {
    app?: { baseUrl?: string }; api?: { auth?: AuthBlock; endpoints?: Endpoint[] };
  };
  const api = { ...analysis.api, baseUrl: analysis.app?.baseUrl } as {
    baseUrl?: string; auth?: AuthBlock; endpoints?: Endpoint[];
  };
  const profilePath = join(ANALYSIS, app, 'app-profile.yaml');
  const profile = existsSync(profilePath)
    ? (parseYaml(readFileSync(profilePath, 'utf8')) as { baseUrl?: string; auth?: { loginUrl?: string } | null })
    : {};

  const baseUrl = api.baseUrl ?? profile.baseUrl;
  const auth = api.auth ?? {};
  const kind = (auth.kind ?? 'none') as VerifyResult['kind'];
  const checkedAt = new Date().toISOString();
  const base = { app, kind, checkedAt, observations: [] as Observation[] };

  if (!baseUrl) {
    return { ...base, verdict: 'unverifiable', reason: 'api.json records no baseUrl to call' };
  }
  if (kind === 'none' || !auth.loginEndpoint) {
    return { ...base, verdict: 'skipped', reason: 'this app declares no API login' };
  }
  if (kind === 'undocumented-in-spec') {
    return {
      ...base,
      verdict: 'unverifiable',
      reason: 'the spec declares no security scheme — settle the credential against a deployment first',
    };
  }
  if (!credentialsFromEnv()) {
    return { ...base, verdict: 'skipped', reason: 'APP_USERNAME / APP_PASSWORD are not set in the environment' };
  }

  // The shape of the login request decides the strategy, not the name of the
  // credential it returns: an app can hand back a token in exchange for Basic.
  const wantsBasic = kind === 'basic'
    || auth.loginEndpoint.auth === 'basic'
    || Object.values(auth.loginEndpoint.headers ?? {}).some((value) => /basic|base64/i.test(value));
  const attempt = wantsBasic
    ? await basicLogin(baseUrl, auth)
    : kind === 'token'
      ? await tokenLogin(baseUrl, auth)
      : await sessionLogin(baseUrl, auth, profile.auth?.loginUrl);

  const observations = [...attempt.observations];
  if (!attempt.credential) {
    return { ...base, verdict: 'failed', reason: attempt.reason, observations };
  }

  const probe = await proveCredential(baseUrl, api.endpoints ?? [], attempt.credential, observations);
  return {
    ...base,
    verdict: probe.verdict,
    reason: probe.reason,
    credential: { via: attempt.credential.via, name: attempt.credential.name },
    probe: probe.probe,
    observations,
  };
}

/**
 * A login that answers 200 has proved nothing on its own. The credential is only
 * real if a read refuses an anonymous caller and admits this one.
 */
async function proveCredential(
  baseUrl: string,
  endpoints: Endpoint[],
  credential: Credential,
  observations: Observation[],
): Promise<{ verdict: Verdict; reason: string; probe?: VerifyResult['probe'] }> {
  const candidates = probeCandidates(endpoints);
  if (candidates.length === 0) {
    return { verdict: 'unverifiable', reason: 'the login succeeded but api.json lists no parameter-free GET to prove it against' };
  }

  let lastOpen: VerifyResult['probe'] | undefined;
  for (const candidate of candidates) {
    const url = new URL(candidate.path, baseUrl).toString();
    const anonymous = await send(url, { jar: new Jar() }).catch(() => null);
    const authenticated = await send(url, { jar: credential.jar, headers: credential.headers }).catch(() => null);
    const probe = {
      method: candidate.method,
      path: candidate.path,
      anonymous: anonymous?.status ?? null,
      authenticated: authenticated?.status ?? null,
    };
    observations.push(
      { step: 'probe-anonymous', request: `GET ${url}`, status: probe.anonymous, ok: true, detail: 'no credential' },
      {
        step: 'probe-authenticated',
        request: `GET ${url}`,
        status: probe.authenticated,
        ok: (probe.authenticated ?? 500) < 400,
        detail: `${credential.via} ${credential.name}`,
      },
    );

    const admitted = probe.authenticated !== null && probe.authenticated < 300;
    const refusedAnonymously = probe.anonymous === null || probe.anonymous >= 300;
    if (admitted && refusedAnonymously) {
      return {
        verdict: 'verified',
        reason: `${candidate.path} answers ${probe.anonymous} anonymously and ${probe.authenticated} with the credential`,
        probe,
      };
    }
    if (admitted) lastOpen = probe; // the endpoint is public; try another
  }

  if (lastOpen) {
    return {
      verdict: 'unverifiable',
      reason: `the login succeeded but every endpoint tried answers ${lastOpen.anonymous} anonymously too — none of them is protected`,
      probe: lastOpen,
    };
  }
  return {
    verdict: 'failed',
    reason: 'the login reported success but the credential was refused by every read tried',
    probe: { method: candidates[0].method, path: candidates[0].path, anonymous: null, authenticated: null },
  };
}

function stamp(app: string, result: VerifyResult): void {
  const path = join(ANALYSIS, app, 'analysis.json');
  const analysis = JSON.parse(readFileSync(path, 'utf8')) as Record<string, any>;
  analysis.api = analysis.api ?? {};
  analysis.api.authVerification = {
    verdict: result.verdict,
    reason: result.reason,
    checkedAt: result.checkedAt,
    credential: result.credential ?? null,
    probe: result.probe ?? null,
    observations: result.observations,
  };
  writeFileSync(path, `${JSON.stringify(analysis, null, 2)}\n`);
}

const MARK: Record<Verdict, string> = {
  verified: '✓ verified',
  failed: '✗ failed',
  unverifiable: '? unverifiable',
  skipped: '– skipped',
};

function report(result: VerifyResult): void {
  console.log(`\n${result.app}  [${result.kind}]  ${MARK[result.verdict]}`);
  console.log(`  ${result.reason}`);
  for (const observation of result.observations) {
    console.log(`    ${observation.step.padEnd(20)} ${String(observation.status ?? '—').padStart(3)}  ${observation.detail}`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const results: VerifyResult[] = [];
  for (const app of args.apps) {
    const result = await verify(app).catch((error: unknown) => ({
      app,
      kind: 'none' as const,
      verdict: 'failed' as const,
      reason: `the verifier itself threw: ${error instanceof Error ? error.message : String(error)}`,
      observations: [],
      checkedAt: new Date().toISOString(),
    }));
    results.push(result);
    if (args.write) stamp(app, result);
    if (!args.json) report(result);
  }

  if (args.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    const tally = (verdict: Verdict) => results.filter((r) => r.verdict === verdict).length;
    console.log(
      `\n${tally('verified')} verified, ${tally('failed')} failed, ` +
      `${tally('unverifiable')} unverifiable, ${tally('skipped')} skipped` +
      (args.write ? ' — stamped into api.json' : ' — not written (pass --write)'),
    );
  }
  // A failure is a finding, not a crash; only a failed login makes this non-zero.
  process.exitCode = results.some((r) => r.verdict === 'failed') ? 1 : 0;
}

await main();
