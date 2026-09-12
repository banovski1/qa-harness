import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compile, assertNoSelectors, pickKeyColumn, assignPageNames, pathIdentity } from '../compile-model.ts';

test('a page is identified by its full parameterless path', () => {
  assert.equal(pathIdentity('/pim/employee/{id}/edit'), 'pim/employee/edit');
  assert.equal(pathIdentity('/#Contact/view/:id'), '#Contact/view');
});

test('names extend toward the root only while two pages collide', () => {
  const n = assignPageNames(['/kye/assignments', '/kytp/assignments', '/contacts']);
  assert.equal(n.get('/contacts'), 'ContactsPage');
  assert.equal(n.get('/kye/assignments'), 'KyeAssignmentsPage');
  assert.equal(n.get('/kytp/assignments'), 'KytpAssignmentsPage');
});

test('names do not depend on read order', () => {
  const a = assignPageNames(['/kye/assignments', '/kytp/assignments']);
  const b = assignPageNames(['/kytp/assignments', '/kye/assignments']);
  assert.deepEqual([...a].sort(), [...b].sort());
});

test('the key column skips the select-all checkbox column', () => {
  assert.equal(pickKeyColumn(['Select All Results', 'Name', 'Email']), 'Name');
  assert.equal(pickKeyColumn([]), null);
});

test('a screen carrying a selector is a compile error, not a warning', () => {
  const screen: any = { name: 'X', uses: [{ component: 'Button', as: 'b', label: '.oxd-button' }] };
  assert.throws(() => assertNoSelectors([screen]), /looks like a selector/);
});

test('a label containing a dot or a bracket is not mistaken for a selector', () => {
  const ok: any = { name: 'X', uses: [
    { component: 'Button', as: 'a', label: 'Send draft to A.Beike' },
    { component: 'Button', as: 'b', label: 'Delete [archived]' },
  ] };
  assert.doesNotThrow(() => assertNoSelectors([ok]));
});

// A miniature app, so the joining rules are tested on data small enough to read.
function fixture(): string {
  const dir = mkdtempSync(join(tmpdir(), 'model-'));
  mkdirSync(join(dir, 'screens'));
  writeFileSync(join(dir, 'dossier.json'), JSON.stringify({
    app: 'demo', baseUrl: 'https://demo.test/', repoPath: '/r', repoCommit: 'abc',
    frontend: { framework: 'vue' }, backend: { framework: 'symfony' },
  }));
  writeFileSync(join(dir, 'routes.json'), JSON.stringify({
    routes: [{ path: '/contacts' }, { path: '/contacts/add' }, { path: '/reports' }],
  }));
  writeFileSync(join(dir, 'components.json'), JSON.stringify({
    regions: [
      { name: 'NavigationBar', selector: '#nav' },
      { name: 'RecordTable', selector: '.tbl', row: 'tr', cell: 'td', rowKey: 'data-id' },
    ],
    labelAssociation: { preferredTemplate: '[data-name="{fieldName}"]' },
  }));
  writeFileSync(join(dir, 'api.json'), JSON.stringify({ endpoints: [], auth: { kind: 'token' } }));

  const nav = ['Contacts', 'Reports', 'Settings'].map((t, i) => ({
    tag: 'a', role: 'link', name: t, label: null, placeholder: null, id: null, nameAttr: null,
    testId: null, data: {}, region: 'navigation', visible: true, disabled: false,
    href: '#', locator: { strategy: 'role', args: ['link', t], matchCount: 1 }, unique: true, fragile: false, type: null,
  }));
  const screen = (path: string, title: string, extra: any[] = [], tables: any[] = []) => ({
    url: 'https://demo.test' + path, path, title,
    headings: [{ level: 1, text: title }], tables,
    elements: [...nav, ...extra],
    links: [{ href: '/contacts/add', resolved: 'https://demo.test/contacts/add', text: 'Add Contact' }],
  });
  const addLink = {
    tag: 'a', role: 'link', name: 'Add Contact', label: null, placeholder: null, id: null, nameAttr: null,
    testId: null, data: {}, region: 'body', visible: true, disabled: false, href: '/contacts/add',
    locator: { strategy: 'role', args: ['link', 'Add Contact'], matchCount: 1 }, unique: true, fragile: false, type: null,
  };
  const rowCheckbox = {
    tag: 'input', role: 'checkbox', name: '', label: null, placeholder: null, id: null, nameAttr: null,
    testId: null, data: {}, region: 'table', visible: true, disabled: false, href: null,
    locator: { strategy: 'css', args: ['tr td input'], matchCount: 1 }, unique: true, fragile: true, type: 'checkbox',
  };
  const firstName = {
    tag: 'input', role: 'textbox', name: 'First Name', label: null, placeholder: null, id: null, nameAttr: null,
    testId: null, data: {}, region: 'body', visible: true, disabled: false, href: null,
    locator: { strategy: 'role', args: ['textbox', 'First Name'], matchCount: 1 }, unique: true, fragile: false, type: 'text',
  };
  writeFileSync(join(dir, 'screens', 'contacts.json'), JSON.stringify(
    screen('/contacts', 'Contacts', [addLink, rowCheckbox], [{ columns: ['Select All Results', 'Name', 'Email'], rowCount: 3 }])));
  writeFileSync(join(dir, 'screens', 'add.json'), JSON.stringify(screen('/contacts/add', 'Add Contact', [firstName])));
  return dir;
}

