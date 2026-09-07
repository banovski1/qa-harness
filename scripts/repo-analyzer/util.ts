// Shared plumbing for the four analyzers: argument parsing, filesystem walking and
// the small helpers every report needs. Nothing here knows about a framework.

import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadProjectConfig} from '../project-config.js';
import type {CliArgs} from './types.js';

interface WalkOptions {maxDepth?: number; skip?: Set<string>}

export const REPO_ROOT = path.resolve(fileURLToPath(import.meta.url), '../../..');

// Directories that never hold source worth parsing. Skipping them at walk time is what
// keeps a scan of a repo the size of OrangeHRM in the seconds rather than the minutes.
export const SKIP_DIRS = new Set([
  'node_modules', 'vendor', 'dist', 'build', '.git', '.svn', 'coverage',
  '.next', '.nuxt', '.svelte-kit', '.venv', 'venv', '__pycache__', 'target', 'bin', 'obj',
]);

export function parseArgs(argv: string[] = process.argv.slice(2)): CliArgs {
  const args: Record<string, string | boolean | string[] | Set<string>> & {_: string[]; flags: Set<string>} = {_: [], flags: new Set()};
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args._.push(token);
      continue;
    }
    const eq = token.indexOf('=');
    const key = (eq === -1 ? token.slice(2) : token.slice(2, eq)).replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
    if (eq !== -1) {
      args[key] = token.slice(eq + 1);
    } else if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      args[key] = argv[++i];
    } else {
      args[key] = true;
      args.flags.add(key);
    }
  }
  return args;
}

export function resolveAppPath(value: string | undefined, options: {configPath?: string} = {}) {
  const configured = value ? null : loadProjectConfig(options.configPath).appPath;
  if (!value && !configured) {
    throw new Error('An application path is required: set appPath: in app-config.yaml or pass --app <path to the cloned app repo>');
  }
  const abs = path.resolve(REPO_ROOT, String(value ?? configured));
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    throw new Error(`Not a directory: ${abs}`);
  }
  return abs;
}

/**
 * Breadth-first walk yielding file paths, bounded by depth so a deep monorepo cannot
 * stall the scan. Directory order is sorted, which is what makes every report stable
 * enough to diff between runs.
 */
export function* walkFiles(root: string, {maxDepth = Infinity, skip = SKIP_DIRS}: WalkOptions = {}): Generator<string> {
  const queue: [string, number][] = [[root, 0]];
  while (queue.length > 0) {
    const [dir, depth] = queue.shift()!;
    let entries;
    try {
      entries = fs.readdirSync(dir, {withFileTypes: true});
    } catch {
      continue;
    }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (skip.has(entry.name) || entry.name.startsWith('.')) continue;
        if (depth < maxDepth) queue.push([full, depth + 1]);
      } else if (entry.isFile()) {
        yield full;
      }
    }
  }
}

export function findFiles(root: string, predicate: (file: string, base: string) => boolean, options: WalkOptions = {}) {
  const found = [];
  for (const file of walkFiles(root, options)) {
    if (predicate(file, path.basename(file))) found.push(file);
  }
  return found.sort();
}

export function readJson<T = Record<string, unknown>>(file: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

export function readText(file: string) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

export function rel(from: string, file: string) {
  return path.relative(from, file).split(path.sep).join('/');
}

/** The app's commit, so a stale analysis file is visible rather than silent. */
export function gitSha(dir: string) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--short', 'HEAD'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'not a git checkout';
  }
}

/** Lazy optional import: a missing parser degrades the analyzer, it does not crash it. */
export async function tryImport(specifier: string) {
  try {
    return await import(specifier);
  } catch {
    return null;
  }
}

// The test-id conventions a project might use. Whichever one a repo actually uses is
// reported back rather than assumed, since a suggestion is only useful if it names the
// real attribute. It lives here rather than in parsers.ts so the element extractor can
// read it without importing the parsers that import the extractor.
export const TEST_ID_ATTRS = ['data-testid', 'data-test-id', 'data-test', 'data-cy', 'data-qa'];

export function isTestIdAttr(name: unknown) {
  return TEST_ID_ATTRS.includes(String(name).toLowerCase());
}

export function unique<T>(values: Iterable<T>): T[] {
  return [...new Set(values)];
}
