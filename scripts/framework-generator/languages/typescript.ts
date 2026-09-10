// TypeScript language adapter — the fully implemented one.
//
// It renders three kinds of thing from the model: the shared navigation
// component (from the chrome the mapper found on every page), one page object
// per mapped page split into a generated half and a protected half, and a smoke
// spec per page. Everything static lives in ./typescript-runtime.ts.

import { CodeWriter, quote } from '../code-writer.js';
import { renderTemplate } from '../locator-spec.js';
import { safeIdentifier, toKebab, toPascal, toCamel } from '../naming.js';
import { runtimeFiles } from './typescript-runtime.js';
import type { ElementModel, GeneratedFile, GenerationContext, GeneratorConfig, LanguageAdapter, LocatorSpec, Operation, PageModel, RequestSpecSchema, ResourceModel, StateModel } from '../types.js';

const EXT = '.ts';

// component -> class. `dropdown` splits on role because the mapper emits both
// the trigger and its individual options under that one name.
const COMPONENT_CLASS: Record<string, string> = {
  button: 'ButtonComponent',
  link: 'LinkComponent',
  input: 'InputComponent',
  longInput: 'InputComponent',
  checkbox: 'CheckboxComponent',
  switch: 'CheckboxComponent',
  radio: 'RadioComponent',
  tab: 'TabComponent',
  menuItem: 'MenuItemComponent',
  text: 'TextComponent',
  image: 'ImageComponent',
  table: 'TableComponent',
};

const IMPORT_PATH: Record<string, string> = {
  TableComponent: 'components/tables/TableComponent',
};

/**
 * Which static factory can stand in for a mapped locator, per component class.
 *
 * `role` factories are pure Playwright and always available. `template` factories
 * read an app pattern from `locatorTemplates:` and exist only when it is configured.
 * `kind` is the component name the factory bakes into its description, so a factory
 * is only usable for an element of that exact kind — otherwise the description
 * would change.
 */
type ComponentFactory = { method: string; kind: string } & ({ role: 'link' | 'button' | 'radio' | 'tab' | 'heading'; template?: never } | { role?: never; template: string });

const FACTORIES: Record<string, ComponentFactory[]> = {
  LinkComponent: [{ method: 'byLabel', kind: 'link', role: 'link' }],
  ButtonComponent: [{ method: 'byLabel', kind: 'button', role: 'button' }],
  RadioComponent: [{ method: 'byLabel', kind: 'radio', role: 'radio' }],
  TabComponent: [{ method: 'byLabel', kind: 'tab', role: 'tab' }],
  TextComponent: [{ method: 'byHeading', kind: 'text', role: 'heading' }],
  InputComponent: [
    { method: 'byLabel', kind: 'input', template: 'labelledInput' },
    { method: 'textareaByLabel', kind: 'longInput', template: 'labelledTextarea' },
  ],
  DropdownComponent: [{ method: 'byLabel', kind: 'dropdown', template: 'labelledSelect' }],
  MenuItemComponent: [{ method: 'byLabel', kind: 'menuItem', template: 'topNavTab' }],
  TableComponent: [{ method: 'byColumn', kind: 'table', template: 'tableByColumn' }],
};

export const typescript: LanguageAdapter = {
  id: 'typescript',
  extension: EXT,

  emptyDirs: () => ['src/api/clients', 'src/data/factories', 'src/data/testData'],

  staticFiles(context) {
    return [
      ...runtimeFiles(context),
      ...projectFiles(context),
      navigationComponent(context),
      ...fixtureFiles(context),
    ];
  },

  renderPage(page, context) {
    return [
      { path: pagePath(page, '.generated'), contents: generatedPage(page, context), kind: 'generated' },
      { path: pagePath(page, ''), contents: protectedPage(page), kind: 'protected' },
    ];
  },

  renderTest(page, context) {
    if (!context.config.tests.generateSmokeSpecs) return null;
    return { path: `tests/e2e/${page.group}/${toKebab(page.className)}.spec.ts`, contents: smokeSpec(page), kind: 'generated' };
  },

  renderApiClient(resource, context) {
    const files: GeneratedFile[] = [
      { path: `src/data/testData/${resource.className}.types.generated.ts`, contents: dtoTypes(resource), kind: 'generated' },
      { path: `src/api/clients/${resource.className}Client.generated.ts`, contents: generatedApiClient(resource), kind: 'generated' },
      { path: `src/api/clients/${resource.className}Client.ts`, contents: protectedApiClient(resource), kind: 'protected' },
    ];
    if (context.config.api.generateFactories) {
      files.push({ path: `src/data/factories/${toKebab(resource.className)}-factory.ts`, contents: factoryStub(resource), kind: 'protected' });
    }
    return files;
  },

  renderApiTest(resource, context) {
    if (!context.config.api.generateAssertionSpecs) return null;
    return resource.operations.map((op) => ({
      path: `tests/api/${toKebab(resource.className)}/${toKebab(op.operationId)}.spec.ts`,
      contents: assertionSpec(resource, op),
      kind: 'generated',
    }));
  },

  /**
   * The same decision the emitter makes, counted for the report. Asking `factoryFor`
   * rather than re-deriving the rule is the point: the report cannot drift from what
   * was actually written.
   */
  locatorStats(model, config) {
    const byFactory = new Map<string, number>();
    let total = 0;
    let derived = 0;
    const elements = [
      ...model.sharedChrome,
      ...model.sharedStates.flatMap((s) => s.elements),
      ...model.pages.flatMap((p) => [...p.elements, ...p.states.flatMap((s) => s.elements)]),
    ];
    for (const element of elements) {
      total += 1;
      const cls = classFor(element);
      const call = factoryFor(element, cls, 'root', config);
      if (!call) continue;
      derived += 1;
      const key = call.slice(0, call.indexOf('('));
      byFactory.set(key, (byFactory.get(key) ?? 0) + 1);
    }
    return { total, derived, byFactory: [...byFactory].sort((a, b) => b[1] - a[1]) };
  },
};

