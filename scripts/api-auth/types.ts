/** Types shared by the auth verifier. Nothing here names an application. */

export type AuthKind = 'token' | 'session' | 'basic' | 'undocumented-in-spec' | 'none';

/**
 * A way of obtaining a credential. `auth.kind` orders these; it does not choose one.
 * `browser` is the last resort: it performs the app's own UI login and replays what
 * the app itself sends, for flows no HTTP shape can reproduce.
 */
export type AuthStrategy = 'session' | 'token' | 'basic' | 'browser';

/** One rung of the cascade, and what it produced. */
export interface AuthAttempt {
  strategy: AuthStrategy;
  outcome: 'verified' | 'no-credential' | 'credential-refused';
  reason: string;
}

/** The `auth` block an app-api run writes into the `api` section of analysis.json. */
export interface AuthBlock {
  kind?: string;
  scheme?: string;
  loginEndpoint?: {
    method?: string;
    path?: string;
    auth?: string | null;
    headers?: Record<string, string>;
    fields?: Record<string, string>;
    request?: unknown;
  } | null;
  success?: {
    status?: number;
    cookie?: string;
    redirect?: string;
    body?: unknown;
  } | null;
  csrf?: {
    field?: string;
    /**
     * The key the token is published under, when it differs from the field it is sent
     * back as. An app that mints its token in a JSON pre-login response commonly names
     * it one thing there and accepts it under another on the form. Defaults to `field`.
     */
    readAs?: string;
    /** Prose: "a hidden input on /auth/login". Human-readable, not machine-readable. */
    from?: string;
    /**
     * The login page's path. Added because the verifier used to regex a path out of
     * `from`, which is one rephrasing away from silently falling back to "/". The
     * generator requires this field and never scrapes the prose.
     */
    fromPath?: string;
  } | null;
  header?: { name?: string; value?: string } | null;
  users?: Array<{ role?: string; username?: string; password?: string }>;
}

/** Where a harvested credential lives, and how the app presents it on the wire. */
export interface ReplaySource {
  from: 'cookie' | 'localStorage' | 'sessionStorage';
  key: string;
  /** `Bearer {}` when the header wraps the stored value; absent when it is the value. */
  template?: string;
}

/**
 * How to rebuild a browser-harvested credential outside the browser.
 *
 * Derived by observing a request the application itself made, never by guessing
 * which storage key holds a token.
 */
export interface ReplayRule {
  /** Whether the harvested cookies alone carry the session. */
  cookies: boolean;
  headers: Record<string, ReplaySource>;
  /** Headers that were sent but match nothing in storage — reported, never emitted. */
  underivable?: string[];
}

export interface Endpoint {
  method: string;
  path: string;
  tier?: string;
  auth?: boolean;
  summary?: string;
}

/** What one attempt against a running instance actually observed. */
export interface Observation {
  step: 'csrf' | 'login' | 'probe-anonymous' | 'probe-authenticated';
  request: string;
  status: number | null;
  ok: boolean;
  detail: string;
}

export type Verdict = 'verified' | 'failed' | 'unverifiable' | 'skipped';

export interface VerifyResult {
  app: string;
  kind: AuthKind;
  verdict: Verdict;
  /** One sentence a human can act on. */
  reason: string;
  /** The rung that won. This — not `kind` — is what the generator emits. */
  strategy?: AuthStrategy;
  /** Every rung tried, in order. A failure names all of them, not just the last. */
  attempts?: AuthAttempt[];
  /**
   * The login page this run actually fetched the CSRF token from. Recorded because
   * `auth.csrf.from` is prose and the generator must not scrape a path out of a
   * sentence — see renderAuthPlan.
   */
  loginPagePath?: string;
  credential?: { via: 'header' | 'cookie'; name: string; replay?: ReplayRule };
  probe?: { method: string; path: string; anonymous: number | null; authenticated: number | null };
  observations: Observation[];
  checkedAt: string;
}
