import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreScreen, verdictFor, computeTestability, UNCRAWLED } from '../../analysis/testability.ts';
import { SECTIONS, SECTION_OWNER } from '../../analysis/analysis-types.ts';

const screen = (controls: any[], over: Record<string, unknown> = {}) => ({
  path: '/x', url: 'https://a/x', title: 'X',
  headings: [{ level: 1, text: 'X', y: 0 }], tables: [], controls, links: [], ...over,
}) as any;

const named = (matches = 1) => ({ name: 'Field', matches } as any);

test('a screen whose every control is addressable is one to write against', () => {
  const s = scoreScreen(screen([named(), named(), named()]), false);
  assert.equal(verdictFor(s.confidence), 'write');
  assert.equal(s.unaddressable, 0);
});

test('a control matching two elements lowers the score and is named in missing', () => {
  const s = scoreScreen(screen([named(), named(2), named(2)]), false);
  assert.equal(verdictFor(s.confidence), 'record-first');
  assert.ok(s.missing.some(m => m.includes('cannot be addressed')));
});

test('a screen with no control at all is unknown, not perfect', () => {
  const s = scoreScreen(screen([]), false);
  assert.equal(s.confidence, 0);
  assert.equal(verdictFor(s.confidence), 'unknown');
});

test('a recording lifts a screen a crawl could not settle', () => {
  const controls = [named(), named(2), named(2)];
  const without = scoreScreen(screen(controls), false);
  const with_ = scoreScreen(screen(controls), true);
  assert.ok(with_.confidence > without.confidence);
  assert.equal(with_.recorded, true);
});

test('a declared route the crawl never reached scores zero and says so', () => {
  const t = computeTestability({ screens: [] } as any, ['/never'], []);
  assert.deepEqual(t.screens['/never'], UNCRAWLED);
  assert.match(t.screens['/never'].missing[0], /never reached/);
});

test('a recording is matched to the screens it covers, not to all of them', () => {
  const analysis = { screens: [screen([named(2)], { path: '/a' }), screen([named(2)], { path: '/b' })] } as any;
  const t = computeTestability(analysis, [], [
    { flow: 'apply', path: 'codegen-recordings/apply.md', recordedAt: '', screens: ['/a'] },
  ]);
  assert.equal(t.screens['/a'].recorded, true);
  assert.equal(t.screens['/b'].recorded, false);
});

test('every section has exactly one owner', () => {
  for (const section of SECTIONS) assert.ok(SECTION_OWNER[section], `${section} has no owner`);
  assert.equal(Object.keys(SECTION_OWNER).length, SECTIONS.length);
});
