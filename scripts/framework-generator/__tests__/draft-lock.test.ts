import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashDraft } from '../emit/draft.ts';

test('the hash is of the content, so recompiling expires the approval', () => {
  const a = hashDraft('# demoapp\n\nscreens: 3\n');
  const b = hashDraft('# demoapp\n\nscreens: 4\n');
  assert.equal(a, hashDraft('# demoapp\n\nscreens: 3\n'));
  assert.notEqual(a, b);
  assert.match(a, /^[0-9a-f]{64}$/);
});
