#!/usr/bin/env -S npx tsx
/**
 * Turn one `playwright-cli` recording session into the two files a recording is.
 *
 *   npx tsx scripts/analysis/build-session-doc.ts \
 *     --flow apply-leave \
 *     --code .playwright-cli/recording.ts \
 *     --requests .playwright-cli/requests.json
 *
 * `--code` is whatever `playwright-cli recording-stop` printed. `--requests` is whatever
 * `playwright-cli --json requests` printed in the same session — which is why this repo
 * needs no HAR and no trace: the actions and the traffic come out of one browser, in one
 * order, and pairing them is a matter of reading two files rather than instrumenting a
 * third.
 *
 * It writes, beside each other, under `recordings/`:
 *
 *   <flow>-<timestamp>.md      what a human reads to see what the recording showed
 *   <flow>-<timestamp>.json    what `ingest-recording.ts` reads
 *
 * Both are committed. A derivation whose input is not in the repo cannot be re-run, and
 * the analysis is derived from these.
 *
 * Credentials are redacted here and nowhere later: this is the only point at which the
 * password the human typed is in hand, and a recording is not a place to keep one.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './analysis-file.ts';
import { classify } from './locator-rung.ts';
// @ts-ignore -- the small .env reader the whole pipeline shares
import { loadEnv } from '../config/profile.mjs';

interface Step {
  action: string;
  rawLocator: string | null;
  value: string | null;
  screenPath: string | null;
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/** `YYYYMMDD-HHmmss` in local time — the half of a filename that keeps recordings apart. */
function stamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-` +
         `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

/**
 * Read the actions out of the Playwright code a recording emitted.
 *
 * The generated code is a sequence of `await page.<locator>.<action>(<args>)` lines and
 * `await page.goto(...)`. Parsing it with a regex is the right size of tool: the input is
 * machine-generated and its shape is fixed, and the alternative — a TypeScript parser —
 * would buy nothing but a dependency.
 */
