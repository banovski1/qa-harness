import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { assertDraftApproved } from '../emit/gates.ts';

const scratch = () => mkdtempSync(join(tmpdir(), 'gate-'));
const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');

test('no lock at all is a refusal that names the command to run', () => {
  const dir = scratch();
  const draftPath = join(dir, 'framework-draft.md');
  writeFileSync(draftPath, '# draft\n');
  assert.throws(
    () => assertDraftApproved({ draftPath, lockPath: join(dir, 'nope.lock'), current: '# draft\n' }),
    /npm run draft -- --approve/,
  );
});

test('a lock from a draft that has since changed is refused', () => {
  const dir = scratch();
  const draftPath = join(dir, 'framework-draft.md');
  const lockPath = join(dir, '.framework-draft.lock');
  writeFileSync(draftPath, '# old draft\n');
  writeFileSync(lockPath, JSON.stringify({ hash: sha('# old draft\n'), approvedAt: '', repoCommit: '' }));
  assert.throws(
    () => assertDraftApproved({ draftPath, lockPath, current: '# new draft\n' }),
    /the analysis changed/i,
  );
});

test('a lock matching a draft that matches the analysis lets the run proceed', () => {
  const dir = scratch();
  const draftPath = join(dir, 'framework-draft.md');
  const lockPath = join(dir, '.framework-draft.lock');
  writeFileSync(draftPath, '# draft\n');
  writeFileSync(lockPath, JSON.stringify({ hash: sha('# draft\n'), approvedAt: '', repoCommit: '' }));
  assert.doesNotThrow(() => assertDraftApproved({ draftPath, lockPath, current: '# draft\n' }));
});
