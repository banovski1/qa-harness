import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readApplicationModel } from '../analysis-reader.js';
import { readApiMap } from '../api-map-reader.js';
import { loadConfig, main } from '../generate.js';

function fixture(t: { after(fn: () => void): void }) {
  const dir = mkdtempSync(join(tmpdir(), 'generator-contract-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('joins literal routes and components, applies mount prefix and removes shared navigation', (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'pages-and-routes.json'), JSON.stringify({ routes: [
    { path: '/users/viewUsers?active=true', component: 'Users.vue', name: 'users' },
    { path: '/api/users', component: null },
  ] }));
  const nav = { name: 'home', component: 'Button', locator: { strategy: 'getByTestId', args: ['home'] } };
  writeFileSync(join(dir, 'frontend-components.json'), JSON.stringify({ components: [
    { file: 'Users.vue', elements: [nav, { name: 'save', component: 'Button', locator: { strategy: 'getByRole', args: ['button'], name: 'Save' } }] },
  ] }));
  writeFileSync(join(dir, 'live-urls.json'), JSON.stringify({ pathPrefix: '/app/' }));
  const model = readApplicationModel({ analysisDir: dir, pages: { folderSegment: 'auto', dropParamSegments: true, mergeDuplicates: true }, navigation: [nav] });
  assert.deepEqual(model.pages.map((page) => ({ url: page.url, group: page.group, className: page.className, names: page.elements.map((e) => e.rawName) })), [
    { url: '/app/users/viewUsers', group: 'users', className: 'UsersPage', names: ['save'] },
  ]);
  assert.equal(model.pages[0].elements[0].locator.name, 'Save');
  assert.equal(model.pages[0].elements[0].rung, 2);
  assert.equal(model.sharedChrome[0].rawName, 'home');
  assert.equal(model.stats.apiRoutesSkipped, 1);
});

test('rejects malformed analysis JSON with its file context', (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'pages-and-routes.json'), '{');
  assert.throws(() => readApplicationModel({ analysisDir: dir, pages: { folderSegment: 'auto', dropParamSegments: true, mergeDuplicates: true } }), /Malformed JSON in '.*pages-and-routes.json'/);
});

test('normalizes API operations and preserves dropped fields', (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'users.yaml'), `resource: users\noperations:\n  - operationId: get-user\n    method: GET\n    path: /users/{id}\n    pathParams:\n      - name: id\n        type: number\n    responses:\n      - status: 200\n        schema:\n          kind: object\n          properties:\n            - name: name\n              type: string\n              required: true\n    droppedFields: [nested]\n`);
  const model = readApiMap({ apiMapDir: dir, api: { enabled: true } });
  assert.equal(model.resources[0].className, 'Users');
  assert.equal(model.resources[0].source, 'manual');
  assert.deepEqual(model.resources[0].operations[0], {
    operationId: 'get-user', resource: 'users', safeId: 'getUser', method: 'GET', path: '/users/{id}',
    pathParams: [{ name: 'id', type: 'number' }], queryParams: [], requestBody: null,
    responses: [{ status: 200, contentType: 'application/json', schema: { kind: 'object', properties: [{ name: 'name', type: 'string', required: true, nullable: false }] } }],
    droppedFields: ['nested'],
  });
  assert.equal(model.stats.droppedFields, 1);
});

test('config defaults remain stable and required outputDir is validated', async (t) => {
  const dir = fixture(t);
  const path = join(dir, 'config.yaml');
  writeFileSync(path, 'baseUrl: https://example.test\n');
  const config = loadConfig(path);
  assert.equal(config.language, 'typescript');
  assert.equal(config.pages.folderSegment, 'auto');
  assert.equal(config.api.enabled, false);
  assert.equal(config.login, null);
  writeFileSync(path, "baseUrl: https://example.test\noutputDir: ''\n");
  assert.throws(() => loadConfig(path), /Missing 'outputDir:'/);
  await assert.rejects(main([path, '--dry-run']), /Missing 'outputDir:'/);
});
