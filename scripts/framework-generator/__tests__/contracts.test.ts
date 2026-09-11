import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync, cpSync, mkdirSync, symlinkSync, chmodSync, readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { readApplicationModel } from '../analysis-reader.js';
import { readApiMap } from '../api-map-reader.js';
import { loadConfig, main } from '../generate.js';
import { meaningfulSegments } from '../page-model.js';
import { pageClassName } from '../naming.js';
import { appAnalysisDir } from '../../project-config.js';
import type { GeneratedFile, GenerationContext, LanguageAdapter } from '../types.js';

function fixture(t: { after(fn: () => void): void }) {
  const dir = mkdtempSync(join(tmpdir(), 'generator-contract-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

for (const [id, extension] of [['typescript', '.ts'], ['javascript', '.js'], ['java', '.java'], ['python', '.py'], ['csharp', '.cs']]) {
  test(`${id} adapter emits project files and honors its page-generation contract`, async (t) => {
    const { adapterFor, SUPPORTED_LANGUAGES } = await import('../languages/index.js');
    const adapter: LanguageAdapter = adapterFor(id);
    assert.ok(SUPPORTED_LANGUAGES.includes(id));
    assert.equal(adapter.id, id);
    assert.equal(adapter.extension, extension);
    assert.throws(() => adapterFor('unsupported'), /Unknown language.*Supported:/);

    const dir = fixture(t);
    const configPath = join(dir, 'config.yaml');
    writeFileSync(configPath, JSON.stringify({ analysisDir: dir, baseUrl: 'https://example.test' }));
    writeFileSync(join(dir, 'pages-and-routes.json'), JSON.stringify({ routes: [{ path: '/users', component: 'Users.vue' }] }));
    writeFileSync(join(dir, 'frontend-components.json'), JSON.stringify({ components: [{ file: 'Users.vue', elements: [
      { name: 'save', component: 'button', locator: { strategy: 'getByRole', args: ['button'], name: 'Save' } },
    ] }] }));
    const config = loadConfig(configPath);
    const model = readApplicationModel(config);
    const context: GenerationContext = { config, model, apiModel: readApiMap(config), adapter };
    const assertFiles = (files: GeneratedFile[]) => {
      assert.ok(Array.isArray(files));
      assert.ok(files.length > 0);
      for (const file of files) {
        assert.equal(typeof file.path, 'string');
        assert.equal(typeof file.contents, 'string');
        assert.ok(['generated', 'protected'].includes(file.kind));
      }
      assert.equal(new Set(files.map((file) => file.path)).size, files.length);
    };
    const staticFiles = adapter.staticFiles(context);
    assertFiles(staticFiles);
    assert.match(staticFiles.find((file) => file.path === '.env.example')!.contents, /BASE_URL=https:\/\/example.test/);
    const dirs = adapter.emptyDirs(context);
    assert.ok(Array.isArray(dirs));
    assert.ok(dirs.length > 0);
    assert.ok(dirs.every((dir) => typeof dir === 'string'));
    const pageFiles = adapter.renderPage(model.pages[0], context);
    if (id === 'typescript') {
      assert.ok(pageFiles);
      assertFiles(pageFiles);
      assert.deepEqual(pageFiles.map((file) => file.kind), ['generated', 'protected']);
      assert.match(pageFiles[0].contents, /ButtonComponent.byLabel\(this.page, 'Save'\)/);
      assert.match(adapter.renderTest(model.pages[0], context)!.contents, /usersPage.goto\(\)/);
      context.config.tests.generateSmokeSpecs = false;
      assert.equal(adapter.renderTest(model.pages[0], context), null);
      assert.deepEqual(adapter.locatorStats!(model, config), { total: 1, derived: 1, byFactory: [['ButtonComponent.byLabel', 1]] });
    } else {
      assert.equal(pageFiles, null);
      assert.equal(adapter.renderTest(model.pages[0], context), null);
    }
  });
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
  const model = readApplicationModel({ analysisDir: dir, pages: { folderSegment: 'auto', mergeDuplicates: true }, navigation: [nav] });
  assert.deepEqual(model.pages.map((page) => ({ url: page.url, group: page.group, className: page.className, names: page.elements.map((e) => e.rawName) })), [
    { url: '/app/users/viewUsers', group: 'users', className: 'UsersPage', names: ['save'] },
  ]);
  assert.equal(model.pages[0].elements[0].locator.name, 'Save');
  assert.equal(model.pages[0].elements[0].rung, 2);
  assert.equal(model.sharedChrome[0].rawName, 'home');
  assert.equal(model.stats.apiRoutesSkipped, 1);
});

test('names pages from the full route path and never numbers a resolvable collision', (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'pages-and-routes.json'), JSON.stringify({ routes: [
    { path: '/kye/assignments', component: 'Assignments.vue' },
    { path: '/kye/assignments/edit/{id}/authorizations/individual-arls', component: 'IndividualArls.vue' },
    { path: '/kye/authorizations/individual-arls', component: 'IndividualArls.vue' },
    { path: '/kytp/assignments', component: 'KytpAssignments.vue' },
    { path: '/kye/documents/{folderId}/list', component: 'Documents.vue' },
  ] }));
  writeFileSync(join(dir, 'frontend-components.json'), JSON.stringify({ components: [
    { file: 'Assignments.vue', elements: [] },
    { file: 'IndividualArls.vue', elements: [] },
    { file: 'KytpAssignments.vue', elements: [] },
    { file: 'Documents.vue', elements: [] },
  ] }));
  const model = readApplicationModel({ analysisDir: dir, pages: { folderSegment: 'auto', mergeDuplicates: true } });
  assert.deepEqual(model.pages.map((page) => ({ url: page.url, group: page.group, className: page.className, aliases: page.aliases })), [
    // Two `assignments` leaves collide, so BOTH extend to their module — no first-come-wins, no numbers.
    { url: '/kye/assignments', group: 'kye', className: 'KyeAssignmentsPage', aliases: [] },
    // The same component at two mounts is one screen: the shortest URL is canonical, the other an alias.
    { url: '/kye/authorizations/individual-arls', group: 'kye', className: 'IndividualArlsPage', aliases: ['/kye/assignments/edit/{id}/authorizations/individual-arls'] },
    // `{folderId}` is a param placeholder, not identity — any {param} segment is dropped, not just {id}.
    { url: '/kye/documents/{folderId}/list', group: 'kye', className: 'ListPage', aliases: [] },
    { url: '/kytp/assignments', group: 'kytp', className: 'KytpAssignmentsPage', aliases: [] },
  ]);
});