// ---- page objects ------------------------------------------------------------

function pagePath(page: PageModel, suffix: string): string {
  return `src/pages/${page.group}/${page.fileBase}${suffix}${EXT}`;
}

/**
 * The generated half: an abstract class holding one typed accessor per mapped
 * element. Accessors are getters rather than constructor-assigned fields so a
 * page object stays cheap to build — nothing touches the DOM until it is used.
 */
function generatedPage(page: PageModel, context: GenerationContext): string {
  const w = new CodeWriter();
  const used = new Set<string>();
  const stateClasses = page.states.map((state) => ({
    state,
    className: `${page.className}${toPascal(state.rawName)}`,
    accessor: uniqueAccessor(state.rawName, used),
  }));

  const classes = collectClasses([...page.elements, ...page.states.flatMap((s) => s.elements)]);

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line(`// Source: ${page.slug}`);
  w.line(`// Your own methods belong in ${page.fileBase}${EXT}, which the generator never touches.`);
  w.blank();
  w.line("import type { Page } from '@playwright/test';");
  w.line("import { BasePage } from '../base/BasePage';");
  for (const cls of classes) w.line(`import { ${cls} } from '../../${IMPORT_PATH[cls] ?? `components/${cls}`}';`);
  w.line(`import { NavigationBar } from '../../components/navigation/NavigationBar';`);
  w.blank();

  w.line(`/** ${page.url}${page.aliases.length ? ` (also reachable at ${page.aliases.join(', ')})` : ''} */`);
  w.block(`export abstract class ${page.className}Generated extends BasePage {`, (b) => {
    b.line(`static readonly path = ${quote(page.url)};`);
    if (page.aliases.length) {
      b.line(`static readonly aliases = [${page.aliases.map(quote).join(', ')}] as const;`);
    }
    b.blank();
    b.block('constructor(page: Page) {', (c) => {
      c.line(`super(page, ${page.className}Generated.path);`);
    });
    b.blank();
    b.line('/** Chrome shared by every page: top bar and side menu. */');
    b.line('readonly navigation = new NavigationBar(this.page);');

    for (const element of page.elements) {
      b.blank();
      emitAccessor(b, element, used, 'this.page', context.config);
    }

    for (const { state, className, accessor } of stateClasses) {
      b.blank();
      b.line(`/** Elements revealed by opening ${quote(state.triggerLabel)}. Open the trigger first. */`);
      b.line(`readonly ${accessor} = new ${className}(this.page);`);
    }
  });

  for (const { state, className } of stateClasses) {
    w.blank();
    emitStateClass(w, state, className, context.config);
  }

  return w.toString();
}

function emitStateClass(w: CodeWriter, state: StateModel, className: string, config: GeneratorConfig): void {
  const used = new Set<string>();
  w.line(`/** Only present while ${quote(state.triggerLabel)} is open. */`);
  w.block(`export class ${className} {`, (b) => {
    b.line('constructor(private readonly page: Page) {}');
    for (const element of state.elements) {
      b.blank();
      emitAccessor(b, element, used, 'this.page', config);
    }
  });
}

