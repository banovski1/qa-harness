// Unit tests for the analyzer's pure functions: the string and shape rules every report is built
// out of. These need no fixture app on disk — a failure here points at one function, not a pipeline.
//
//   node --test scripts/repo-analyzer/__tests__/

import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {fileURLToPath} from 'node:url';
import {bestLocatorFor, classify, rankOf, RUNGS} from '../../framework-generator/locator-ladder.mjs';
import {loadProjectConfig, projectConfigPath} from '../../project-config.js';
import {crossCheck, mergeByPath} from '../api-docs.js';
import {dedupeNames, KIND_TEMPLATES, templatesFrom} from '../elements-vue.js';
import {resolveLabelExpression} from '../i18n.js';
import {joinUrl} from '../live-urls.js';
import {componentNameFromFile, isTestIdAttr, walkAny, walkAst} from '../parsers.js';
import {paramsOf} from '../registry-backend.js';
import {FRONTEND_REGISTRY, matchFrontend} from '../registry-frontend.js';
import {escapeCell, table} from '../report.js';
import {fileRouteFor, normalisePath} from '../routes.js';
import {resolveAppPath} from '../util.js';
import {analyzerPlan} from '../analyze.js';
import {astField, astNode, astNodes, astString} from '../ast.js';
import type {AstNode, CliArgs, ProjectConfig} from '../types.js';

// --- root project config ---------------------------------------------------------------

test('public analyzer contracts accept the root project config flow', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'project-config-'));
  const app = path.join(dir, 'target-app');
  fs.mkdirSync(app);
  const fixtureConfig = path.join(dir, 'app-config.yaml');
  fs.writeFileSync(fixtureConfig, 'appPath: ./target-app\nbaseUrl: https://example.test\n');

  const config: ProjectConfig = loadProjectConfig(fixtureConfig);
  const args: CliArgs = {pathPrefix: '/web'};

  assert.equal(config.appPath, app);
  assert.equal(config.baseUrl, 'https://example.test');
  assert.equal(analyzerPlan(args).at(-1)?.args.at(-1), '/web');
});

test('loadProjectConfig requires only appPath and baseUrl', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'project-config-'));
  const configFile = path.join(dir, 'app-config.yaml');
  fs.writeFileSync(configFile, 'appPath: ./target-app\n');

  assert.throws(
    () => loadProjectConfig(configFile),
    /Missing 'baseUrl:' in app-config.yaml/,
  );
});

test('resolveAppPath defaults to the root project config when --app is omitted', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'project-config-'));
  const app = path.join(dir, 'target-app');
  fs.mkdirSync(app);
  const configFile = path.join(dir, 'app-config.yaml');
  fs.writeFileSync(configFile, 'appPath: ./target-app\nbaseUrl: http://localhost:8080\n');

  assert.equal(resolveAppPath(undefined, {configPath: configFile}), app);
});

test('projectConfigPath points at the repository-root app-config.yaml', () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  assert.equal(projectConfigPath(), path.join(repoRoot, 'app-config.yaml'));
});

test('analyzerPlan runs repo analysis stages in dependency order', () => {
  assert.deepEqual(analyzerPlan({}).map((step) => step.name), [
    'detect',
    'routes',
    'components',
    'api-docs',
    'live-urls',
  ]);
});

test('analyzerPlan passes pathPrefix only to live URL generation', () => {
  const plan = analyzerPlan({pathPrefix: '/web/index.php'});

  assert.ok(plan.slice(0, 4).every((step) => !step.args.includes('--path-prefix')));
  assert.deepEqual(plan[4].args.slice(-2), ['--path-prefix', '/web/index.php']);
});

test('analyzer plan stages can load the typed shared config', () => {
  const fixtureApp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../__fixtures__/backbone-handlebars');
  const [detectStep] = analyzerPlan({});

  const result = spawnSync(process.execPath, [...detectStep.args, '--app', fixtureApp], {encoding: 'utf8'});

  assert.equal(result.status, 0, result.stderr);
});

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

