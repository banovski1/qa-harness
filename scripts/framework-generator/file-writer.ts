// Write policy. There is one rule, and it is the whole file: the generator runs once,
// into a directory that holds nothing yet.
//
// Every file used to carry a `generated` or `protected` tag so that a second run could
// rewrite the first kind and spare the second. There is no second run — the framework is
// maintained after this, by hand and by agents — so the tag protected nothing and the
// preserve branch was dead weight. What replaces it is a refusal at the door.

import { existsSync, mkdirSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { GeneratedFile } from './types.ts';

/** Output a run leaves behind, which says nothing about whether a framework exists. */
const RUN_OUTPUT = new Set(['node_modules', 'test-results', 'playwright-report', '.auth', '.git']);

/**
 * The first gate. A framework that exists is someone's work — possibly weeks of it —
 * and nothing here is clever enough to merge into it.
 */
export function assertOutputEmpty(outputDir: string): void {
  if (!existsSync(outputDir)) return;
  const remaining = readdirSync(outputDir).filter(entry => !RUN_OUTPUT.has(entry));
  if (!remaining.length) return;
  throw new Error(
    `There is already a generated framework at ${outputDir}.\n` +
    `  The generator runs once. It will not overwrite work that exists.\n` +
    `  To regenerate from scratch, remove the directory first.`,
  );
}

export class FileWriter {
  readonly outputDir: string;
  readonly dryRun: boolean;
  written = 0;
  readonly planned: { path: string; action: 'create' | 'dir' }[] = [];

  constructor(outputDir: string, { dryRun = false } = {}) {
    this.outputDir = outputDir;
    this.dryRun = dryRun;
  }

  write(file: GeneratedFile): void {
    this.planned.push({ path: file.path, action: 'create' });
    this.written += 1;
    if (this.dryRun) return;
    const target = join(this.outputDir, file.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.contents, 'utf8');
  }

  /** Create a directory that would otherwise stay empty (e.g. tests/e2e). */
  ensureDir(relative: string): void {
    this.planned.push({ path: `${relative}/`, action: 'dir' });
    if (this.dryRun) return;
    mkdirSync(join(this.outputDir, relative), { recursive: true });
  }

  summary(): string {
    return `${this.written} written`;
  }
}
