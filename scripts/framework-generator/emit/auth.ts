// Renders the auth plan the generated project replays.
//
// Every value here comes from a run of scripts/api-auth/verify-auth.ts against the
// live application. Nothing is read out of source and hoped for — that was the defect
// this file exists to remove: the generator used to transcribe `auth.uiLogin`'s CSS
// selectors into browser keystrokes while a *verified* login sat unused in the same
// analysis, and the API layer it emitted was never authenticated at all.
import { header } from './naming.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

export interface AuthFacts {
  strategy: 'session' | 'token' | 'basic' | 'browser';
  via: 'cookie' | 'header';
  verdict: string;
  reason: string;
}

/** What the analysis proved, or an explanation of why nothing can be emitted. */
export function authFacts(model: AppModel): AuthFacts | null {
  const verification = (model.api as any).authVerification;
  if (!verification || verification.verdict !== 'verified') return null;
  return {
    strategy: verification.strategy ?? 'session',
    via: verification.credential?.via ?? 'cookie',
    verdict: verification.verdict,
    reason: verification.reason ?? '',
  };
}

/**
 * The login page's path.
 *
 * `csrf.from` is prose — "a hidden input on /auth/login" — and the verifier used to
 * regex a path out of it, one rephrasing away from silently falling back to "/". The
 * generator refuses instead: a guess that compiles is worse than a build that stops.
 */
function csrfPath(csrf: any, verification: any): string {
  // What the verifier actually fetched beats what the analysis says it would.
  if (verification?.loginPagePath) return verification.loginPagePath;
  if (csrf.fromPath) return csrf.fromPath;
  throw new Error(
    `api.auth.csrf declares the field ${JSON.stringify(csrf.field)} but no "fromPath".\n` +
    `  The login page's path must be recorded as data, not inside the prose of "from".\n` +
    `  Re-run \`npm run verify-auth -- --write\` (which records the path it fetched),\n` +
    `  or re-run the app-api skill so it writes csrf.fromPath.`,
  );
}

export function renderAuthPlan(model: AppModel): string {
  const auth: any = model.api.auth ?? {};
  const verification = (model.api as any).authVerification ?? {};
  const facts = authFacts(model);
  if (!facts) {
    throw new Error('renderAuthPlan called without a verified login — emit.ts gates this.');
  }

  const login = auth.loginEndpoint ?? {};
  const probe = verification.probe ?? {};
  const plan: Record<string, unknown> = {
    strategy: facts.strategy,
    login: { method: (login.method ?? 'POST').toUpperCase(), path: login.path ?? '/' },
    // Names of environment variables, never values. A credential literal in generated
    // code is a committed secret.
    fields: { username: 'APP_USERNAME', password: 'APP_PASSWORD' },
  };

  if (auth.csrf?.field) {
    plan.csrf = { field: auth.csrf.field, fromPath: csrfPath(auth.csrf, verification) };
  }
  if (auth.success) {
    plan.success = {
      ...(auth.success.status ? { status: auth.success.status } : {}),
      ...(auth.success.redirect ? { redirectIncludes: auth.success.redirect } : {}),
      ...(auth.success.cookie ? { cookie: auth.success.cookie } : {}),
    };
  }
  if (auth.header?.name) {
    plan.header = {
      name: auth.header.name,
      template: (auth.header.value ?? 'Bearer {token}').replace(/\{[^}]*\}/, '{}'),
    };
  }
  if (facts.strategy === 'browser' && verification.credential?.replay) {
    const replay = verification.credential.replay;
    plan.replay = { cookies: Boolean(replay.cookies), headers: replay.headers ?? {} };
  }

  // The endpoint the verifier proved discriminating: it refused an anonymous caller
  // and admitted this credential. A login answering 200 is not evidence; this is.
  if (!probe.path) {
    throw new Error(
      'authVerification records no probe, so the generated login would have nothing to ' +
      'check itself against. Re-run: npm run verify-auth -- --write',
    );
  }
  plan.verifyWith = { method: (probe.method ?? 'GET').toUpperCase(), path: probe.path };

  return [
    header(model),
    `// Proven ${verification.checkedAt ?? 'during analysis'} by scripts/api-auth/verify-auth.ts:`,
    `//   ${facts.reason}`,
    `import type { AuthPlan } from '../support/auth-plan-types.ts';`,
    '',
    `export type { AuthPlan, ReplaySource } from '../support/auth-plan-types.ts';`,
    '',
    `export const AUTH_PLAN: AuthPlan = ${JSON.stringify(plan, null, 2)};`,
    '',
  ].join('\n');
}
