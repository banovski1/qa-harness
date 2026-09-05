// Unit tests for the analyzer's pure functions: the string and shape rules every report is built
// out of. These need no fixture app on disk — a failure here points at one function, not a pipeline.
//
//   node --test scripts/repo-analyzer/__tests__/

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {crossCheck, mergeByPath} from '../api-docs.mjs';
import {joinUrl} from '../live-urls.mjs';
import {componentNameFromFile, isTestIdAttr, walkAny, walkAst} from '../parsers.mjs';
import {paramsOf} from '../registry-backend.mjs';
import {FRONTEND_REGISTRY, matchFrontend} from '../registry-frontend.mjs';
import {escapeCell, table} from '../report.mjs';
import {fileRouteFor, normalisePath} from '../routes.mjs';

test('normalisePath rewrites every router dialect to {param}', () => {
  assert.equal(normalisePath('/users/:userId'), '/users/{userId}');
  assert.equal(normalisePath('/users/:userId?'), '/users/{userId}');
  assert.equal(normalisePath('/orders/<int:pk>/'), '/orders/{pk}/');
  assert.equal(normalisePath('/posts/<slug>'), '/posts/{slug}');
  assert.equal(normalisePath('/pim/viewEmployee/empNumber/{empNumber}'), '/pim/viewEmployee/empNumber/{empNumber}');
  assert.equal(normalisePath('/static/path'), '/static/path');
});

test('fileRouteFor covers each file-based routing convention', () => {
  assert.equal(fileRouteFor('index.tsx', {}), '/');
  assert.equal(fileRouteFor('blog/[slug].tsx', {}), '/blog/{slug}');
  assert.equal(fileRouteFor('docs/[...rest].tsx', {}), '/docs/{rest*}');
  assert.equal(fileRouteFor('shop/[[locale]]/index.tsx', {}), '/shop/{locale?}');
  assert.equal(fileRouteFor('(marketing)/about.tsx', {}), '/about');
  assert.equal(fileRouteFor('blog/[slug]/page.tsx', {pageFile: 'page'}), '/blog/{slug}');
  assert.equal(fileRouteFor('items/[id]/+page.svelte', {pageFile: '+page'}), '/items/{id}');
  assert.equal(fileRouteFor('users.$id.tsx', {flat: true}), '/users/{id}');
});

test('joinUrl composes a base, a prefix and a route without doubling slashes', () => {
  assert.equal(joinUrl('https://app.test', '', '/pim/list'), 'https://app.test/pim/list');
  assert.equal(joinUrl('https://app.test/', '', '/pim/list'), 'https://app.test/pim/list');
  assert.equal(joinUrl('https://app.test', '/web/index.php', '/pim/list'), 'https://app.test/web/index.php/pim/list');
  assert.equal(joinUrl('https://app.test', 'web/index.php/', 'pim/list'), 'https://app.test/web/index.php/pim/list');
  assert.equal(joinUrl('https://app.test', '', '/'), 'https://app.test/');
});

test('paramsOf reads every parameter spelling and de-duplicates', () => {
  assert.deepEqual(paramsOf('/a/{one}/b/{two}'), ['one', 'two']);
  assert.deepEqual(paramsOf('/a/:one'), ['one']);
  assert.deepEqual(paramsOf('/a/<int:one>/'), ['one']);
  assert.deepEqual(paramsOf('/a/{one}/b/{one}'), ['one']);
  assert.deepEqual(paramsOf('/a/b'), []);
});

test('matchFrontend applies the beats: precedence rather than registry order', () => {
  assert.equal(matchFrontend({next: '14', react: '18'})?.id, 'next');
  assert.equal(matchFrontend({nuxt: '3', vue: '3'})?.id, 'nuxt');
  assert.equal(matchFrontend({'@sveltejs/kit': '2', svelte: '4'})?.id, 'sveltekit');
  assert.equal(matchFrontend({'@remix-run/react': '2', react: '18'})?.id, 'remix');
  assert.equal(matchFrontend({react: '18'})?.id, 'react');
  assert.equal(matchFrontend({lodash: '4'}), null);

  // Assert the declaration, not only the outcome: a meta-framework also lists the base library it
  // builds on, so without `beats:` the winner would be whichever row happens to come first.
  for (const [winner, loser] of [['next', 'react'], ['remix', 'react'], ['nuxt', 'vue'], ['sveltekit', 'svelte']]) {
    const entry = FRONTEND_REGISTRY.find((row) => row.id === winner);
    assert.ok(entry?.beats?.includes(loser), `${winner} must declare beats: ['${loser}']`);
  }
});

