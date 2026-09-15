/**
 * Turn "what the application sent" into "what a bare HTTP client must send".
 *
 * Harvesting cookies and storage yields the *material*. It does not say how the app
 * presents it, and that is where this pattern normally breaks:
 *
 *   - a cookie session: the cookies alone are enough;
 *   - a bearer token in localStorage: you hold the token, but nothing in the storage
 *     says it goes out as `Authorization: Bearer <it>`;
 *   - double-submit CSRF (Angular, Laravel, Django, Rails): the app's own JavaScript
 *     copies an `XSRF-TOKEN` cookie into an `X-XSRF-TOKEN` *header* on every mutating
 *     request. Replay the cookie alone and every POST answers 403, which reads as a
 *     permissions problem and is not one.
 *
 * So the rule is derived from a request the application itself made, by matching
 * header *values* against stored values. Matching on value rather than on key name is
 * the whole point: a name list ("token", "access_token", "jwt") is a guess, and a guess
 * presented as a fact is what this pipeline exists to stop making.
 */
import type { ReplayRule, ReplaySource } from './types.ts';

/**
 * Headers any browser sends on its own. None of them carries the credential, and
 * `cookie` is handled by the jar rather than by a replay rule.
 */
const BROWSER_DEFAULT = [
  'accept', 'accept-encoding', 'accept-language', 'cache-control', 'connection',
  'content-length', 'content-type', 'cookie', 'dnt', 'host', 'origin', 'pragma',
  'referer', 'te', 'upgrade-insecure-requests', 'user-agent',
];

const isBrowserDefault = (name: string): boolean => {
  const lower = name.toLowerCase();
  return BROWSER_DEFAULT.includes(lower) || lower.startsWith('sec-');
};

export interface Harvest {
  /** Request headers observed on a request the application itself issued. */
  headers: Record<string, string>;
  cookies: Record<string, string>;
  localStorage?: Record<string, string>;
  sessionStorage?: Record<string, string>;
}

/** Every stored value, tagged with where it came from. Longest first, so that a */
/** token is preferred over a one-character value that happens to appear inside it. */
function storedValues(harvest: Harvest): { from: ReplaySource['from']; key: string; value: string }[] {
  const entries: { from: ReplaySource['from']; key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(harvest.cookies ?? {})) {
    entries.push({ from: 'cookie', key, value });
  }
  for (const [key, value] of Object.entries(harvest.localStorage ?? {})) {
    entries.push({ from: 'localStorage', key, value });
  }
  for (const [key, value] of Object.entries(harvest.sessionStorage ?? {})) {
    entries.push({ from: 'sessionStorage', key, value });
  }
  return entries.filter(e => e.value && e.value.length >= 8).sort((a, b) => b.value.length - a.value.length);
}

/**
 * Match one header value against stored values.
 *
 * An exact match needs no template. A contained match yields one, with `{}` standing
 * where the stored value sat — `Bearer eyJ…` becomes `Bearer {}`.
 */
function sourceFor(
  headerValue: string,
  stored: ReturnType<typeof storedValues>,
): ReplaySource | null {
  for (const entry of stored) {
    if (headerValue === entry.value) {
      return { from: entry.from, key: entry.key };
    }
  }
  for (const entry of stored) {
    const at = headerValue.indexOf(entry.value);
    if (at === -1) continue;
    const template = headerValue.slice(0, at) + '{}' + headerValue.slice(at + entry.value.length);
    return { from: entry.from, key: entry.key, template };
  }
  return null;
}

/**
 * The replay rule for one observed request.
 *
 * A header whose value matches nothing in storage is reported as underivable and
 * never emitted: a literal credential in generated code is a committed secret.
 */
export function deriveReplay(harvest: Harvest): ReplayRule {
  const stored = storedValues(harvest);
  const headers: Record<string, ReplaySource> = {};
  const underivable: string[] = [];

  for (const [name, value] of Object.entries(harvest.headers ?? {})) {
    if (isBrowserDefault(name) || !value) continue;
    const source = sourceFor(value, stored);
    if (source) headers[name] = source;
    else underivable.push(name);
  }

  const rule: ReplayRule = {
    cookies: Object.keys(harvest.cookies ?? {}).length > 0,
    headers,
  };
  if (underivable.length) rule.underivable = underivable;
  return rule;
}

/** One sentence for the verdict, so a degraded rule is never silently degraded. */
export function describeReplay(rule: ReplayRule): string {
  const parts: string[] = [];
  parts.push(rule.cookies ? 'cookies' : 'no cookies');
  const names = Object.keys(rule.headers);
  if (names.length) parts.push(`headers ${names.join(', ')}`);
  if (rule.underivable?.length) parts.push(`${rule.underivable.join(', ')} could not be traced to storage`);
  return parts.join('; ');
}
