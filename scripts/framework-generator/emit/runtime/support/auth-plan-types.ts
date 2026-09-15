// The shape of the auth plan. The plan itself is generated into src/config/auth-plan.ts
// from the strategy verify-auth.ts proved; these types are ordinary code and ship as-is.

export interface ReplaySource {
  from: 'cookie' | 'localStorage' | 'sessionStorage';
  key: string;
  /** `Bearer {}` when the header wraps the stored value, absent when it is the value. */
  template?: string;
}

export interface AuthPlan {
  /** The rung that was proven — not the one the source was read to suggest. */
  strategy: 'session' | 'token' | 'basic' | 'browser';
  login: { method: string; path: string };
  /** Which environment variable supplies each field. Never a literal credential. */
  fields: { username: string; password: string };
  csrf?: { field: string; fromPath: string };
  success?: { status?: number; redirectIncludes?: string; cookie?: string };
  header?: { name: string; template: string };
  /** Browser strategy only: how to rebuild the credential outside the browser. */
  replay?: { cookies: boolean; headers: Record<string, ReplaySource> };
  /**
   * A read proven to refuse an anonymous caller and admit this credential.
   * A login answering 200 is not evidence — a re-rendered login page answers 200 too.
   */
  verifyWith: { method: string; path: string };
}
