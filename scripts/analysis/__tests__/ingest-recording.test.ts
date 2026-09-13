import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalise } from '../ingest-recording.ts';

test('a step inherits the route of the most recent navigation', () => {
  // The recorder does not know which screen a step ran against — a click is recorded the
  // moment it happens, and the page it happened on is whatever the last goto reached.
  const rec = normalise({
    flow: 'f', recordedAt: 't', file: 'recordings/f.md',
    steps: [
      { action: 'goto', value: 'https://app.test/pim/addEmployee' },
      { action: 'fill', rawLocator: "getByLabel('First Name')", value: 'Ada' },
      { action: 'click', rawLocator: "getByRole('button', { name: 'Save' })" },
    ],
  });

  assert.deepEqual(rec.steps.map(s => s.screenPath), [
    '/pim/addEmployee', '/pim/addEmployee', '/pim/addEmployee',
  ]);
});

test('every step is stamped with its rung at ingest time', () => {
  const rec = normalise({
    flow: 'f', recordedAt: 't', file: 'recordings/f.md',
    steps: [
      { action: 'click', rawLocator: "getByRole('button', { name: 'Save' })" },
      { action: 'click', rawLocator: '.oxd-table tr:nth-child(3) button' },
      { action: 'click', rawLocator: "getByRole('row').nth(2)" },
    ],
  });

  assert.equal(rec.steps[0].rung, 2, 'role with an accessible name');
  assert.equal(rec.steps[1].rung, 7, 'positional beats raw CSS — the index is what breaks');
  assert.equal(rec.steps[2].rung, 7, 'a perfect role locator wrapped around an index');
});

test('an action the recorder does not name is kept, not dropped', () => {
  // A step nobody can classify is still a step that happened, and dropping it would make
  // the recording read as though the flow were shorter than it was.
  const rec = normalise({
    flow: 'f', recordedAt: 't', file: 'recordings/f.md',
    steps: [{ action: 'dragAndDrop' as never, rawLocator: "getByRole('listitem')" }],
  });
  assert.equal(rec.steps.length, 1);
  assert.equal(rec.steps[0].action, 'other');
});

test('a request with no path is not an observation of anything', () => {
  const rec = normalise({
    flow: 'f', recordedAt: 't', file: 'recordings/f.md',
    steps: [{ action: 'goto', value: '/x' }],
    requests: [
      { method: 'post', path: '/api/v2/employees', status: 200, kind: 'xhr' },
      { method: 'GET', status: 204, kind: 'xhr' },
    ],
  });
  assert.equal(rec.requests.length, 1);
  assert.equal(rec.requests[0].method, 'POST', 'the method is normalised to upper case');
});

test('a relative goto still resolves to a path', () => {
  const rec = normalise({
    flow: 'f', recordedAt: 't', file: 'recordings/f.md',
    steps: [{ action: 'goto', value: '/leave/applyLeave' }, { action: 'click', rawLocator: "getByRole('button', { name: 'Apply' })" }],
  });
  assert.equal(rec.steps[1].screenPath, '/leave/applyLeave');
});
