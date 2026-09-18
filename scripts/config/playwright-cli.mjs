/**
 * How to invoke `playwright-cli` as a child process.
 *
 * On POSIX the name on PATH is an executable and `execFile` runs it. On Windows a
 * global npm install puts a `.cmd` batch shim there instead, which `execFile` cannot
 * execute at all: the bare name is ENOENT and the `.cmd` is EINVAL. Running it through
 * a shell would fix that and introduce a worse bug, because the arguments carry
 * absolute paths and this project lives under "C:\Users\<name with a space>\".
 *
 * So resolve the shim to the script it wraps and run that with this same Node binary.
 * No shell, no quoting, and the arguments arrive exactly as written.
 */
import { existsSync, readFileSync } from 'node:fs';
import { delimiter, join } from 'node:path';

/** The `.cmd` shim npm writes names the .js file it runs; read it back out. */
function scriptFromShim(shimPath) {
  let text;
  try { text = readFileSync(shimPath, 'utf8'); } catch { return null; }
  const match = text.match(/"%dp0%\\([^"]+\.js)"/i) ?? text.match(/([^"\s]+playwright-cli\.js)/i);
  if (!match) return null;
  const resolved = join(shimPath, '..', match[1].replace(/\//g, '\\'));
  return existsSync(resolved) ? resolved : null;
}

function findOnPath(name) {
  for (const dir of (process.env.PATH ?? '').split(delimiter)) {
    if (!dir) continue;
    const candidate = join(dir, name);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

let cached = null;

/**
 * `{ command, prefixArgs }` — spawn `command` with `[...prefixArgs, ...yourArgs]`.
 * Falls back to the bare name when nothing better can be resolved, so a machine this
 * function does not understand fails the same way it did before rather than differently.
 */
export function playwrightCliCommand() {
  if (cached) return cached;

  if (process.platform !== 'win32') {
    cached = { command: 'playwright-cli', prefixArgs: [] };
    return cached;
  }

  const shim = findOnPath('playwright-cli.cmd');
  const script = shim ? scriptFromShim(shim) : null;
  cached = script
    ? { command: process.execPath, prefixArgs: [script] }
    : { command: 'playwright-cli', prefixArgs: [] };
  return cached;
}

/** The same thing as one array, for callers that just want to spread it. */
export function playwrightCliArgv(args = []) {
  const { command, prefixArgs } = playwrightCliCommand();
  return [command, [...prefixArgs, ...args]];
}