test('a numeric suffix remains only for paths whose meaningful segments are identical', (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'pages-and-routes.json'), JSON.stringify({ routes: [
    { path: '/requests/add', component: 'Add.vue' },
    { path: '/requests/add/{id}', component: 'AddForEntity.vue' },
  ] }));
  writeFileSync(join(dir, 'frontend-components.json'), JSON.stringify({ components: [
    { file: 'Add.vue', elements: [] }, { file: 'AddForEntity.vue', elements: [] },
  ] }));
  const model = readApplicationModel({ analysisDir: dir, pages: { folderSegment: 1, mergeDuplicates: true } });
  assert.deepEqual(model.pages.map((page) => page.className), ['RequestsAddPage', 'RequestsAddPage2']);
});

test('path-to-name helpers: params, index leaves, and depth extension', () => {
  assert.deepEqual(meaningfulSegments('/users/{userId}/settings', 1), ['users', 'settings']);
  assert.deepEqual(meaningfulSegments('/app/v2/users/:id', 3), ['users']);
  assert.deepEqual(meaningfulSegments('/', 1), []);
  assert.equal(pageClassName(['admin', 'viewSystemUsers']), 'SystemUsersPage');
  assert.equal(pageClassName(['pim', 'viewPimModule']), 'PimPage');
  assert.equal(pageClassName(['kye', 'assignments', 'index']), 'AssignmentsPage');
  assert.equal(pageClassName(['kye', 'assignments', 'edit'], 2), 'AssignmentsEditPage');
  assert.equal(pageClassName(['home']), 'HomePage');
});

