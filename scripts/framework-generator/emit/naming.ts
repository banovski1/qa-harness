// The vocabulary every renderer shares: how a name becomes a class, a property, a folder.
import type { AppModel } from '../../model-compiler/model-types.ts';

export const pascal = (s: string): string =>
  s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ')
    .filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join('');

export const camel = (s: string): string => {
  const p = pascal(s);
  return p ? p[0].toLowerCase() + p.slice(1) : '';
};

/**
 * A TypeScript single-quoted string literal for any input.
 *
 * Escaping the backslash and the quote is not enough. A label read off a rendered
 * tooltip can carry real newlines, and a literal newline inside '…' is a syntax error —
 * so one such label made its whole page object unparseable. The generator runs once,
 * which makes a file it cannot parse rather more than a warning to fix later.
 */
export const q = (s: string): string =>
  `'${String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')}'`;

/** The module folder a screen lives in: its first real path segment. */
export function moduleOf(path: string): string {
  const seg = path.split('/').filter(s => s && !/^[:{]/.test(s))[0] ?? 'home';
  return camel(seg) || 'home';
}

/**
 * Provenance, not a warning. The old header said "rewritten on every run" because it
 * was; this one says where the file came from, because it is now yours.
 */
export const header = (model: AppModel): string =>
  `// Generated once from analysis.json (${model.app.repoCommit.slice(0, 10)}) on ` +
  `${model.app.generatedAt.slice(0, 10)}.\n` +
  `// This file is yours now. Nothing regenerates it.\n`;
