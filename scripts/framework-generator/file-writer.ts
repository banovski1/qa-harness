// Write policy. The one rule: generated code is disposable, your code is not.
//
// Every emitted file is tagged `generated` or `protected`. Generated files are
// rewritten on every run, so re-running after a fresh crawl always picks up new
// locators. Protected files are written once and then never touched again, so
// the subclass where you put real test logic survives regeneration. Nothing is
// ever deleted.

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { GeneratedFile } from './types.js';

/** @typedef {{ path: string, contents: string, kind: 'generated'|'protected' }} EmittedFile */

export class FileWriter {
  outputDir: string;
  dryRun: boolean;
  written: number;
  unchanged: number;
  preserved: number;
  planned: { path: string; action: 'preserve' | 'unchanged' | 'overwrite' | 'create' | 'dir' }[];

  constructor(outputDir: string, { dryRun = false } = {}) {
    this.outputDir = outputDir;
    this.dryRun = dryRun;
    this.written = 0;
    this.unchanged = 0;
    this.preserved = 0;
    this.planned = [];
  }

  /** Apply the write policy to one file. `file.path` is relative to outputDir. */
  write(file: GeneratedFile): void {
    const target = join(this.outputDir, file.path);
    const exists = existsSync(target);

    if (file.kind === 'protected' && exists) {
      this.preserved += 1;
      this.planned.push({ path: file.path, action: 'preserve' });
      return;
    }
    if (exists && readFileSync(target, 'utf8') === file.contents) {
      this.unchanged += 1;
      this.planned.push({ path: file.path, action: 'unchanged' });
      return;
    }

    this.planned.push({ path: file.path, action: exists ? 'overwrite' : 'create' });
    this.written += 1;
    if (this.dryRun) return;
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.contents, 'utf8');
  }

  /** Create a directory that would otherwise stay empty (e.g. src/api/clients). */
  ensureDir(relative: string): void {
    this.planned.push({ path: `${relative}/`, action: 'dir' });
    if (this.dryRun) return;
    mkdirSync(join(this.outputDir, relative), { recursive: true });
  }

  summary() {
    return `${this.written} written, ${this.unchanged} unchanged, ${this.preserved} preserved`;
  }
}
