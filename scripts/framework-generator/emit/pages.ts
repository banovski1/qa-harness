// Renders page objects: the generated base class and the protected subclass a human owns.
import { q } from './naming.ts';
import type { AppModel, Screen, ComponentUse } from '../../model-compiler/model-types.ts';

// NOTE: kept identical to (and not sourced from) naming.ts's `header` — the two strings
// differ, and unifying them is a later task's business, not this pure move's. See
// task-5-report.md for the detail.
const HEADER = (model: AppModel) =>
  `// GENERATED — rewritten on every run. Put nothing here you want to keep.\n` +
  `// Source: analysis.json (${model.app.repoCommit.slice(0, 10)})\n`;

export function useExpression(use: ComponentUse, model: AppModel, screen: Screen): string {
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
  if (use.via) identity.push(`via: ${q(use.via)}`);
  return `new ${use.component}(this.page, { ${identity.join(', ')} }, ${ctx})`;
}

export function renderPage(screen: Screen, model: AppModel): string {
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
    `  /** Proved by ${(a as { provenBy?: string }).provenBy === 'recording' ? 'a recording' : 'the crawl'}: this control leads to ${a.leadsTo}. */\n` +
    `  async ${a.name}(): Promise<void> {\n` +
    `    await this.${a.via}.click();\n` +
    `    await this.page.waitForURL(url => url.href.includes(${q(model.screens.find(s => s.name === a.leadsTo)!.path)}));\n` +
    `  }`);

  const notes: string[] = [];
  if (!screen.crawled && !screen.uses.length) {
    notes.push(
      `  // This route is declared in the app's source but the crawl never reached it, so`,
      `  // it has a URL and nothing else. Crawl the screen to fill it in.`);
  } else if (!screen.crawled) {
    // Everything below came from a human walking the flow. Saying so is the difference
    // between "these are proved unique" and "these resolved once, for one person".
    notes.push(
      `  // The crawl never reached this route — everything here comes from a recording.`,
      `  // The controls resolved when a human used them; nothing has proved them unique.`);
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

export function renderPageSubclass(screen: Screen): string {
  return [
    `// Yours. The generator writes this once and never touches it again — put actions,`,
    `// assertions and anything the analysis could not know here.`,
    `import { ${screen.name}Generated } from './${screen.name}.generated.ts';`,
    '',
    `export class ${screen.name} extends ${screen.name}Generated {}`,
    '',
  ].join('\n');
}