test('AST accessors narrow incompatible parser values before reading fields', () => {
  type IsAny<T> = 0 extends (1 & T) ? true : false;
  const uncheckedField: IsAny<AstNode['value']> = false;
  assert.equal(uncheckedField, false);

  class TemplateNode {children = [{type: 2, content: 'Save'}];}
  const tree: unknown = {type: 1, children: [null, 42, {type: 'Identifier', name: 'field'}, new TemplateNode()]};
  assert.equal(astNode(tree)?.type, 1);
  assert.equal(astString(tree, 'children', 2, 'name'), 'field');
  assert.equal(astString(tree, 'children', 1), undefined);
  assert.equal(astField(tree, 'children', 0, 'name'), undefined);
  assert.equal(astNodes(tree, 'children').length, 2);
  assert.equal(astString(tree, 'children', 3, 'children', 0, 'content'), 'Save');
  assert.equal(astNode({type: true}), undefined);
  assert.equal(astNode([]), undefined);
  assert.deepEqual(astNodes('not an array'), []);
});

test('walkAny reaches nodes a Babel walker cannot see', () => {
  // Vue tags template nodes with a *numeric* type and Angular hands back class instances. A walker
  // that only visits `typeof node.type === 'string'` finds nothing in either, which reads exactly
  // like an app with no test ids — the bug this assertion exists to keep out.
  class TemplateNode {
    children: unknown[];

    constructor(children: unknown[]) { this.children = children; }
  }
  const tree = {children: [{type: 1, name: 'div'}, new TemplateNode([{marker: 'deep'}])]};
  const seenNumeric: number[] = [];
  const seenInstances: TemplateNode[] = [];
  const seenMarkers: string[] = [];
  walkAny(tree, (node) => {
    if (typeof node.type === 'number') seenNumeric.push(node.type);
    if (node instanceof TemplateNode) seenInstances.push(node);
    if (typeof node.marker === 'string') seenMarkers.push(node.marker);
  });
  assert.deepEqual(seenNumeric, [1]);
  assert.equal(seenInstances.length, 1);
  assert.deepEqual(seenMarkers, ['deep']);

  const babelSeen: unknown[] = [];
  walkAst(tree, (node: unknown) => babelSeen.push(node));
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
  assert.ok(result);
  assert.equal(result.specCount, 2);
  assert.equal(result.foundCount, 2);
  assert.deepEqual(result.missing, ['/api/b']);
  assert.deepEqual(result.extra, ['/api/c']);

  // Both sides empty must still report 0 vs 0 rather than a clean bill of health.
  const empty = crossCheck([], specFile);
  assert.ok(empty);
  assert.equal(empty.foundCount, 0);
  assert.deepEqual(empty.missing, ['/api/a', '/api/b']);
});

// --- the locator ladder ---------------------------------------------------------------

test('the ladder is ordered, contiguous and self-consistent', () => {
  const rungs = RUNGS.map((r) => r.rung);
  assert.deepEqual(rungs, [...rungs].sort((a, b) => a - b), 'RUNGS must read best to worst');
  assert.deepEqual(rungs, rungs.map((_, i) => i + 1), 'rung numbers must be contiguous from 1');
  // Only the bottom two rungs are unstable; promoting one silently would let a positional
  // locator through every check that asks "is this stable?".
  assert.deepEqual(RUNGS.filter((r) => !r.stable).map((r) => r.id), ['text', 'cssPath']);
});

