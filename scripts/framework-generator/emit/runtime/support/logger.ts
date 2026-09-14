// What every component says about itself, on every interaction — not only the failures.
//
// The failure path was already articulate: classify() explains NOT_FOUND versus
// AMBIGUOUS with the evidence that separates them. The success path said nothing at
// all, so neither a reviewer nor an agent could see *how* a control was addressed
// unless addressing it broke. One record per interaction closes that gap, and makes
// the failures a subset of one channel rather than a second one.
//
// Two channels, one pino instance. `pino.transport` runs its target in a worker
// thread, and a worker-thread pretty-printer racing a synchronous file destination at
// process exit is a known source of lost lines and hangs in a short-lived CLI process
// like a test run. `pino-pretty` used directly — not through `pino.transport` — is a
// plain synchronous stream, so both channels here write in-process with no worker and
// nothing to flush on exit.
import pino from 'pino';
import pinoPretty from 'pino-pretty';

export interface ComponentLog {
  /** The class that acted: TextField, RecordTable, NavigationBar. */
  component: string;
  /** Its kind in the model: field, region, collection. */
  kind?: string;
  screen: string;
  /** The property name the page object gave it. */
  as: string;
  /** The English identity used to find it. */
  handle: string;
  via?: 'accessible' | 'proximity';
  /** How that identity became a locator: role+name, proximity, field-template, css. */
  strategy?: string;
  selector?: string;
  /** Only at debug level: counting costs a round trip. */
  matches?: number;
  action: string;
  arg?: string;
  /** 'ok', or the classification: NOT_FOUND, AMBIGUOUS, HIDDEN, DISABLED, … */
  outcome: string;
  ms: number;
  modelPath: string;
}

const SECRET = /password|secret|token|api[-_ ]?key|passphrase/i;

/**
 * Redaction keys off the handle, never the value: the control is known to be a password
 * field before anything is typed into it, so there is no window in which a secret is
 * logged because a heuristic had not fired yet.
 */
export function redact(handle: string, value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (SECRET.test(handle)) return '[redacted]';
  return String(value);
}

const level = process.env.LOG_LEVEL ?? 'info';
const pretty = !process.env.CI && process.env.LOG_FORMAT !== 'json';

const stdoutStream = pretty
  ? pinoPretty({ colorize: true, ignore: 'pid,hostname', destination: 1 })
  : pino.destination({ dest: 1, sync: true });

// The agent-readable channel. One JSON object per interaction, append-only.
//
// Built at module load time, so importing this file — directly, or transitively via
// BaseComponent.ts — creates test-results/ as a side effect, in whatever directory the
// importing process's cwd is. Harmless (gitignored) but worth knowing: a repo-level
// test that imports BaseComponent.ts now writes this at the repo root, not only inside
// a generated project.
const fileStream = pino.destination({ dest: 'test-results/framework.log.jsonl', mkdir: true, sync: false });

export const rootLogger = pino(
  { level: 'debug', base: undefined, timestamp: pino.stdTimeFunctions.isoTime },
  pino.multistream([
    { level, stream: stdoutStream },
    { level: 'debug', stream: fileStream },
  ]),
);

/**
 * `base` is the seam a test uses to capture what a component logs, without the module's
 * own file/stdout streams: pass a pino instance backed by an in-memory stream and every
 * `component.act()` bound off it lands there instead.
 */
export function componentLogger(bindings: Record<string, unknown>, base: pino.Logger = rootLogger) {
  return base.child(bindings);
}
