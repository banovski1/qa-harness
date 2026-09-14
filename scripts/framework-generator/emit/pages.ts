// Renders page objects: one file per screen, written once, owned by the reader from
// the moment it exists.
import { q, header } from './naming.ts';
import type { AppModel, Screen, ComponentUse } from '../../model-compiler/model-types.ts';

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
  if (fieldKinds.length) imports.push(`import { ${fieldKinds.sort().join(', ')} } from '../../components/index.ts';`);
  for (const r of regions.sort()) imports.push(`import { ${r} } from '../../components/${r}.ts';`);
  if (collections.length) {
    imports.push(`import { RecordTable } from '../../components/RecordTable.ts';`);
    imports.push(`import { TABLE_SHAPE } from '../../components/locator-templates.ts';`);
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
    header(model),
    imports.join('\n'),
    '',
    `export class ${screen.name} extends BasePage {`,
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
    '',
    `  // Everything above came from the analysis. Everything below is yours: actions,`,
    `  // assertions, and the domain language a crawl could not know.`,
    `}`,
    '',
  ].filter(l => l !== undefined).join('\n');
}