export function parseActions(code: string): Step[] {
  const steps: Step[] = [];
  const line = /await\s+page\s*(?:\.(goto)\(\s*(['"`])(.*?)\2\s*\)|((?:\.\w+\([^;]*?\))+?)\.(click|fill|press|check|uncheck|selectOption|dblclick|hover|setInputFiles)\(([^;]*)\))/g;

  for (const m of code.matchAll(line)) {
    if (m[1] === 'goto') {
      steps.push({ action: 'goto', rawLocator: null, value: m[3], screenPath: null });
      continue;
    }
    const locator = (m[4] ?? '').replace(/^\./, '').trim();
    const method = m[5];
    const args = (m[6] ?? '').trim();
    const literal = args.match(/^(['"`])([\s\S]*?)\1/);

    const action =
      method === 'selectOption' ? 'select'
      : method === 'dblclick' ? 'click'
      : method === 'hover' || method === 'setInputFiles' ? 'other'
      : method;

    steps.push({
      action,
      rawLocator: locator || null,
      value: literal ? literal[2] : null,
      screenPath: null,
    });
  }
  return steps;
}

/**
 * The routes the recording visited, in order, without repeats.
 *
 * A recording that loops back to a screen visited it once as far as the analysis is
 * concerned — the second visit adds no route, only more steps against the same one.
 */
export function routesIn(steps: Step[], baseUrl: string): { path: string; url: string; headings: string[] }[] {
  const seen = new Set<string>();
  const out: { path: string; url: string; headings: string[] }[] = [];
  for (const s of steps) {
    if (s.action !== 'goto' || !s.value) continue;
    let url: URL;
    try { url = new URL(s.value, baseUrl); } catch { continue; }
    if (seen.has(url.pathname)) continue;
    seen.add(url.pathname);
    // The recorder sees no headings — it reads emitted code, not a page. The crawl fills
    // them in, and where it never reached, `merge-recordings` leaves the screen without
    // one and the score says so.
    out.push({ path: url.pathname, url: url.href, headings: [] });
  }
  return out;
}

/**
 * The requests worth keeping, as shapes.
 *
 * Static assets are dropped: a test's precondition is never "fetch the stylesheet", and
 * a recording of a real screen produces dozens of them. What survives is the traffic the
 * app made on the user's behalf.
 */
const ASSET = /\.(css|js|mjs|png|jpe?g|gif|svg|woff2?|ttf|ico|map)(\?|$)/i;

export function requestsIn(raw: unknown[], baseUrl: string) {
  const out: {
    method: string; path: string; status: number; kind: 'xhr' | 'fetch' | 'document';
    requestShape: string[] | null; responseShape: string[] | null;
  }[] = [];
  const seen = new Set<string>();

  for (const item of raw as Record<string, any>[]) {
    const rawUrl = item.url ?? item.request?.url;
    if (!rawUrl) continue;
    let url: URL;
    try { url = new URL(rawUrl, baseUrl); } catch { continue; }
    // A request to somewhere else is somebody else's API, and the analysis describes one
    // application.
    if (url.origin !== new URL(baseUrl).origin) continue;
    if (ASSET.test(url.pathname)) continue;

    const method = String(item.method ?? item.request?.method ?? 'GET').toUpperCase();
    const key = `${method} ${url.pathname}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const type = String(item.resourceType ?? item.type ?? '').toLowerCase();
    const kind = type === 'document' ? 'document' : type === 'fetch' ? 'fetch' : 'xhr';

    out.push({
      method,
      path: url.pathname,
      status: Number(item.status ?? item.response?.status ?? 0),
      kind,
      requestShape: shapeOf(item.postData ?? item.request?.postData),
      responseShape: shapeOf(item.responseBody ?? item.response?.body),
    });
  }
  return out;
}

/** The keys of a JSON body, and nothing else. A shape is reusable; a value is personal. */
function shapeOf(body: unknown): string[] | null {
  if (!body) return null;
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body;
    const target = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!target || typeof target !== 'object') return null;
    return Object.keys(target as Record<string, unknown>).sort();
  } catch {
    return null;
  }
}

/**
 * Replace the credentials the human typed with the names of the variables holding them.
 *
 * These files are committed. A login flow records the password in clear, and no amount of
 * "we will remember to strip it" survives the fiftieth recording.
 */
export function redact(text: string, env: Record<string, string>): string {
  let out = text;
  for (const key of ['APP_PASSWORD', 'APP_USERNAME'] as const) {
    const value = env[key];
    // A one-character credential would turn every occurrence of that character into the
    // placeholder. Short secrets are a different problem; mangling the file is not a fix.
    if (!value || value.length < 3) continue;
    out = out.split(value).join(`«${key}»`);
  }
  return out;
}

function main(): void {
  const flow = arg('--flow');
  const codePath = arg('--code');
  const requestsPath = arg('--requests');

  if (!flow || !codePath) {
    console.error('usage: build-session-doc.ts --flow <slug> --code <file> [--requests <file>]');
    console.error('  --code      what `playwright-cli recording-stop` printed');
    console.error('  --requests  what `playwright-cli --json requests` printed, same session');
    process.exit(2);
  }
  if (!existsSync(codePath)) {
    console.error(`${codePath} does not exist — did the recording produce anything?`);
    process.exit(1);
  }

  const env = loadEnv() as Record<string, string>;
  const baseUrl = env.APP_BASE_URL;
  if (!baseUrl) {
    console.error('APP_BASE_URL is not set. Copy .env.example to .env and fill it in.');
    process.exit(1);
  }

  const code = readFileSync(codePath, 'utf8');
  const steps = parseActions(code);
  if (!steps.length) {
    console.error(`${codePath} contains no recorded actions.`);
    console.error('The window was probably closed before anything was clicked. Nothing was written.');
    process.exit(1);
  }

  let rawRequests: unknown[] = [];
  if (requestsPath && existsSync(requestsPath)) {
    try {
      const parsed = JSON.parse(readFileSync(requestsPath, 'utf8'));
      rawRequests = Array.isArray(parsed) ? parsed : (parsed.requests ?? parsed.result ?? []);
    } catch {
      // Losing the traffic costs the api half of the recording and nothing else. It is
      // not worth throwing away the steps over.
      console.error(`warning: ${requestsPath} is not readable JSON — continuing without network evidence`);
    }
  }

  const now = new Date();
  const slug = `${flow}-${stamp(now)}`;
  const dir = join(ROOT, 'recordings');
  mkdirSync(dir, { recursive: true });

  const doc = {
    flow,
    recordedAt: now.toISOString(),
    file: `recordings/${slug}.md`,
    baseUrl,
    steps: steps.map(s => ({ ...s, value: s.value ? redact(s.value, env) : null })),
    routes: routesIn(steps, baseUrl),
    requests: requestsIn(rawRequests, baseUrl),
  };

  writeFileSync(join(dir, `${slug}.json`), `${JSON.stringify(doc, null, 2)}\n`);
  writeFileSync(join(dir, `${slug}.md`), markdown(doc, redact(code, env)));

  const unstable = doc.steps.filter(s => s.rawLocator && !classify(s.rawLocator).stable).length;
  console.log(`recordings/${slug}.md   ${doc.steps.length} step(s), ${unstable} unstable`);
  console.log(`recordings/${slug}.json  ${doc.routes.length} route(s), ${doc.requests.length} request(s)`);
  console.log(`\nnext: npm run record:ingest -- recordings/${slug}.json`);
}

/** The human-readable half. Never edited afterwards — it is a record of what happened. */
function markdown(doc: ReturnType<typeof Object> & Record<string, any>, code: string): string {
  const lines: string[] = [];
  lines.push(`# Recording: ${doc.flow}`, '');
  lines.push(`- Base URL: ${doc.baseUrl}`);
  lines.push(`- Recorded: ${doc.recordedAt}`);
  lines.push('- Credentials are redacted to «APP_USERNAME» / «APP_PASSWORD».', '');

  lines.push('## Steps', '');
  doc.steps.forEach((s: Step, i: number) => {
    if (s.action === 'goto') {
      lines.push(`${i + 1}. **goto** \`${s.value}\``);
      return;
    }
    const { rung, stable, reason } = classify(s.rawLocator);
    const value = s.value ? ` = \`"${s.value}"\`` : '';
    const mark = stable ? `rung ${rung}, ${reason}` : `⚠ UNSTABLE (rung ${rung}, ${reason})`;
    lines.push(`${i + 1}. **${s.action}** \`${s.rawLocator}\`${value} — ${mark}`);
  });
  lines.push('');

  if (doc.routes.length) {
    lines.push('## Routes visited', '');
    for (const r of doc.routes) lines.push(`- \`${r.path}\``);
    lines.push('');
  }

  if (doc.requests.length) {
    lines.push('## Requests the flow provoked', '');
    lines.push('Shapes, not values — the keys a precondition would have to supply.', '');
    lines.push('| method | path | status | request shape |');
    lines.push('| --- | --- | --- | --- |');
    for (const r of doc.requests) {
      lines.push(`| ${r.method} | \`${r.path}\` | ${r.status} | ${r.requestShape?.join(', ') ?? '—'} |`);
    }
    lines.push('');
  }

  lines.push('## Raw recording', '');
  lines.push('<details>', '<summary>playwright-cli recording-stop output, unedited</summary>', '');
  lines.push('```typescript', code.trim(), '```', '', '</details>', '');
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