test('bestLocatorFor picks the highest rung the signals support', () => {
  // Every signal at once: the test id must win, not merely appear.
  const all = bestLocatorFor({
    testId: 'submit', role: 'button', name: 'Save', label: 'Save',
    templateId: 'labelledInput', placeholder: 'Save', nameAttr: 'save', text: 'Save', cssPath: '.save',
  });
  assert.ok(all);
  assert.equal(all.rung, 1);
  assert.equal(all.strategy, 'getByTestId');

  // A role with no accessible name matches every button on the page, so it is not rung 2.
  assert.equal(bestLocatorFor({role: 'button'}), null);
  assert.equal(bestLocatorFor({role: 'button', name: 'Save'})?.rung, 2);

  // An associated label beats the template; without the association the template is the fallback.
  assert.equal(bestLocatorFor({label: 'City', labelFor: true})?.strategy, 'getByLabel');
  assert.equal(bestLocatorFor({label: 'City', templateId: 'labelledInput'})?.rung, 4);
  // A label with neither association nor a template for its kind cannot be used at all.
  assert.equal(bestLocatorFor({label: 'City'}), null);

  assert.equal(bestLocatorFor({placeholder: 'Search'})?.rung, 5);
  assert.equal(bestLocatorFor({nameAttr: 'city'})?.rung, 6);
  assert.equal(bestLocatorFor({text: 'Save'})?.rung, 7);
  assert.equal(bestLocatorFor({}), null, 'no signal must yield no locator, never a guess');
});

test('only the bottom rung is marked unstable, and it says why', () => {
  const css = bestLocatorFor({cssPath: '.oxd-icon.bi-caret-down'});
  assert.ok(css);
  assert.equal(css.rung, 8);
  assert.equal(css.unstable, true);
  assert.match(css.unstableReason, /raw CSS/);
  // A template expands to CSS but is anchored to a label, so it must not be tagged unstable.
  assert.equal(bestLocatorFor({label: 'City', templateId: 'labelledInput'})?.unstable, false);
});

test('a quote in a label cannot break out of an attribute selector', () => {
  const spec = bestLocatorFor({nameAttr: 'a"b'});
  assert.ok(spec);
  assert.equal(spec.args[0], '[name="a\\"b"]');
});

test('rankOf reads an expanded template back as rung 4, not as a CSS path', () => {
  // fromMap() rewrites a template into css and leaves the id behind; without that check every
  // expanded template would be reported as the worst rung on the ladder.
  assert.equal(rankOf({strategy: 'css', args: ['.g:has(label:text-is("City")) input'], template: 'labelledInput'}), 4);
  assert.equal(rankOf({strategy: 'css', args: ['[name="city"]']}), 6);
  assert.equal(rankOf({strategy: 'css', args: ['.a .b > input']}), 8);
  assert.equal(rankOf({strategy: 'getByRole', args: ['button'], name: 'Save'}), 2);
  assert.equal(rankOf({strategy: 'getByRole', args: ['button']}), 7, 'an unnamed role is not rung 2');
});

test('classify judges a recorded locator, positional indexing first', () => {
  assert.equal(classify("page.getByRole('textbox', { name: 'Username' })").rung, 2);
  // The recording that motivated this: a named role made positional is broken by the .first().
  const positional = classify("page.getByRole('textbox', { name: 'yyyy-dd-mm' }).first()");
  assert.equal(positional.rung, 8);
  assert.equal(positional.stable, false);
  assert.ok(positional.reason);
  assert.match(positional.reason, /positional/);

  assert.equal(classify("page.locator('textarea')").rung, 8);
  assert.equal(classify("page.getByText('1', { exact: true })").rung, 7);
  assert.equal(classify("page.getByTestId('submit')").rung, 1);
  assert.equal(classify("page.getByRole('button')").stable, false, 'an unnamed role is not stable');
});

// --- label resolution -----------------------------------------------------------------

test('resolveLabelExpression resolves only an unambiguous $t key', () => {
  const catalogue = {'general.from_date': 'From Date'};
  assert.equal(resolveLabelExpression("$t('general.from_date')", catalogue), 'From Date');
  assert.equal(resolveLabelExpression('$t("general.from_date")', catalogue), 'From Date');
  // A key the catalogue does not carry must not fall back to the key itself.
  assert.equal(resolveLabelExpression("$t('general.missing')", catalogue), null);
  // Interpolation and plain expressions are dynamic; a guess here matches nothing at runtime.
  assert.equal(resolveLabelExpression("$t('general.n_mb', {count: size})", catalogue), null);
  assert.equal(resolveLabelExpression('someComputed', catalogue), null);
  assert.equal(resolveLabelExpression(null, catalogue), null);
});