function emitAccessor(w: CodeWriter, element: ElementModel, used: Set<string>, root: string, config: GeneratorConfig): boolean {
  const name = uniqueAccessor(element.rawName, used);
  const cls = classFor(element);
  const doc = element.label ? `${element.label} (${element.component})` : element.component;

  w.line(`/** ${doc.replace(/\*\//g, '*\\/')} */`);
  if (element.unstable) w.line(`// UNSTABLE: ${element.unstableReason}`);

  const factory = config ? factoryFor(element, cls, root, config) : null;
  const locator = renderLocator(element.locator, root);
  // TableComponent takes its column list between locator and description, and static analysis
  // cannot know a table's columns — so `table` is null for every table the analyzer produces. The
  // arity has to follow the class the accessor returns, or the emitted call will not compile.
  const args = cls === 'TableComponent'
    ? `${locator}, [${columnsOf(element)}], ${quote(doc)}`
    : `${locator}, ${quote(doc)}`;
  w.line(`get ${name}(): ${cls} {`);
  w.indent().line(factory ? `return ${factory};` : `return new ${cls}(${args});`).dedent();
  w.line('}');
  return Boolean(factory);
}

/** The protected half — written once, then left alone forever. */
function protectedPage(page: PageModel): string {
  const w = new CodeWriter();
  w.line(`import { ${page.className}Generated } from './${page.fileBase}.generated';`);
  w.blank();
  w.line('/**');
  w.line(` * ${page.className} — put page-specific actions and assertions here.`);
  w.line(' *');
  w.line(' * The generator created this file once and will never overwrite it. Mapped');
  w.line(` * elements live in ${page.fileBase}.generated${EXT}, which is regenerated on every run.`);
  w.line(' */');
  w.line(`export class ${page.className} extends ${page.className}Generated {}`);
  return w.toString();
}

// ---- locator rendering -------------------------------------------------------

/**
 * Render a locator spec as TypeScript source.
 *
 * The name option is only emitted when the name is non-empty, because that is
 * exactly what the mapper's own resolve() does when it verifies a locator is
 * unique. Emitting `{ name: '' }` instead would produce a different, unverified
 * locator.
 */
function renderLocator(spec: LocatorSpec, root: string): string {
  let expr = spec.within ? renderLocator(spec.within, root) : root;
  const arg = quote(spec.args[0] ?? '');

  switch (spec.strategy) {
    case 'getByRole':
      expr += spec.name
        ? `.getByRole(${arg}, { name: ${quote(spec.name)}, exact: true })`
        : `.getByRole(${arg})`;
      break;
    case 'getByText':
      expr += `.getByText(${arg}, { exact: true })`;
      break;
    case 'css':
      expr += `.locator(${arg})`;
      break;
    default:
      expr += `.${spec.strategy}(${arg})`;
  }
  if (spec.nth != null) expr += `.nth(${spec.nth})`;
  return expr;
}

/**
 * The factory call that reproduces this element's locator exactly, or null.
 *
 * Equivalence is *proved*, never assumed: a role factory has to match the role and
 * the accessible name, and a template factory has to render the byte-identical
 * selector the map already carries. Anything else — a one-off selector, a label the
 * template cannot rebuild, a scoped or positional locator — returns null and keeps
 * the locator the mapper verified. That is what makes this safe to switch on for a
 * whole map at once: a template that stops matching degrades to the old output
 * instead of silently addressing a different element.
 */
function factoryFor(element: ElementModel, cls: string, root: string, config: GeneratorConfig): string | null {
  const spec = element.locator;
  if (spec.within || spec.nth != null || spec.unstable) return null;

  const templates = config.locatorTemplates ?? {};
  for (const factory of FACTORIES[cls] ?? []) {
    if (factory.kind !== element.component) continue;

    if (factory.role) {
      if (spec.strategy !== 'getByRole') continue;
      if (spec.args[0] !== factory.role || spec.name !== element.label) continue;
    } else {
      const pattern = templates[factory.template];
      if (!pattern || spec.strategy !== 'css') continue;
      if (renderTemplate(pattern, element.label) !== spec.args[0]) continue;
    }

    const args = cls === 'TableComponent'
      ? `${root}, ${quote(element.label)}, [${columnsOf(element)}]`
      : `${root}, ${quote(element.label)}`;
    return `${cls}.${factory.method}(${args})`;
  }
  return null;
}

/** An unmapped table is a real table with an unknown column list, not a non-table. */
function columnsOf(element: ElementModel): string {
  return (element.table?.columns ?? []).map(quote).join(', ');
}

function classFor(element: ElementModel): string {
  if (element.component === 'dropdown') {
    return element.locator.args[0] === 'option' ? 'OptionComponent' : 'DropdownComponent';
  }
  return COMPONENT_CLASS[element.component] ?? 'GenericComponent';
}

function collectClasses(elements: ElementModel[]): string[] {
  const set = new Set(elements.map(classFor));
  return [...set].sort();
}

function uniqueAccessor(rawName: string, used: Set<string>): string {
  const base = safeIdentifier(rawName, 'typescript');
  let name = base;
  let n = 2;
  while (used.has(name)) {
    name = `${base}${n}`;
    n += 1;
  }
  used.add(name);
  return name;
}

// ---- shared navigation component ---------------------------------------------

