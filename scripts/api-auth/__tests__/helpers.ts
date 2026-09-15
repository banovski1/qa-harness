/**
 * A scripted `fetch` so the auth strategies can be exercised without a network.
 *
 * `strategies.ts` reaches the wire through `http.ts`'s `send()`, which calls the
 * platform `fetch`. Stubbing that one global keeps the strategies under test exactly
 * as they ship — no seam invented for the test's benefit.
 */

export interface Route {
  /** Matched against the full URL by substring, so tests name paths, not origins. */
  path: string;
  method?: string;
  status?: number;
  body?: string;
  headers?: Record<string, string>;
  /** Cookies to set, as `name=value` — the Jar reads these the same way it reads a wire. */
  cookies?: string[];
}

export interface Wire {
  /** Every request made, in order: `${method} ${url}`. */
  calls: string[];
  restore: () => void;
}

/** Install a fetch that answers from `routes`, and record what was asked of it. */
export function wire(routes: Route[]): Wire {
  const original = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input: unknown, init?: { method?: string }) => {
    const url = String(input);
    const method = (init?.method ?? 'GET').toUpperCase();
    calls.push(`${method} ${url}`);

    const route = routes.find(
      r => url.includes(r.path) && (!r.method || r.method.toUpperCase() === method),
    );
    if (!route) {
      return new Response('no route', { status: 599 });
    }

    const headers = new Headers(route.headers ?? {});
    for (const cookie of route.cookies ?? []) headers.append('set-cookie', cookie);
    return new Response(route.body ?? '', { status: route.status ?? 200, headers });
  }) as typeof globalThis.fetch;

  return { calls, restore: () => { globalThis.fetch = original; } };
}

/** Set the credentials the strategies read, and hand back an undo. */
export function withCredentials(username = 'admin', password = 'secret'): () => void {
  const before = { u: process.env.APP_USERNAME, p: process.env.APP_PASSWORD };
  process.env.APP_USERNAME = username;
  process.env.APP_PASSWORD = password;
  return () => {
    if (before.u === undefined) delete process.env.APP_USERNAME; else process.env.APP_USERNAME = before.u;
    if (before.p === undefined) delete process.env.APP_PASSWORD; else process.env.APP_PASSWORD = before.p;
  };
}

export const BASE = 'https://app.example.com';