test('dedupeNames keeps identifiers unique without renaming the first', () => {
  const at = (name: string, label: string) => ({name, locator: {strategy: 'template', args: ['labelledSelect'], name: label}});
  const deduped = dedupeNames([at('durationDropdown', 'A'), at('durationDropdown', 'B'), at('other', 'C'), at('durationDropdown', 'D')]);
  assert.deepEqual(deduped.map((e: {name: string}) => e.name), ['durationDropdown', 'durationDropdown2', 'other', 'durationDropdown3']);
});

test('dedupeNames does not hand out a suffix another element already took', () => {
  // Elements inlined from a child arrive already deduped, so the name this page would have
  // generated for its own second `amount` field can already be in use.
  const at = (name: string, label: string) => ({name, locator: {strategy: 'template', args: ['labelledInput'], name: label}});
  const deduped = dedupeNames([at('amountInput', 'A'), at('amountInput2', 'B'), at('amountInput', 'C')]);
  assert.deepEqual(deduped.map((e: {name: string}) => e.name), ['amountInput', 'amountInput2', 'amountInput3']);
  assert.equal(new Set(deduped.map((e: {name: string}) => e.name)).size, 3);
});

test('dedupeNames flags elements that share one locator', () => {
  const same = () => ({name: 'durationDropdown', locator: {strategy: 'template', args: ['labelledSelect'], name: 'Duration'}});
  const other = {name: 'startDayDropdown', locator: {strategy: 'template', args: ['labelledSelect'], name: 'Start Day'}};
  const deduped = dedupeNames([same(), same(), other]);

  // Unique names are not the same thing as unique locators: both getters still resolve to
  // both fields, which is the failure the ladder exists to make visible.
  assert.deepEqual(deduped.map((e: {name: string}) => e.name), ['durationDropdown', 'durationDropdown2', 'startDayDropdown']);
  assert.equal(deduped[0].locator.unstable, true);
  assert.equal(deduped[1].locator.unstable, true);
  assert.match(deduped[0].locator.unstableReason!, /2 elements .* same locator/);
  assert.equal(deduped[2].locator.unstable, undefined, 'an element with its own locator stays untouched');
});

// --- templates are proposals, not requirements ------------------------------------------

test('templatesFrom keeps only the ids a config defines', () => {
  assert.deepEqual(templatesFrom({}), {}, 'no configured templates must propose none');
  assert.deepEqual(templatesFrom({labelledInput: '.x'}), {input: 'labelledInput'});

  // Every kind in the table is reachable when everything is configured, so a kind added to
  // KIND_TEMPLATES without a matching config line shows up here rather than at run time.
  const all = Object.fromEntries(Object.values(KIND_TEMPLATES).map((id) => [id, '.x']));
  assert.deepEqual(templatesFrom(all), KIND_TEMPLATES);
});

test('an unconfigured template drops the element down the ladder rather than throwing', () => {
  // The failure this guards against: `fromMap` throws on a template id the generator config does
  // not define, so proposing one unconditionally made an empty `locatorTemplates:` crash the
  // pipeline on the first unassociated label — over half the elements on a typical app.
  const templateFor = templatesFrom({});

  assert.equal(bestLocatorFor({label: 'City', templateId: KIND_TEMPLATES.input})?.rung, 4);

  // Same element with no template configured: a label alone cannot locate it, so a weaker signal
  // has to carry it, and a lone label yields nothing rather than a broken locator.
  assert.equal(bestLocatorFor({label: 'City', templateId: templateFor.input}), null);
  assert.equal(bestLocatorFor({label: 'City', templateId: templateFor.input, placeholder: 'City'})?.rung, 5);
  assert.equal(bestLocatorFor({label: 'City', templateId: templateFor.input, nameAttr: 'city'})?.rung, 6);
});
