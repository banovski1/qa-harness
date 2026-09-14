import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { hashDraft, approve, readLock } from '../emit/draft.ts';

test('the hash is of the content, so recompiling expires the approval', () => {
  const a = hashDraft('# demoapp\n\nscreens: 3\n');
  const b = hashDraft('# demoapp\n\nscreens: 4\n');
  assert.equal(a, hashDraft('# demoapp\n\nscreens: 3\n'));
  assert.notEqual(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
});

test('approve then readLock round-trips the hash and the repoCommit', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lock-'));
  const lockPath = join(dir, '.framework-draft.lock');
  const markdown = '# demoapp\n\nscreens: 3\n';
  approve(markdown, 'abc123', lockPath);
  const lock = readLock(lockPath);
  assert.ok(lock);
  assert.equal(lock!.hash, hashDraft(markdown));
  assert.equal(lock!.repoCommit, 'abc123');
});

test('a lock file that is not JSON makes readLock return null, not throw', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lock-'));
  const lockPath = join(dir, '.framework-draft.lock');
  writeFileSync(lockPath, 'not json at all', 'utf8');
  assert.equal(readLock(lockPath), null);
});
