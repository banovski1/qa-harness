/**
 * A cookie-keeping HTTP client over the platform fetch. Redirects are never
 * followed: a 302 is evidence, and following it hides which request set the cookie.
 */
export class Jar {
  private cookies = new Map<string, string>();

  absorb(response: Response): void {
    const raw = typeof (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie === 'function'
      ? (response.headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
      : [response.headers.get('set-cookie')].filter(Boolean) as string[];
    for (const line of raw) {
      const [pair] = line.split(';');
      const index = pair.indexOf('=');
      if (index > 0) this.cookies.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
    }
  }

  header(): string | undefined {
    if (this.cookies.size === 0) return undefined;
    return [...this.cookies].map(([name, value]) => `${name}=${value}`).join('; ');
  }

  has(name: string): boolean {
    return this.cookies.has(name);
  }

  names(): string[] {
    return [...this.cookies.keys()];
  }
}

export interface Sent {
  status: number;
  headers: Headers;
  body: string;
  json: unknown;
}

export async function send(
  url: string,
  init: RequestInit & { jar?: Jar; timeoutMs?: number } = {},
): Promise<Sent> {
  const { jar, timeoutMs = 15000, ...rest } = init;
  const headers = new Headers(rest.headers ?? {});
  const cookie = jar?.header();
  if (cookie) headers.set('cookie', cookie);
  if (!headers.has('accept')) headers.set('accept', 'application/json, text/html;q=0.9, */*;q=0.8');

  const response = await fetch(url, {
    ...rest,
    headers,
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
  });
  jar?.absorb(response);
  const body = await response.text();
  let json: unknown = null;
  try {
    json = JSON.parse(body);
  } catch {
    /* not JSON — the raw body is the evidence */
  }
  return { status: response.status, headers: response.headers, body, json };
}

function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Find a CSRF token on a login page. A framework rarely puts it where its own
 * form field name suggests: `_token` on the POST may be a `<meta name="csrf-token">`,
 * a `:token` prop on a mounted component, or a key in an inlined JSON blob — and
 * the value may be HTML-entity-encoded and JSON-quoted on top of that. Every
 * spelling is tried before the page is called tokenless.
 */
export function csrfToken(html: string, field: string): string | null {
  const bare = field.replace(/^[_:-]+/, '');
  const aliases = [...new Set([field, bare, `_${bare}`, `csrf-${bare}`, `csrf_${bare}`, 'csrf-token', 'csrfToken'])];

  for (const alias of aliases) {
    const name = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      // <input name="_token" value="…"> in either attribute order
      new RegExp(`name=["']${name}["'][^>]*?\\svalue=["']([^"']*)["']`, 'i'),
      new RegExp(`value=["']([^"']*)["'][^>]*?\\sname=["']${name}["']`, 'i'),
      // <meta name="csrf-token" content="…">
      new RegExp(`name=["']${name}["'][^>]*?\\scontent=["']([^"']*)["']`, 'i'),
      // a plain or framework-bound attribute: token="…" / :token="…" / v-bind:token="…"
      new RegExp(`(?:^|\\s)(?::|v-bind:)?${name}=["']([^"']*)["']`, 'i'),
      // "_token": "…" inside an inlined JSON blob
      new RegExp(`["']${name}["']\\s*:\\s*["']([^"']*)["']`, 'i'),
    ];
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (!match) continue;
      // Entity-decode, then unwrap the quotes a JSON-encoded string leaves behind.
      const value = decodeEntities(match[1]).replace(/^"(.*)"$/s, '$1').trim();
      if (value) return value;
    }
  }
  return null;
}

/** Find a value by key anywhere in a decoded JSON body. */
export function deepFind(value: unknown, key: string): string | null {
  if (value === null || typeof value !== 'object') return null;
  for (const [name, held] of Object.entries(value as Record<string, unknown>)) {
    if (name === key && typeof held === 'string' && held) return held;
    const nested = deepFind(held, key);
    if (nested) return nested;
  }
  return null;
}
