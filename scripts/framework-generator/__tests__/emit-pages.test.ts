import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from '../emit/pages.ts';
import { header } from '../emit/naming.ts';
import { emit } from '../emit/emit.ts';
import { fixtureModel } from './fixtures/model.ts';

test('a page is one class extending BasePage — there is no Generated superclass', () => {
  const model = fixtureModel();
  const page = renderPage(model.screens[0], model);
  assert.match(page, /export class LoginPage extends BasePage/);
  // The header legitimately says "Generated once" (ruling B) — strip exactly the header
  // the renderer would have produced, rather than a positional line count, so this stays
  // correct no matter how header()'s shape changes.
  const body = page.replace(header(model), '');
  assert.ok(!body.includes('Generated'), 'nothing is called Generated any more');
});

test('the header states provenance rather than threatening a rewrite', () => {
  const model = fixtureModel();
  const page = renderPage(model.screens[0], model);
  assert.match(page, /Generated once from analysis\.json \(abcdef1234\)/);
  assert.match(page, /This file is yours now/);
  assert.ok(!/rewritten on every run/i.test(page));
});

test('a page keeps its members, its actions and its provenance notes', () => {
  const model = fixtureModel();
  const page = renderPage(model.screens[0], model);
  assert.match(page, /readonly username = new TextField/);
  assert.match(page, /async login\(\): Promise<void>/);
  const uncrawled = renderPage(model.screens[2], model);
  assert.match(uncrawled, /crawl never reached/);
});

test('no emitted path under src/pages/ carries the .generated suffix, and one file is emitted per screen', () => {
  const model = fixtureModel();
  const writer = emit(model, null, '/tmp/does-not-matter', { dryRun: true });
  const pagePaths = writer.planned.filter(p => p.path.startsWith('src/pages/'));
  const offenders = pagePaths.filter(p => p.path.includes('.generated.'));
  assert.deepEqual(offenders, []);
  const perScreen = pagePaths.filter(p =>
    p.path.endsWith('.ts') && p.path !== 'src/pages/index.ts' && p.path !== 'src/pages/BasePage.ts');
  assert.equal(perScreen.length, model.screens.length, 'exactly one file per screen');
});

test('one page file is emitted per screen, not two', () => {
  const model = fixtureModel();
  const writer = emit(model, null, '/tmp/does-not-matter', { dryRun: true });
  const pages = writer.planned.filter(p => p.path.startsWith('src/pages/') && p.path.endsWith('.ts'));
  const names = pages.map(p => p.path);
  assert.ok(names.includes('src/pages/auth/LoginPage.ts'));
  assert.equal(new Set(names).size, names.length, 'no path is written twice');
});

test('a region component and the templates are written without a suffix', () => {
  const model = fixtureModel();
  const writer = emit(model, null, '/tmp/does-not-matter', { dryRun: true });
  const paths = writer.planned.map(p => p.path);
  assert.ok(paths.includes('src/components/NavigationBar.ts'));
  assert.ok(paths.includes('src/components/locator-templates.ts'));
  assert.ok(!paths.includes('src/components/NavigationBar.generated.ts'));
});
