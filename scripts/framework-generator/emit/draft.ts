// Render the draft, and record that a human read it.
//
// The approval is a file rather than a flag someone remembers passing, and it holds a
// hash rather than a timestamp: recompiling the analysis changes the draft, which
// expires the approval on its own. Nobody has to notice.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { ROOT } from '../../config/profile.mjs';
import { renderDraft } from './draft-render.ts';
import { modelFromAnalysis } from './emit.ts';

export const DRAFT_PATH = join(ROOT, 'framework-draft.md');
export const LOCK_PATH = join(ROOT, '.framework-draft.lock');

export interface DraftLock {
  hash: string;
  approvedAt: string;
  repoCommit: string;
}

export function hashDraft(markdown: string): string {
  return createHash('sha256').update(markdown, 'utf8').digest('hex');
}

export function writeDraft(markdown: string): void {
  writeFileSync(DRAFT_PATH, markdown, 'utf8');
}

export function approve(markdown: string, repoCommit: string, lockPath: string = LOCK_PATH): void {
  const lock: DraftLock = { hash: hashDraft(markdown), approvedAt: new Date().toISOString(), repoCommit };
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
}

export function readLock(lockPath: string = LOCK_PATH): DraftLock | null {
  if (!existsSync(lockPath)) return null;
  try {
    return JSON.parse(readFileSync(lockPath, 'utf8')) as DraftLock;
  } catch {
    return null;
  }
}

/** The draft as it would be rendered right now, from the analysis on disk. */
export function currentDraft(): { markdown: string; repoCommit: string } {
  const model = modelFromAnalysis();
  const analysis = JSON.parse(readFileSync(join(ROOT, 'analysis.json'), 'utf8'));
  return { markdown: renderDraft(model, analysis.conventions), repoCommit: model.app.repoCommit };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { markdown, repoCommit } = currentDraft();
  writeDraft(markdown);
  if (process.argv.includes('--approve')) {
    approve(markdown, repoCommit);
    console.log(
      `Approved. ${DRAFT_PATH.replace(ROOT + '/', '')} is the framework that will be built.\n` +
      `  Next: npm run generate  (it runs once, and only once)`,
    );
  } else {
    const lines = markdown.split('\n').length;
    console.log(
      `Wrote framework-draft.md (${lines} lines).\n` +
      `  Read it. If it is the right foundation: npm run draft -- --approve`,
    );
  }
}