test('rejects malformed analysis JSON with its file context', (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, 'pages-and-routes.json'), '{');
  assert.throws(() => readApplicationModel({ analysisDir: dir, pages: { folderSegment: 'auto', mergeDuplicates: true } }), /Malformed JSON in '.*pages-and-routes.json'/);
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
  // Both analysis paths default into the app's own folder, so the generator reads what
  // the analyzer wrote without either config naming the app.
  assert.equal(config.analysisDir, appAnalysisDir());
  assert.equal(config.apiMapDir, join(appAnalysisDir(), 'api-map'));
  writeFileSync(path, "baseUrl: https://example.test\noutputDir: ''\n");
  assert.throws(() => loadConfig(path), /Missing 'outputDir:'/);
  await assert.rejects(main([path, '--dry-run']), /Missing 'outputDir:'/);
});

for (const outputDir of ['[]', '{}', '[generated]', '{ path: generated }']) {
  test(`rejects structured outputDir YAML ${outputDir} before generation`, async (t) => {
    const dir = fixture(t);
    const path = join(dir, 'config.yaml');
    writeFileSync(path, `baseUrl: https://example.test\noutputDir: ${outputDir}\n`);
    assert.throws(() => loadConfig(path), /outputDir.*non-empty string/);
    await assert.rejects(main([path]), /outputDir.*non-empty string/);
  });
}

test('the npm-style bin symlink runs without npm or npx on PATH', (t) => {
  const dir = fixture(t);
  const source = fileURLToPath(new URL('..', import.meta.url));
  const linkedProject = join(dir, 'linked-project');
  const linkedPackage = join(linkedProject, 'scripts', 'framework-generator');
  cpSync(source, linkedPackage, { recursive: true, filter: (file) => !['node_modules', '__tests__'].includes(basename(file)) });
  cpSync(join(source, '..', 'project-config.ts'), join(linkedProject, 'scripts', 'project-config.ts'));
  symlinkSync(join(source, 'node_modules'), join(linkedPackage, 'node_modules'));
  writeFileSync(join(linkedProject, 'app-config.yaml'), 'appPath: .\nbaseUrl: https://example.test\n');

  const installDir = join(dir, 'node_modules');
  const binDir = join(installDir, '.bin');
  mkdirSync(binDir, { recursive: true });
  symlinkSync(linkedPackage, join(installDir, 'framework-generator'));
  const manifest = JSON.parse(readFileSync(join(linkedPackage, 'package.json'), 'utf8'));
  const bin = join(binDir, 'framework-generator');
  chmodSync(join(linkedPackage, manifest.bin['framework-generator']), 0o755);
  symlinkSync(join('..', 'framework-generator', manifest.bin['framework-generator']), bin);
  const nodeOnlyPath = join(dir, 'node-only');
  mkdirSync(nodeOnlyPath);
  symlinkSync(process.execPath, join(nodeOnlyPath, 'node'));
  const env = { ...process.env, PATH: nodeOnlyPath };

  const missing = spawnSync(bin, ['absent.yaml'], { cwd: dir, env, encoding: 'utf8' });
  assert.equal(missing.status, 1, missing.stderr);
  assert.match(missing.stderr, /\[framework-gen\] ERROR Config file not found: absent.yaml/);
  assert.equal(typeof manifest.dependencies.tsx, 'string', 'the bin runner must be installed in production');

  const analysisDir = join(dir, 'analysis');
  mkdirSync(analysisDir);
  writeFileSync(join(analysisDir, 'pages-and-routes.json'), JSON.stringify({ routes: [{ path: '/users', component: 'Users.vue' }] }));
  writeFileSync(join(analysisDir, 'frontend-components.json'), JSON.stringify({ components: [{ file: 'Users.vue', elements: [] }] }));
  const config = join(dir, 'config.yaml');
  const outputDir = join(dir, 'generated');
  writeFileSync(config, JSON.stringify({ analysisDir, outputDir }));
  const generated = spawnSync(bin, [config, '--dry-run'], { cwd: dir, env, encoding: 'utf8' });
  assert.equal(generated.status, 0, generated.stderr);
  assert.match(generated.stdout, /\[framework-gen\] done: 1 page object\(s\)/);
  assert.equal(existsSync(outputDir), false);
});
