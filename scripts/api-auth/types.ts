/** Types shared by the auth verifier. Nothing here names an application. */

export type AuthKind = 'token' | 'session' | 'basic' | 'undocumented-in-spec' | 'none';

/** The `auth` block an app-api run writes into analysis/<app>/api.json. */
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
    from?: string;
  } | null;
  header?: { name?: string; value?: string } | null;
  users?: Array<{ role?: string; username?: string; password?: string }>;
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
  credential?: { via: 'header' | 'cookie'; name: string };
  probe?: { method: string; path: string; anonymous: number | null; authenticated: number | null };
  observations: Observation[];
  checkedAt: string;
}
