#!/usr/bin/env -S npx tsx
/**
 * Prove that the login recorded in analysis.json actually works against
 * the running instance — and that the credential it yields opens a protected read.
 *
 * A citation to a source file is a hypothesis. This turns it into a fact, and
 * stamps the fact back into api.json as `authVerification`.
 *
 *   npx tsx scripts/api-auth/verify-auth.ts [--write] [--json]
 *   npx tsx scripts/api-auth/verify-auth.ts --all
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve as resolvePath, join } from 'node:path';
// @ts-ignore - the explorer's yaml reader is plain JS shared across the pipeline
import { loadProfile, ANALYSIS_PATH } from '../config/profile.mjs';
import { Jar, send } from './http.ts';
import { tokenLogin, basicLogin, sessionLogin, credentialsFromEnv, type Credential, type Attempt } from './strategies.ts';
import { browserLogin } from './browser-login.ts';
import { cascadeFor } from './cascade.ts';
import type { AuthAttempt, AuthBlock, AuthStrategy, Endpoint, Observation, VerifyResult, Verdict } from './types.ts';

/** How many candidate endpoints to try before giving up on finding a protected one. */
const MAX_PROBES = 6;

interface Args { write: boolean; json: boolean }

function parseArgs(argv: string[]): Args {
  const args: Args = { write: false, json: false };
  for (const a of argv) {
    if (a === '--write') args.write = true;
    else if (a === '--json') args.json = true;
  }
  return args;
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

async function verify(): Promise<VerifyResult> {
  const analysis = JSON.parse(readFileSync(ANALYSIS_PATH, 'utf8')) as {
    app?: { baseUrl?: string; name?: string }; api?: { auth?: AuthBlock; endpoints?: Endpoint[] };
  };
  const api = { ...analysis.api, baseUrl: analysis.app?.baseUrl } as {
    baseUrl?: string; auth?: AuthBlock; endpoints?: Endpoint[];
  };
  let profile: { baseUrl?: string; auth?: { loginUrl?: string } | null } = {};
  try { profile = loadProfile(); } catch { profile = {}; }
  const app = analysis.app?.name ?? 'app';

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

  // Try each shape until one produces a credential a protected read accepts. The
  // declared kind goes first because it is usually right, not because it is binding.
  const observations: Observation[] = [];
  const attempts: AuthAttempt[] = [];
  let lastProbe: VerifyResult['probe'] | undefined;
  let lastVerdict: Verdict = 'failed';

  for (const strategy of cascadeFor(auth)) {
    const attempt = await runStrategy(strategy, baseUrl, auth, profile.auth?.loginUrl);
    observations.push(...attempt.observations);

    if (!attempt.credential) {
      attempts.push({ strategy, outcome: 'no-credential', reason: attempt.reason });
      continue;
    }

    const probe = await proveCredential(baseUrl, api.endpoints ?? [], attempt.credential, observations);
    if (probe.verdict === 'verified') {
      attempts.push({ strategy, outcome: 'verified', reason: probe.reason });
      return {
        ...base,
        verdict: 'verified',
        reason: probe.reason,
        strategy,
        attempts,
        ...(attempt.facts?.loginPagePath ? { loginPagePath: attempt.facts.loginPagePath } : {}),
        credential: {
          via: attempt.credential.via,
          name: attempt.credential.name,
          ...(attempt.credential.replay ? { replay: attempt.credential.replay } : {}),
        },
        probe: probe.probe,
        observations,
      };
    }

    // The login worked and the credential did not open a protected read. That is a
    // different failure from "no credential", and the next rung may still succeed.
    attempts.push({ strategy, outcome: 'credential-refused', reason: probe.reason });
    lastProbe = probe.probe;
    lastVerdict = probe.verdict;
  }

  return {
    ...base,
    verdict: attempts.some(a => a.outcome === 'credential-refused') ? lastVerdict : 'failed',
    reason: attempts.length
      ? `no strategy produced a verified credential (tried ${attempts.map(a => a.strategy).join(', ')})`
      : 'no auth strategy was applicable',
    attempts,
    probe: lastProbe,
    observations,
  };
}

/** Dispatch one rung. Every strategy has the same shape, so this is a table, not logic. */
async function runStrategy(
  strategy: AuthStrategy,
  baseUrl: string,
  auth: AuthBlock,
  loginPageUrl?: string,
): Promise<Attempt> {
  if (strategy === 'basic') return basicLogin(baseUrl, auth);
  if (strategy === 'token') return tokenLogin(baseUrl, auth);
  if (strategy === 'browser') return browserLogin(baseUrl, auth);
  return sessionLogin(baseUrl, auth, loginPageUrl);
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

function stamp(result: VerifyResult): void {
  const path = ANALYSIS_PATH;
  const analysis = JSON.parse(readFileSync(path, 'utf8')) as Record<string, any>;
  analysis.api = analysis.api ?? {};
  analysis.api.authVerification = {
    verdict: result.verdict,
    reason: result.reason,
    // The rung that won. The generator emits this, not `auth.kind`.
    strategy: result.strategy ?? null,
    loginPagePath: result.loginPagePath ?? null,
    checkedAt: result.checkedAt,
    credential: result.credential ?? null,
    probe: result.probe ?? null,
    attempts: result.attempts ?? [],
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

const OUTCOME: Record<AuthAttempt['outcome'], string> = {
  verified: '✓',
  'no-credential': '✗',
  'credential-refused': '·',
};

function report(result: VerifyResult): void {
  console.log(`\n${result.app}  [${result.kind}]  ${MARK[result.verdict]}`);
  console.log(`  ${result.reason}`);
  // Every rung tried, so a failure names all of them and not just the last.
  if (result.attempts?.length) {
    console.log('');
    for (const attempt of result.attempts) {
      console.log(`    ${OUTCOME[attempt.outcome]} ${attempt.strategy.padEnd(9)} ${attempt.reason}`);
    }
  }
  console.log('');
  for (const observation of result.observations) {
    console.log(`    ${observation.step.padEnd(20)} ${String(observation.status ?? '—').padStart(3)}  ${observation.detail}`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const results: VerifyResult[] = [];
  {
    const result = await verify().catch((error: unknown) => ({
      app: 'app',
      kind: 'none' as const,
      verdict: 'failed' as const,
      reason: `the verifier itself threw: ${error instanceof Error ? error.message : String(error)}`,
      observations: [],
      checkedAt: new Date().toISOString(),
    }));
    results.push(result);
    if (args.write) stamp(result);
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
