// The second refusal. The first is assertOutputEmpty, in file-writer.ts.
//
// Three things have to agree: the draft on disk, the lock's hash of it, and the draft
// the current analysis would produce. Any disagreement means the human approved
// something other than what is about to be built.
import { existsSync, readFileSync } from 'node:fs';
import { hashDraft } from './draft.ts';

const REVIEW = 'Review framework-draft.md, then: npm run draft -- --approve';

export function assertDraftApproved(
  { draftPath, lockPath, current }: { draftPath: string; lockPath: string; current: string },
): void {
  if (!existsSync(draftPath)) {
    throw new Error(`There is no framework-draft.md.\n  Run: npm run draft\n  Then: ${REVIEW}`);
  }
  const onDisk = readFileSync(draftPath, 'utf8');
  if (!existsSync(lockPath)) {
    throw new Error(`The draft has not been approved.\n  ${REVIEW}`);
  }
  let lock: { hash?: string };
  try {
    lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  } catch {
    throw new Error(`The approval lock is unreadable.\n  ${REVIEW}`);
  }
  if (lock.hash !== hashDraft(onDisk)) {
    throw new Error(`framework-draft.md has changed since it was approved.\n  ${REVIEW}`);
  }
  if (onDisk !== current) {
    throw new Error(
      `The draft has not been approved (the analysis changed since it was).\n  ${REVIEW}`,
    );
  }
}