test('escapeCell keeps a value from breaking out of its table cell', () => {
  assert.equal(escapeCell('a | b'), 'a \\| b');
  assert.equal(escapeCell('line one\nline two'), 'line one line two');
  assert.equal(escapeCell(null), '—');
  assert.equal(escapeCell(''), '—');
  assert.equal(escapeCell(0), '0');
});

test('table renders a header, a rule and one row per entry', () => {
  assert.equal(table(['A', 'B'], []), '_No rows._\n');
  assert.equal(table(['A', 'B'], [['1', '2']]), '| A | B |\n| --- | --- |\n| 1 | 2 |\n');
});

test('componentNameFromFile names an index file after its directory', () => {
  assert.equal(componentNameFromFile('/app/src/components/UserCard.vue'), 'UserCard');
  assert.equal(componentNameFromFile('/app/src/routes/index.jsx'), 'routes');
});

test('isTestIdAttr accepts every recorded convention and nothing else', () => {
  for (const attr of ['data-testid', 'data-test-id', 'data-test', 'data-cy', 'data-qa']) {
    assert.ok(isTestIdAttr(attr), attr);
  }
  assert.ok(!isTestIdAttr('data-foo'));
  assert.ok(!isTestIdAttr('id'));
});

test('walkAny reaches nodes a Babel walker cannot see', () => {
  // Vue tags template nodes with a *numeric* type and Angular hands back class instances. A walker
  // that only visits `typeof node.type === 'string'` finds nothing in either, which reads exactly
  // like an app with no test ids — the bug this assertion exists to keep out.
  class TemplateNode {
    constructor(children) { this.children = children; }
  }
  const tree = {children: [{type: 1, name: 'div'}, new TemplateNode([{marker: 'deep'}])]};
  const seenNumeric = [];
  const seenInstances = [];
  const seenMarkers = [];
  walkAny(tree, (node) => {
    if (typeof node.type === 'number') seenNumeric.push(node.type);
    if (node instanceof TemplateNode) seenInstances.push(node);
    if (node.marker) seenMarkers.push(node.marker);
  });
  assert.deepEqual(seenNumeric, [1]);
  assert.equal(seenInstances.length, 1);
  assert.deepEqual(seenMarkers, ['deep']);

  const babelSeen = [];
  walkAst(tree, (node) => babelSeen.push(node));
  assert.equal(babelSeen.length, 0, 'walkAst is the Babel-only walker; walkAny is what template ASTs need');
});

test('mergeByPath folds methods onto one row per endpoint', () => {
  const merged = mergeByPath([
    {path: '/api/items', methods: ['POST'], purpose: null, params: [], source: 'a'},
    {path: '/api/items', methods: ['GET'], purpose: 'List items', params: [], source: 'a'},
    {path: '/api/health', methods: ['GET'], purpose: null, params: [], source: 'b'},
  ]);
  assert.deepEqual(merged.map((e) => e.path), ['/api/health', '/api/items']);
  assert.deepEqual(merged[1].methods, ['GET', 'POST']);
  assert.equal(merged[1].purpose, 'List items', 'a later row must be able to supply a missing purpose');
});

test('crossCheck reports the delta in both directions', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-analyzer-'));
  const specFile = path.join(dir, 'openapi.json');
  fs.writeFileSync(specFile, JSON.stringify({paths: {'/api/a': {}, '/api/b': {}}}));
  t.after(() => fs.rmSync(dir, {recursive: true, force: true}));

  const result = crossCheck([{path: '/api/a'}, {path: '/api/c'}], specFile);
  assert.equal(result.specCount, 2);
  assert.equal(result.foundCount, 2);
  assert.deepEqual(result.missing, ['/api/b']);
  assert.deepEqual(result.extra, ['/api/c']);

  // Both sides empty must still report 0 vs 0 rather than a clean bill of health.
  const empty = crossCheck([], specFile);
  assert.equal(empty.foundCount, 0);
  assert.deepEqual(empty.missing, ['/api/a', '/api/b']);
});
