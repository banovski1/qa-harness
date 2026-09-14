import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderDraft } from '../emit/draft-render.ts';
import { plannedPaths } from '../emit/plan.ts';
import { fixtureModel } from './fixtures/model.ts';

test('every screen appears in the draft, and none is silently dropped', () => {
  const draft = renderDraft(fixtureModel(), null);
  for (const name of ['LoginPage', 'DashboardPage', 'ReportPage']) {
    assert.ok(draft.includes(name), `${name} is missing from the draft`);
  }
});

test('a screen the crawl never reached says so in words, not in a flag', () => {
  const draft = renderDraft(fixtureModel(), null);
  const section = draft.slice(draft.indexOf('ReportPage'));
  assert.match(section, /never reached/i);
});

test('screens are ordered strongest first, so the weakest foundation is not buried', () => {
  const draft = renderDraft(fixtureModel(), null);
  assert.ok(draft.indexOf('### LoginPage') < draft.indexOf('### DashboardPage'));
  assert.ok(draft.indexOf('### DashboardPage') < draft.indexOf('### ReportPage'));
});

test('a control records how its label was found', () => {
  const draft = renderDraft(fixtureModel(), null);
  assert.match(draft, /username.*TextField.*Username.*proximity/);
});

test('the warnings section lists exactly the screens that earned a warning', () => {
  const draft = renderDraft(fixtureModel(), null);
  const warnings = draft.slice(draft.indexOf('## Warnings'));
  assert.match(warnings, /ReportPage/);    // below 0.3
  assert.match(warnings, /DashboardPage/); // 4 unverified controls
  assert.ok(!warnings.includes('LoginPage'), 'LoginPage has nothing wrong with it');
});

test('a proved action names what proved it', () => {
  const draft = renderDraft(fixtureModel(), null);
  assert.match(draft, /login\(\).*DashboardPage/);
});

test('the render is deterministic — the approval lock hashes it', () => {
  assert.equal(renderDraft(fixtureModel(), null), renderDraft(fixtureModel(), null));
});

test('the plan names one file per screen and per region component', () => {
  const paths = plannedPaths(fixtureModel()).map(p => p.path);
  assert.ok(paths.includes('src/pages/auth/LoginPage.ts'));
  assert.ok(paths.includes('src/components/NavigationBar.ts'));
  assert.ok(!paths.some(p => p.includes('.generated.')), 'nothing carries the old suffix');
});
