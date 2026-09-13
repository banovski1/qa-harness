import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreScreen, verdictFor, scoreScreens, UNCRAWLED, RECORDED_ONLY } from '../../analysis/testability.ts';
import { SECTIONS, SECTION_OWNER } from '../../analysis/analysis-types.ts';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  const screens: any[] = [{ ...screen([]), path: '/never', crawled: false }];
  scoreScreens(screens, []);
  assert.deepEqual(screens[0].testability, UNCRAWLED);
  assert.match(screens[0].testability.missing[0], /never reached/);
});

test('a recording is matched to the screens it covers, not to all of them', () => {
  const screens: any[] = [screen([named(2)], { path: '/a' }), screen([named(2)], { path: '/b' })];
  scoreScreens(screens, [
    { flow: 'apply', path: 'codegen-recordings/apply.md', recordedAt: '', screens: ['/a'] },
  ]);
  assert.equal(screens[0].testability.recorded, true);
  assert.equal(screens[1].testability.recorded, false);
});

test('every section has exactly one owner', () => {
  for (const section of SECTIONS) assert.ok(SECTION_OWNER[section], `${section} has no owner`);
  assert.equal(Object.keys(SECTION_OWNER).length, SECTIONS.length);
});

test('every writer of analysis.json agrees on the section list', () => {
  // Three files write this artifact and each held its own copy of the order. Two went
  // stale when the contract grew, and because each rebuilt the object from its own list,
  // the sections they did not know about were silently deleted — app-components' work
  // vanished the next time the map ran. The lists must match, and every writer must
  // carry through keys it does not recognise.
  const root = join(import.meta.dirname, '../../..');
  const writers = [
    '.claude/skills/app-explorer/lib/map.mjs',
    '.claude/skills/app-explorer/lib/write-screens.mjs',
  ];
  for (const writer of writers) {
    const source = readFileSync(join(root, writer), 'utf8');
    const declared = source.match(/const SECTIONS = \[([^\]]+)\]/);
    assert.ok(declared, `${writer} declares no SECTIONS list`);
    const names = declared[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    assert.deepEqual(names, [...SECTIONS], `${writer} is out of step with analysis-types.ts`);
    assert.match(source, /for \(const key of Object\.keys\(current\)\)/,
      `${writer} rebuilds the file without carrying through unknown keys`);
  }
});

test('a recording of a route the crawl never reached is what makes it writable', () => {
  // The case a recording is worth most in, and the one the scorer used to ignore: a
  // declared-but-unreached screen stayed at zero however often it was recorded, so the
  // agent asked for a recording that could never raise the score.
  const screens: any[] = [{ ...screen([]), path: '/editor', crawled: false }];
  scoreScreens(screens, []);
  assert.equal(verdictFor(screens[0].testability.confidence), 'unknown');

  scoreScreens(screens, [{ flow: 'write', path: 'r.md', recordedAt: '', screens: ['/editor'] }]);
  assert.deepEqual(screens[0].testability, RECORDED_ONLY);
  assert.equal(verdictFor(screens[0].testability.confidence), 'write');
});

test('a screen still weak after recording asks for a re-crawl, not another recording', () => {
  const s = scoreScreen(screen([named(), named(2), named(2), named(2)]), true);
  assert.ok(s.confidence < 0.7, 'still below the threshold');
  assert.ok(s.missing.some(m => /already covers this screen/.test(m) && /re-crawl/.test(m)),
    'missing must say the recording exists and name the real fix');
});
