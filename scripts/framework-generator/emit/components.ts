// Renders the component layer: regions (the only place a locator may appear), the
// locator-templates file, and the runtime files copied verbatim.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { q, header } from './naming.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUNTIME = join(HERE, 'runtime');

// components/locator-templates.ts under runtime/ is a placeholder that exists only so
// resolve.ts (which imports FIELD_TEMPLATE at module scope) can be loaded and tested
// standalone. renderTemplates() writes the real, app-specific file at the same output
// path ('src/components/locator-templates.ts'), so the placeholder is excluded here —
// copying it too would plan the same path twice.
// config/auth-plan.ts is the same arrangement: authenticate.ts imports AUTH_PLAN at
// module scope, and renderAuthPlan() writes the real one from the strategy that
// verify-auth.ts proved.
const SKIP = new Set(['components/locator-templates.ts', 'config/auth-plan.ts']);

/** Every file under emit/runtime/ is copied verbatim: it is ordinary, reviewable code. */
export function runtimeFiles(dir = RUNTIME, prefix = 'src'): { path: string; contents: string }[] {
  const out: { path: string; contents: string }[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const relative = full.slice(RUNTIME.length + 1);
    if (statSync(full).isDirectory()) out.push(...runtimeFiles(full, `${prefix}/${entry}`));
    else if (!SKIP.has(relative)) out.push({ path: `${prefix}/${entry}`, contents: readFileSync(full, 'utf8') });
  }
  return out;
}

export function renderRegion(name: string, model: AppModel): string {
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
    header(model),
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

export function renderTemplates(model: AppModel, conventions: any): string {
  const table = Object.values(model.components).find(c => c.kind === 'collection');
  return [
    header(model),
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