/**
 * The mapper finds the same top bar and side menu on every page. Emitting it
 * once as a component keeps 17 links out of all 28 page objects and gives tests
 * one obvious place to navigate from.
 */
function navigationComponent(context: GenerationContext): GeneratedFile {
  const { sharedChrome, sharedStates } = context.model;
  const w = new CodeWriter();
  const used = new Set<string>();
  const classes = collectClasses([...sharedChrome, ...sharedStates.flatMap((s) => s.elements)]);

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line('//');
  w.line('// Chrome the mapper found on (nearly) every page: the top bar and side menu.');
  w.blank();
  w.line("import type { Page } from '@playwright/test';");
  for (const cls of classes) w.line(`import { ${cls} } from '../${IMPORT_PATH[cls]?.replace('components/', '') ?? cls}';`);
  w.blank();

  w.block('export class NavigationBar {', (b) => {
    b.line('constructor(private readonly page: Page) {}');
    for (const element of sharedChrome) {
      b.blank();
      emitAccessor(b, element, used, 'this.page', context.config);
    }
    for (const state of sharedStates) {
      for (const element of state.elements) {
        b.blank();
        b.line(`// revealed by opening ${quote(state.triggerLabel)}`);
        emitAccessor(b, element, used, 'this.page', context.config);
      }
    }
  });

  return { path: 'src/components/navigation/NavigationBar.ts', contents: w.toString(), kind: 'generated' };
}

// ---- fixtures ----------------------------------------------------------------

function fixtureFiles(context: GenerationContext): GeneratedFile[] {
  const pages = context.model.pages;
  const resources = context.apiModel.resources;
  const w = new CodeWriter();

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line('//');
  w.line('// One fixture per page object, plus `api` for the setup, teardown and');
  w.line('// assertions that do not need a browser, and one typed fixture per api-mapped');
  w.line('// resource. Playwright builds only the ones a test asks for, so declaring all');
  w.line('// of them costs nothing at run time.');
  w.blank();
  w.line("import { test as base } from '@playwright/test';");
  w.line("import { ApiClient } from '../api/clients/ApiClient';");
  for (const resource of resources) {
    w.line(`import { ${resource.className}Client } from '../api/clients/${resource.className}Client';`);
  }
  for (const page of pages) {
    w.line(`import { ${page.className} } from '../pages/${page.group}/${page.fileBase}';`);
  }
  w.blank();
  w.block('export type PageObjects = {', (b) => {
    b.line('api: ApiClient;');
    for (const resource of resources) b.line(`${toCamel(resource.className)}Api: ${resource.className}Client;`);
    for (const page of pages) b.line(`${toCamel(page.className)}: ${page.className};`);
  }, '};');
  w.blank();
  w.block('export const test = base.extend<PageObjects>({', (b) => {
    b.line('api: async ({ request }, use) => { await use(new ApiClient(request)); },');
    for (const resource of resources) {
      b.line(`${toCamel(resource.className)}Api: async ({ request }, use) => { await use(new ${resource.className}Client(request)); },`);
    }
    for (const page of pages) {
      b.line(`${toCamel(page.className)}: async ({ page }, use) => { await use(new ${page.className}(page)); },`);
    }
  }, '});');
  w.blank();
  w.line("export { expect } from '@playwright/test';");

  return [
    { path: 'src/fixtures/page-fixtures.ts', contents: w.toString(), kind: 'generated' },
    { path: 'src/fixtures/auth-fixtures.ts', contents: authFixture(context), kind: 'generated' },
    { path: 'src/fixtures/index.ts', contents: FIXTURE_INDEX, kind: 'generated' },
    { path: 'src/fixtures/extra-fixtures.ts', contents: EXTRA_FIXTURES, kind: 'protected' },
    { path: 'src/fixtures/global-setup.ts', contents: globalSetup(context), kind: 'generated' },
  ];
}

const FIXTURE_INDEX = `// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.
//
// Hand-written fixtures go in extra-fixtures.ts, which is written once and never
// touched again; the test object below is re-exported from there so a spec only
// ever imports from './fixtures'.
export { test } from './extra-fixtures';
export { expect } from '@playwright/test';
export type { PageObjects } from './page-fixtures';
export { login, STORAGE_STATE } from './auth-fixtures';
export { ApiClient } from '../api/clients/ApiClient';
export { expectResponse, expectJson } from '../utils/network';
export { uniqueSuffix, uniqueUsername, uniqueEmail, uniqueName } from '../utils/testData';
`;

/**
 * The one fixture file the generator writes once and then leaves alone.
 *
 * page-fixtures.ts is regenerated from the map on every run, so a hand-added
 * page object would not survive there. It goes here instead, and index.ts
 * re-exports this `test` rather than the generated one.
 */
