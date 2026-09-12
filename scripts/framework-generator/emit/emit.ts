// app-model.json in, a Playwright project out. The generator never reads the app, the
// crawl or the repo: everything it needs was decided by compile-model.ts.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FileWriter } from '../file-writer.js';
import type { AppModel, Screen, ComponentUse } from '../../model-compiler/model-types.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNTIME = join(HERE, 'runtime');

const pascal = (s: string) => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ')
  .filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join('');
const camel = (s: string) => { const p = pascal(s); return p ? p[0].toLowerCase() + p.slice(1) : ''; };
const q = (s: string) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

const HEADER = (model: AppModel) =>
  `// GENERATED — rewritten on every run. Put nothing here you want to keep.\n` +
  `// Source: analysis/${model.app.name}/app-model.json (${model.app.repoCommit.slice(0, 10)})\n`;

/** Every file under emit/runtime/ is copied verbatim: it is ordinary, reviewable code. */
function runtimeFiles(dir = RUNTIME, prefix = 'src'): { path: string; contents: string }[] {
  const out: { path: string; contents: string }[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...runtimeFiles(full, `${prefix}/${entry}`));
    else out.push({ path: `${prefix}/${entry}`, contents: readFileSync(full, 'utf8') });
  }
  return out;
}

/** The module folder a screen lives in: its first real path segment. */
function moduleOf(path: string): string {
  const seg = path.split('/').filter(s => s && !/^[:{]/.test(s))[0] ?? 'home';
  return camel(seg) || 'home';
}

function useExpression(use: ComponentUse, model: AppModel, screen: Screen): string {
  const ctx = `{ screen: ${q(screen.name)}, expectedUrl: ${q(screen.path)}, modelPath: MODEL_PATH }`;
  const def = model.components[use.component];
  if (def?.kind === 'collection') {
    return `new ${use.component}(this.page, ${q(use.as)}, { shape: TABLE_SHAPE, ` +
      `columns: ${JSON.stringify(use.columns ?? [])}, keyColumn: ${use.keyColumn ? q(use.keyColumn) : 'null'}, ` +
      `screen: ${q(screen.name)}, expectedUrl: ${q(screen.path)}, modelPath: MODEL_PATH })`;
  }
  if (def?.kind === 'region') return `new ${use.component}(this.page, ${ctx})`;
  const identity: string[] = [];
  if (use.label) identity.push(`label: ${q(use.label)}`);
  if (use.field) identity.push(`field: ${q(use.field)}`);
  if (use.within) identity.push(`within: ${q(use.within)}`);
  return `new ${use.component}(this.page, { ${identity.join(', ')} }, ${ctx})`;
}

function renderPage(screen: Screen, model: AppModel): string {
  const used = [...new Set(screen.uses.map(u => u.component))];
  const fieldKinds = used.filter(c => model.components[c]?.kind === 'field');
  const regions = used.filter(c => model.components[c]?.kind === 'region');
  const collections = used.filter(c => model.components[c]?.kind === 'collection');

  const imports = [
    `import type { Page } from '@playwright/test';`,
    `import { BasePage } from '../BasePage.ts';`,
    `import { MODEL_PATH } from '../../config/constants.ts';`,
  ];
  if (fieldKinds.length) imports.push(`import { ${fieldKinds.sort().join(', ')} } from '../../components/fields.ts';`);
  for (const r of regions.sort()) imports.push(`import { ${r} } from '../../components/${r}.generated.ts';`);
  if (collections.length) {
    imports.push(`import { RecordTable } from '../../components/RecordTable.ts';`);
    imports.push(`import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';`);
  }

  const members = screen.uses.map(u =>
    `  readonly ${u.as} = ${useExpression(u, model, screen)};`);

  const actions = screen.actions.map(a =>
    `  /** Proved by the crawl: this control leads to ${a.leadsTo}. */\n` +
    `  async ${a.name}(): Promise<void> {\n` +
    `    await this.${a.via}.click();\n` +
    `    await this.page.waitForURL(url => url.href.includes(${q(model.screens.find(s => s.name === a.leadsTo)!.path)}));\n` +
    `  }`);

  const notes: string[] = [];
  if (!screen.crawled) {
    notes.push(
      `  // This route is declared in the app's source but the crawl never reached it, so`,
      `  // it has a URL and nothing else. Crawl the screen to fill it in.`);
  }
  if (screen.unverified) {
    notes.push(
      `  // ${screen.unverified} element(s) on this screen carry no label, role name or field`,
      `  // identifier, so nothing here addresses them. Record the flow that uses one and add`,
      `  // a scoped accessor in ${screen.name}.ts.`);
  }

  return [
    HEADER(model),
    imports.join('\n'),
    '',
    `export class ${screen.name}Generated extends BasePage {`,
    `  readonly path = ${q(screen.path)};`,
    `  readonly heading = ${screen.identity.heading ? q(screen.identity.heading) : 'null'};`,
    '',
    ...notes,
    members.join('\n'),
    members.length && actions.length ? '' : '',
    actions.join('\n\n'),
    '',
    `  constructor(page: Page) {`,
    `    super(page);`,
    `  }`,
    `}`,
    '',
  ].filter(l => l !== undefined).join('\n');
}

function renderPageSubclass(screen: Screen): string {
  return [
    `// Yours. The generator writes this once and never touches it again — put actions,`,
    `// assertions and anything the analysis could not know here.`,
    `import { ${screen.name}Generated } from './${screen.name}.generated.ts';`,
    '',
    `export class ${screen.name} extends ${screen.name}Generated {}`,
    '',
  ].join('\n');
}

function renderRegion(name: string, model: AppModel): string {
  const def = model.components[name];
  const controls = Object.entries(def.controls ?? {});
  const body = controls.map(([prop, spec]) => {
    const expr = spec.strategy === 'role'
      ? `this.locator().getByRole(${q(spec.args[0])}, { name: ${q(spec.args[1])}, exact: true })`
      : spec.strategy === 'testId' ? `this.locator().getByTestId(${q(spec.args[0])})`
      : spec.strategy === 'label' ? `this.locator().getByLabel(${q(spec.args[0])}, { exact: true })`
      : spec.strategy === 'placeholder' ? `this.locator().getByPlaceholder(${q(spec.args[0])}, { exact: true })`
      : spec.strategy === 'text' ? `this.locator().getByText(${q(spec.args[0])}, { exact: true })`
      : `this.locator().locator(${q(spec.args[0])})`;
    return `  get ${prop}(): Locator {\n    return ${expr};\n  }`;
  });
  const actions = ((def as any).actions ?? []).map((a: any) =>
    `  async ${a.name}(): Promise<void> {\n` +
    `    await this.click(${q(a.via)});\n` +
    `  }`);
  return [
    HEADER(model),
    `import type { Locator, Page } from '@playwright/test';`,
    `import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';`,
    '',
    `/** ${def.description}. This class owns the only selector for this region. */`,
    `export class ${name} extends BaseComponent {`,
    `  constructor(page: Page, context: ComponentContext = {}) {`,
    `    super(page, ${q(name)}, context);`,
    `  }`,
    '',
    `  locator(): Locator {`,
    `    return this.page.locator(${q(def.root?.args[0] ?? 'body')});`,
    `  }`,
    '',
    body.join('\n\n'),
    '',
    `  /** Click one of this region's controls by name, with the shared diagnostics. */`,
    `  async click(control: ${controls.map(([p]) => q(p)).join(' | ') || 'string'}): Promise<void> {`,
    `    await this.act(\`click \${control}\`, async () => {`,
    `      await (this as unknown as Record<string, Locator>)[control].click();`,
    `    });`,
    `  }`,
    actions.length ? '\n' + actions.join('\n\n') : '',
    `}`,
    '',
  ].join('\n');
}

function renderTemplates(model: AppModel, conventions: any): string {
  const table = Object.values(model.components).find(c => c.kind === 'collection');
  return [
    HEADER(model),
    `// The only file in this project that names an app-specific selector. Everything`,
    `// else addresses controls by label, role or field name.`,
    '',
    `/** How this app associates a label with its input, where it uses no <label for>. */`,
    `export const FIELD_TEMPLATE = ${conventions?.labelAssociation?.preferredTemplate
      ? q(conventions.labelAssociation.preferredTemplate) : 'null'};`,
    '',
    `export const TABLE_SHAPE = {`,
    `  root: ${q(table?.root?.args[0] ?? 'table')},`,
    `  row: ${q(table?.table?.row ?? 'tbody tr')},`,
    `  cell: ${q(table?.table?.cell ?? 'td')},`,
    `  headerCell: ${q(table?.table?.headerCell ?? 'thead th')},`,
    `  rowKeyAttribute: ${table?.table?.rowKeyAttribute ? q(table.table.rowKeyAttribute) : 'undefined'},`,
    `};`,
    '',
  ].join('\n');
}

function staticProject(model: AppModel): { path: string; contents: string; kind: 'generated' | 'protected' }[] {
  const auth: any = model.api.auth ?? {};
  const ui = auth.uiLogin;
  return [
    {
      path: 'package.json', kind: 'protected',
      contents: JSON.stringify({
        name: `${model.app.name}-tests`, private: true, type: 'module',
        scripts: {
          test: 'playwright test', 'test:headed': 'playwright test --headed',
          'test:ui': 'playwright test --ui', report: 'playwright show-report',
          typecheck: 'tsc --noEmit',
        },
        devDependencies: { '@playwright/test': '^1.56.0', '@types/node': '^22.20.1', typescript: '^5.9.2' },
      }, null, 2) + '\n',
    },
    {
      path: 'tsconfig.json', kind: 'generated',
      contents: JSON.stringify({
        compilerOptions: {
          target: 'ES2022', module: 'ESNext', moduleResolution: 'bundler',
          allowImportingTsExtensions: true, strict: true, noEmit: true,
          skipLibCheck: true, types: ['node'],
        },
        include: ['src', 'tests', 'playwright.config.ts'],
      }, null, 2) + '\n',
    },
    {
      path: 'playwright.config.ts', kind: 'generated',
      contents: [
        HEADER(model),
        `import { defineConfig, devices } from '@playwright/test';`,
        '',
        `export default defineConfig({`,
        `  testDir: './tests',`,
        `  fullyParallel: true,`,
        `  retries: process.env.CI ? 1 : 0,`,
        `  reporter: [['list'], ['html', { open: 'never' }]],`,
        `  use: {`,
        `    baseURL: process.env.BASE_URL ?? ${q(model.app.baseUrl)},`,
        `    trace: 'retain-on-failure',`,
        `    screenshot: 'only-on-failure',`,
        ui ? `    storageState: ${q('.auth/user.json')},` : '',
        `  },`,
        ui ? `  projects: [\n    { name: 'setup', testMatch: /auth\\.setup\\.ts/, use: { storageState: undefined } },\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },\n  ],`
           : `  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],`,
        `});`,
        '',
      ].filter(Boolean).join('\n'),
    },
    {
      path: 'src/config/constants.ts', kind: 'generated',
      contents: [
        HEADER(model),
        `export const APP_NAME = ${q(model.app.name)};`,
        `export const BASE_URL = ${q(model.app.baseUrl)};`,
        `/** Every diagnostic names this file, so a failure can be traced to its analysis. */`,
        `export const MODEL_PATH = ${q(`analysis/${model.app.name}/app-model.json`)};`,
        `export const ANALYSED_COMMIT = ${q(model.app.repoCommit)};`,
        '',
      ].join('\n'),
    },
    {
      path: '.env.example', kind: 'protected',
      contents: `APP_USERNAME=\nAPP_PASSWORD=\nBASE_URL=${model.app.baseUrl}\n`,
    },
    {
      path: '.gitignore', kind: 'protected',
      contents: `node_modules/\ntest-results/\nplaywright-report/\n.auth/\n.env\n`,
    },
    ...(ui ? [{
      path: 'tests/auth.setup.ts', kind: 'generated' as const,
      contents: [
        HEADER(model),
        `// Logs in once per run and saves the session, so no spec pays for a login.`,
        `// The steps come from analysis/${model.app.name}/app-profile.yaml; credentials never do.`,
        `import { test as setup, expect } from '@playwright/test';`,
        '',
        `setup('authenticate', async ({ page }) => {`,
        `  await page.goto(${q(ui.loginUrl ?? model.app.baseUrl)});`,
        ...(ui.steps ?? []).map((s: any) => {
          const value = typeof s.value === 'string' && s.value.startsWith('env:')
            ? `process.env.${s.value.slice(4)} ?? ''` : q(s.value ?? '');
          if (s.action === 'fill') return `  await page.locator(${q(s.selector)}).fill(${value});`;
          if (s.action === 'select') return `  await page.locator(${q(s.selector)}).selectOption(${value});`;
          return `  await page.locator(${q(s.selector)}).click();`;
        }),
        ui.readyWhen ? `  await expect(page.locator(${q(ui.readyWhen)}).first()).toBeVisible({ timeout: 30_000 });` : '',
        `  await page.context().storageState({ path: '.auth/user.json' });`,
        `});`,
        '',
      ].filter(Boolean).join('\n'),
    }] : []),
  ];
}

export function emit(model: AppModel, conventions: any, outputDir: string, { dryRun = false } = {}) {
  const writer = new FileWriter(outputDir, { dryRun });

  for (const f of runtimeFiles()) writer.write({ ...f, kind: 'generated' });
  writer.write({ path: 'src/components/locator-templates.generated.ts', contents: renderTemplates(model, conventions), kind: 'generated' });

  for (const [name, def] of Object.entries(model.components)) {
    if (def.kind !== 'region') continue;
    writer.write({ path: `src/components/${name}.generated.ts`, contents: renderRegion(name, model), kind: 'generated' });
  }

  for (const screen of model.screens) {
    const dir = `src/pages/${moduleOf(screen.path)}`;
    writer.write({ path: `${dir}/${screen.name}.generated.ts`, contents: renderPage(screen, model), kind: 'generated' });
    writer.write({ path: `${dir}/${screen.name}.ts`, contents: renderPageSubclass(screen), kind: 'protected' });
  }

  const index = model.screens
    .map(s => `export { ${s.name} } from './${moduleOf(s.path)}/${s.name}.ts';`)
    .sort().join('\n');
  writer.write({ path: 'src/pages/index.ts', contents: HEADER(model) + index + '\n', kind: 'generated' });

  for (const f of staticProject(model)) writer.write(f);
  writer.ensureDir('tests/e2e');

  return writer;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const appIdx = process.argv.indexOf('--app');
  if (appIdx < 0) { console.error('usage: emit.ts --app <name> [--dry-run]'); process.exit(2); }
  const app = process.argv[appIdx + 1];
  const dryRun = process.argv.includes('--dry-run');
  const model: AppModel = JSON.parse(readFileSync(join('analysis', app, 'app-model.json'), 'utf8'));
  const conventionsPath = join('analysis', app, 'components.json');
  const conventions = JSON.parse(readFileSync(conventionsPath, 'utf8'));
  const writer = emit(model, conventions, join('generated-framework', app), { dryRun });
  console.log(`${dryRun ? '[dry run] ' : ''}${writer.summary()}`);
}
