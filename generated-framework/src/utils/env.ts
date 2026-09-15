// Configuration comes from the root .env, the same file the analysis pipeline reads.
//
// There is deliberately no fallback. `process.env.APP_USERNAME ?? ''` turns a missing
// credential into a valid-looking empty string, and the login then fails thirty seconds
// later as an assertion timeout that names nothing. Failing here names the variable.
import { existsSync, readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

// src/utils/env.ts → up three is the directory above the generated project: the repo root.
const envFile = new URL('../../../.env', import.meta.url);

const values: Record<string, string | undefined> = {
  ...(existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {}),
  ...process.env,
};

/** The value, or an error naming what to set. Never an empty string. */
export function requiredEnv(name: string): string {
  const value = values[name];
  if (!value) throw new Error(`Set ${name} in the root .env or in the process environment`);
  return value;
}

/** For genuinely optional settings. Callers must handle undefined themselves. */
export function optionalEnv(name: string): string | undefined {
  return values[name] || undefined;
}