const EXTRA_FIXTURES = `import { test as generated } from './page-fixtures';

// Add hand-written fixtures here: one property per fixture, then wire it in the
// extend() call below. Empty until a scenario needs one.
export interface ExtraFixtures {}

export const test = generated.extend<ExtraFixtures>({});
`;

/**
 * The login flow is not in the application map — the mapper logs in before it
 * starts crawling. It is in the mapper's own spec file, so the generator reads
 * the locators from there and emits a real, working login helper rather than a
 * TODO. Credentials come from the environment, never from generated source.
 */
function authFixture(context: GenerationContext): string {
  const login = context.config.login;
  const w = new CodeWriter();

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.blank();
  w.line("import type { Page } from '@playwright/test';");
  w.line("import { requiredEnv } from '../utils/env';");
  w.blank();
  w.line("export const STORAGE_STATE = '.auth/state.json';");
  w.blank();

  if (!login) {
    w.line('/** No login flow was configured — set `loginConfig:` in generator-config.yaml. */');
    w.block('export async function login(page: Page): Promise<void> {', (b) => {
      b.line("throw new Error('No login flow configured. Point loginConfig: at your mapper spec and regenerate.');");
    });
    return w.toString();
  }

  w.line('/** Log in with the flow the mapper uses, reading credentials from the environment. */');
  w.block('export async function login(page: Page): Promise<void> {', (b) => {
    b.line('// A cold first paint is the slowest moment in the whole suite. Gate on the');
    b.line('// document rather than on `load`, then wait for the field itself with more');
    b.line('// room than an action timeout — waiting for every asset to finish downloading');
    b.line('// times out on a slow app long before the form is actually unusable.');
    b.line(`await page.goto(${quote(login.loginUrl)}, { waitUntil: 'domcontentloaded' });`);
    b.line(`await ${renderLocator(login.usernameLocator, 'page')}.waitFor({ state: 'visible', timeout: 60_000 });`);
    b.line(`await ${renderLocator(login.usernameLocator, 'page')}.fill(requiredEnv('APP_USERNAME'));`);
    b.line(`await ${renderLocator(login.passwordLocator, 'page')}.fill(requiredEnv('APP_PASSWORD'));`);
    b.line(`await ${renderLocator(login.submitLocator, 'page')}.click();`);
    if (login.successSignal) {
      b.line(`await ${renderLocator(login.successSignal, 'page')}.waitFor({ state: 'visible' });`);
    } else {
      b.line("await page.waitForLoadState('load');");
    }
  });
  return w.toString();
}

function globalSetup(context: GenerationContext): string {
  const w = new CodeWriter();
  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line('//');
  w.line('// Logs in once before the suite and saves the session, so specs start authenticated.');
  w.blank();
  w.line("import { chromium, type FullConfig } from '@playwright/test';");
  w.line("import { login, STORAGE_STATE } from './auth-fixtures';");
  w.blank();
  w.block('export default async function globalSetup(config: FullConfig): Promise<void> {', (b) => {
    b.line('const { baseURL } = config.projects[0].use;');
    b.line('const browser = await chromium.launch();');
    b.block('try {', (c) => {
      c.line('const page = await browser.newPage({ baseURL });');
      c.line('await login(page);');
      c.line('await page.context().storageState({ path: STORAGE_STATE });');
    }, '} finally {');
    b.indent().line('await browser.close();').dedent();
    b.line('}');
  });
  return w.toString();
}

// ---- smoke specs -------------------------------------------------------------

/**
 * A minimal but genuine test: navigate and assert a mapped heading is visible.
 * Its real job is to prove the generated page object compiles and its locators
 * resolve against the live app.
 */
function smokeSpec(page: PageModel): string {
  const heading = page.elements.find((e) => e.component === 'text');
  const fixture = toCamel(page.className);
  const needsParams = /\{\w+\}/.test(page.url);
  const w = new CodeWriter();

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line('// Add real scenarios in sibling spec files; those are yours to keep.');
  w.blank();
  w.line("import { test, expect } from '../../../src/fixtures';");
  w.blank();
  w.block(`test.describe(${quote(page.className)}, () => {`, (b) => {
    b.block(`test('loads', async ({ ${fixture} }) => {`, (c) => {
      if (needsParams) {
        c.line(`test.fixme(true, ${quote(`'${page.url}' needs a real record id — call ${fixture}.goto({ ... }) from a flow that created one`)});`);
      }
      c.line(`await ${fixture}.goto();`);
      if (heading) {
        const accessor = safeIdentifier(heading.rawName, 'typescript');
        c.line(`await expect(${fixture}.${accessor}.locator).toBeVisible();`);
      } else {
        c.line(`await expect(${fixture}.page).toHaveURL(new RegExp(${quote(escapeRegex(page.url))}));`);
      }
    }, '});');
  }, '});');
  return w.toString();
}