test('the navigation recurs on both screens, so it becomes one component', () => {
  const m = compile(fixture(), 'T');
  const nav = m.components.NavigationBar;
  assert.equal(nav.kind, 'region');
  assert.equal(nav.seenOn, 2);
  assert.deepEqual(Object.keys(nav.controls!).sort(), ['contacts', 'reports', 'settings']);
  assert.deepEqual(nav.root, { strategy: 'css', args: ['#nav'] });
});

test('a screen references the navigation without repeating its controls', () => {
  const m = compile(fixture(), 'T');
  const contacts = m.screens.find(s => s.path === '/contacts')!;
  assert.ok(contacts.uses.some(u => u.component === 'NavigationBar'));
  assert.ok(!contacts.uses.some(u => u.label === 'Reports'));
});

test('no screen carries a locator anywhere in its uses', () => {
  const m = compile(fixture(), 'T');
  for (const s of m.screens) for (const u of s.uses) assert.ok(!('root' in u) && !('strategy' in u));
});

test('a table becomes a key-addressed collection', () => {
  const m = compile(fixture(), 'T');
  const table = m.screens.find(s => s.path === '/contacts')!.uses.find(u => u.component === 'RecordTable')!;
  assert.equal(table.keyColumn, 'Name');
  assert.equal(m.components.RecordTable.table!.rowKeyAttribute, 'data-id');
});

test('a row checkbox is the collection’s business, not an unverified page control', () => {
  const m = compile(fixture(), 'T');
  assert.equal(m.screens.find(s => s.path === '/contacts')!.unverified, 0);
});

test('an action is emitted only where the crawl proved the transition', () => {
  const m = compile(fixture(), 'T');
  const contacts = m.screens.find(s => s.path === '/contacts')!;
  assert.deepEqual(contacts.actions, [{ name: 'goToAddContact', via: 'addContact', leadsTo: 'AddPage' }]);
  assert.deepEqual(m.screens.find(s => s.path === '/contacts/add')!.actions, []);
});

test('a declared route the crawl never reached is still a page, flagged', () => {
  const m = compile(fixture(), 'T');
  const reports = m.screens.find(s => s.path === '/reports')!;
  assert.equal(reports.crawled, false);
  assert.equal(reports.uses.length, 0);
  assert.equal(reports.url, 'https://demo.test/reports');
});

test('compiling twice gives byte-identical output', () => {
  const dir = fixture();
  assert.equal(JSON.stringify(compile(dir, 'T')), JSON.stringify(compile(dir, 'T')));
});

test('a layout table with no header row is not a collection', () => {
  const dir = fixture();
  const file = join(dir, 'screens', 'contacts.json');
  const screen = JSON.parse(readFileSync(file, 'utf8'));
  screen.tables.push({ columns: [], rowCount: 2 });
  writeFileSync(file, JSON.stringify(screen));
  const m = compile(dir, 'T');
  assert.equal(m.screens.find(s => s.path === '/contacts')!.uses.filter(u => u.component === 'RecordTable').length, 1);
});

test('a route made only of parameters is still named', () => {
  const n = assignPageNames(['/{user}/{type}', '/{user}']);
  assert.equal(n.get('/{user}'), 'UserPage');
  assert.equal(n.get('/{user}/{type}'), 'TypePage');
});

test('a crawled record URL folds onto its declared parameterised route', () => {
  const dir = fixture();
  writeFileSync(join(dir, 'routes.json'), JSON.stringify({
    routes: [{ path: '/contacts' }, { path: '/contacts/add' }, { path: '/contacts/{id}' }],
  }));
  const screen = JSON.parse(readFileSync(join(dir, 'screens', 'contacts.json'), 'utf8'));
  writeFileSync(join(dir, 'screens', 'one.json'), JSON.stringify({ ...screen, path: '/contacts/42', title: 'Ada' }));
  const m = compile(dir, 'T');
  const detail = m.screens.find(s => s.path === '/contacts/{id}')!;
  assert.equal(detail.crawled, true);
  assert.deepEqual(detail.aliases, ['/contacts/42']);
  assert.ok(!m.screens.some(s => s.path === '/contacts/42'));
});