function escapeRegex(value: string): string {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---- api layer -----------------------------------------------------------------

/** RequestSpecSchema -> a TS type expression. Object schemas get a name so nested types read well. */
function tsType(schema: RequestSpecSchema | null, name: string): string {
  if (!schema) return 'unknown';
  if (schema.kind === 'primitive') return schema.type;
  if (schema.kind === 'array') return `${tsType(schema.items, name)}[]`;
  const props = schema.properties.map((p) => `${safeIdentifier(p.name, 'typescript')}${p.required ? '' : '?'}: ${p.nullable ? `${tsPrimitive(p.type)} | null` : tsPrimitive(p.type)};`);
  return props.length ? `{ ${props.join(' ')} }` : 'Record<string, never>';
}

function tsPrimitive(type: string): string {
  return ['string', 'number', 'boolean'].includes(type) ? type : 'unknown';
}

/** The successful-response schema — the smallest 2xx status, since that is the shape callers care about. */
function successSchema(op: Operation): RequestSpecSchema | null {
  const ok = op.responses.filter((r) => r.status >= 200 && r.status < 300 && r.schema).sort((a, b) => a.status - b.status);
  return ok[0]?.schema ?? null;
}

function requestTypeName(op: Operation): string {
  return `${toPascal(op.operationId)}Request`;
}

function responseTypeName(op: Operation): string {
  return `${toPascal(op.operationId)}Response`;
}

/** DTOs for a resource: one request/response interface pair per operation that has a body/schema. */
function dtoTypes(resource: ResourceModel): string {
  const w = new CodeWriter();
  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line(`// Source: ${resource.source} api-map for '${resource.resource}'.`);
  w.blank();

  for (const op of resource.operations) {
    if (op.requestBody) {
      w.line(`export type ${requestTypeName(op)} = ${tsType(op.requestBody.schema, requestTypeName(op))};`);
      w.blank();
    }
    const schema = successSchema(op);
    if (schema) {
      w.line(`export type ${responseTypeName(op)} = ${tsType(schema, responseTypeName(op))};`);
      w.blank();
    }
  }
  return w.toString();
}

/** `/users/{id}` + pathParams -> a template literal expression, e.g. `\`/users/${id}\`` */
function pathExpression(op: Operation): string {
  let expr = op.path;
  for (const p of op.pathParams) expr = expr.replace(`{${p.name}}`, `\${${safeIdentifier(p.name, 'typescript')}}`);
  return `\`${expr}\``;
}

function methodParams(op: Operation): string {
  const parts = [...op.pathParams.map((p) => `${safeIdentifier(p.name, 'typescript')}: ${tsPrimitive(p.type)}`)];
  if (op.requestBody) parts.push(`body: ${requestTypeName(op)}`);
  if (op.queryParams.length) {
    const q = op.queryParams.map((p) => `${safeIdentifier(p.name, 'typescript')}${p.required ? '' : '?'}: ${tsPrimitive(p.type)}`);
    const allOptional = op.queryParams.every((p) => !p.required);
    parts.push(`query: { ${q.join('; ')} }${allOptional ? ' = {}' : ''}`);
  }
  return parts.join(', ');
}

function callArgs(op: Operation): string {
  const path = op.queryParams.length ? `${pathExpression(op)} + queryString(query)` : pathExpression(op);
  return op.requestBody ? `${path}, body` : path;
}

/** Placeholder call args for a generated assertion spec: real path/query values are for you to fill in. */
function sampleCallArgs(op: Operation): string {
  const args = op.pathParams.map(() => `${quote('REPLACE_ME')} as never`);
  if (op.requestBody) args.push('{} as never');
  if (op.queryParams.length) args.push(op.queryParams.some((p) => p.required) ? '{} as never' : '{}');
  return args.join(', ');
}

/** The generated half of a resource's typed client: one method per api-mapped operation. */
function generatedApiClient(resource: ResourceModel): string {
  const w = new CodeWriter();
  const hasQuery = resource.operations.some((op) => op.queryParams.length > 0);

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line(`// Source: ${resource.source} api-map for '${resource.resource}'.`);
  w.line(`// Your own methods belong in ${resource.className}Client.ts, which the generator never touches.`);
  w.blank();
  w.line("import type { APIRequestContext, APIResponse } from '@playwright/test';");
  w.line("import { ApiClient } from './ApiClient';");
  const typeNames = resource.operations.flatMap((op) => [
    op.requestBody ? requestTypeName(op) : null,
    successSchema(op) ? responseTypeName(op) : null,
  ]).filter(Boolean);
  if (typeNames.length) w.line(`import type { ${typeNames.join(', ')} } from '../../data/testData/${resource.className}.types.generated';`);
  w.blank();

  w.block(`export abstract class ${resource.className}ClientGenerated extends ApiClient {`, (b) => {
    b.block('constructor(request: APIRequestContext) {', (c) => { c.line('super(request);'); });
    for (const op of resource.operations) {
      b.blank();
      b.line(`/** ${op.method} ${op.path} */`);
      b.block(`async ${op.safeId}(${methodParams(op)}): Promise<APIResponse> {`, (c) => {
        c.line(`return this.${op.method.toLowerCase()}(${callArgs(op)});`);
      });
    }
  });

  if (hasQuery) {
    w.blank();
    w.block('function queryString(params: Record<string, unknown>): string {', (b) => {
      b.line('const entries = Object.entries(params).filter(([, v]) => v !== undefined);');
      b.line("if (entries.length === 0) return '';");
      b.line("return `?${entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')}`;");
    });
  }
  return w.toString();
}

/** The protected half — written once, then left alone forever. */
function protectedApiClient(resource: ResourceModel): string {
  const w = new CodeWriter();
  w.line(`import { ${resource.className}ClientGenerated } from './${resource.className}Client.generated';`);
  w.blank();
  w.line('/**');
  w.line(` * ${resource.className}Client — add resource-specific helpers/assertions here.`);
  w.line(' *');
  w.line(` * The generator created this file once and will never overwrite it. Mapped`);
  w.line(` * operations live in ${resource.className}Client.generated.ts, regenerated every run.`);
  w.line(' */');
  w.line(`export class ${resource.className}Client extends ${resource.className}ClientGenerated {}`);
  return w.toString();
}

/**
 * A scaffolded stub, not a working factory: the api-map knows the request
 * shape, not which values make a valid record for this app, so this file is
 * protected from the start and left for you to fill in.
 */
function factoryStub(resource: ResourceModel): string {
  const w = new CodeWriter();
  const creators = resource.operations.filter((op) => op.method === 'POST' && op.requestBody);
  w.line("import type { APIResponse } from '@playwright/test';");
  w.line(`import type { ${resource.className}Client } from '../../api/clients/${resource.className}Client';`);
  if (creators.length) {
    w.line(`import type { ${creators.map(requestTypeName).join(', ')} } from '../testData/${resource.className}.types.generated';`);
  }
  w.blank();
  w.line('/**');
  w.line(` * Precondition/setup helpers for ${resource.resource}, backed by the typed API client`);
  w.line(' * instead of the browser. Fill in real field values per creator below — the');
  w.line(' * api-map only knows the request shape, not what makes a valid record here.');
  w.line(' * Written once by the generator; never overwritten.');
  w.line(' */');
  w.blank();
  if (creators.length === 0) {
    w.line(`// ${resource.resource} has no POST operation in the api-map yet — nothing to scaffold.`);
    return w.toString();
  }
  for (const op of creators) {
    const pathArgs = op.pathParams.map((p) => `${safeIdentifier(p.name, 'typescript')}: ${tsPrimitive(p.type)}`);
    const signature = ['client: ' + `${resource.className}Client`, ...pathArgs, `overrides: Partial<${requestTypeName(op)}> = {}`].join(', ');
    const forwardArgs = [...op.pathParams.map((p) => safeIdentifier(p.name, 'typescript')), 'body'];
    if (op.queryParams.length) forwardArgs.push(op.queryParams.some((p) => p.required) ? '{} as never' : '{}');

    w.block(`export async function ${op.safeId}(${signature}): Promise<APIResponse> {`, (b) => {
      b.line('// TODO: fill in required fields with sensible defaults, then spread overrides.');
      b.line(`const body = { ...overrides } as ${requestTypeName(op)};`);
      b.line(`return client.${op.safeId}(${forwardArgs.join(', ')});`);
    });
    w.blank();
  }
  return w.toString();
}

/** A generated, regenerable status/schema check — one per api-mapped operation. */
function assertionSpec(resource: ResourceModel, op: ResourceModel['operations'][number]): string {
  const w = new CodeWriter();
  const fixture = `${toCamel(resource.className)}Api`;
  const schema = successSchema(op);
  const expectStatus = op.responses.find((r) => r.status >= 200 && r.status < 300)?.status ?? 200;

  w.line('// AUTO-GENERATED by framework-generator. Do not edit — every run overwrites this file.');
  w.line('// Add real scenarios in sibling spec files; those are yours to keep.');
  w.blank();
  w.line("import { test, expect } from '../../../src/fixtures';");
  if (schema) w.line("import { assertShape } from '../../../src/utils/schema-assert';");
  w.blank();
  w.block(`test.describe(${quote(`${resource.resource} — ${op.operationId}`)}, () => {`, (b) => {
    b.block(`test('${op.method} ${op.path} responds ${expectStatus}', async ({ ${fixture} }) => {`, (c) => {
      if (op.requestBody) c.line('// TODO: fill in a valid request body.');
      const call = `${fixture}.${op.safeId}(${sampleCallArgs(op)})`;
      c.line(`const response = await ${call};`);
      c.line(`expect(response.status()).toBe(${expectStatus});`);
      if (schema) {
        c.line('const body = await response.json();');
        c.line(`assertShape(body, ${JSON.stringify(schema)});`);
      }
    }, '});');
  }, '});');
  return w.toString();
}

// ---- project files -----------------------------------------------------------

function projectFiles(context: GenerationContext): GeneratedFile[] {
  const { projectName, baseUrl } = context.config;
  return [
    { path: 'package.json', contents: packageJson(projectName), kind: 'protected' },
    { path: 'tsconfig.json', contents: TSCONFIG, kind: 'protected' },
    { path: 'playwright.config.ts', contents: playwrightConfig(baseUrl), kind: 'protected' },
    { path: '.env.example', contents: envExample(baseUrl), kind: 'protected' },
    { path: '.gitignore', contents: GITIGNORE, kind: 'protected' },
    { path: 'README.md', contents: readme(context), kind: 'generated' },
  ];
}

function packageJson(projectName: string): string {
  return `${JSON.stringify({
    name: projectName,
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      test: 'playwright test',
      'test:headed': 'playwright test --headed',
      'test:ui': 'playwright test --ui',
      report: 'playwright show-report',
      typecheck: 'tsc --noEmit',
    },
    devDependencies: {
      '@playwright/test': '^1.49.0',
      '@types/node': '^22.10.0',
      dotenv: '^16.4.7',
      typescript: '^5.7.0',
    },
  }, null, 2)}\n`;
}

const TSCONFIG = `${JSON.stringify({
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022', 'DOM'],
    module: 'ESNext',
    moduleResolution: 'bundler',
    strict: true,
    noUnusedLocals: false,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    types: ['node'],
    noEmit: true,
  },
  include: ['src/**/*.ts', 'tests/**/*.ts', 'playwright.config.ts'],
}, null, 2)}\n`;

function playwrightConfig(baseUrl: string): string {
  return `import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const baseURL = process.env.BASE_URL ?? ${quote(baseUrl)};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Deliberately conservative. A test suite is only as parallel as the app under
  // test can serve; oversubscribing a slow environment produces timeouts that
  // look like product bugs. Raise it once you know the app keeps up.
  workers: process.env.CI ? 4 : 2,
  forbidOnly: !!process.env.CI,
  // Retries reduce noise in CI; they do not fix a flaky test. A test that needs a
  // second attempt to pass is still broken — fix the wait, not the retry count.
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  globalSetup: './src/fixtures/global-setup.ts',
  // Web-first assertions retry until this window elapses, which is what makes
  // them safe to use in place of an explicit wait.
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    storageState: '.auth/state.json',
    // Not 'on-first-retry': retries are CI-only, so that setting records nothing
    // for the local failure you are actually trying to debug.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
`;
}

function envExample(baseUrl: string): string {
  return `# Copy to .env and fill in. Never commit .env.
BASE_URL=${baseUrl}

# The account globalSetup authenticates as, shared by every test.
APP_USERNAME=
APP_PASSWORD=

# Extra accounts, for scenarios that need a second role.
ADMIN_USERNAME=
ADMIN_PASSWORD=
ESS_USERNAME=
ESS_PASSWORD=

# An existing record the app already holds, for flows that must reference one.
APP_EMPLOYEE_NAME=
`;
}

const GITIGNORE = `node_modules/
test-results/
playwright-report/
blob-report/
.auth/
.env
`;

function readme(context: GenerationContext): string {
  const { stats, pages } = context.model;
  return `# ${context.config.projectName}

Playwright framework generated by \`framework-generator\` from the application map
in \`${context.config.mapDir}\`.

## Layout

- \`src/components/\` — reusable component library. Hand-written, identical for every app.
- \`src/pages/<module>/<Name>Page.generated.ts\` — mapped elements. **Regenerated every run.**
- \`src/pages/<module>/<Name>Page.ts\` — your page-specific actions. **Never overwritten.**
- \`src/fixtures/\` — one Playwright fixture per page object, plus login and global setup.
- \`tests/e2e/\` — generated smoke specs; add your own scenarios alongside them.

## Getting started

\`\`\`bash
npm install
npx playwright install chromium
cp .env.example .env      # then fill in APP_USERNAME / APP_PASSWORD
npm run typecheck
npm test
\`\`\`

## What was generated

${pages.length} page object(s) from ${stats.files} mapped page(s), ${stats.elementsRead} element(s) read.
${stats.skippedNoLocator} element(s) had no locator and were skipped. ${stats.unstable} locator(s) are
positional and marked \`// UNSTABLE\` — see \`GENERATION-REPORT.md\`.

Re-run the generator after every fresh crawl. Only \`.generated.ts\` files change.
`;
}
