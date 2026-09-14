// analysis.json in, a Playwright project out. The generator never reads the app, the
// crawl or the repo: everything it needs was decided by compile-model.ts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FileWriter, assertOutputEmpty } from '../file-writer.ts';
import { assertDraftApproved } from './gates.ts';
import { currentDraft, DRAFT_PATH, LOCK_PATH } from './draft.ts';
import { ROOT } from '../../config/profile.mjs';
import { moduleOf } from './naming.ts';
import { renderPage, renderPageSubclass } from './pages.ts';
import { renderRegion, renderTemplates, runtimeFiles } from './components.ts';
import { renderResources, renderPreconditions, renderFixtures } from './api.ts';
import { staticProject } from './project.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';

// NOTE: kept identical to (and not sourced from) naming.ts's `header` — the two strings
// differ, and unifying them is a later task's business, not this pure move's. See
// task-5-report.md for the detail.
const HEADER = (model: AppModel) =>
  `// GENERATED — rewritten on every run. Put nothing here you want to keep.\n` +
  `// Source: analysis.json (${model.app.repoCommit.slice(0, 10)})\n`;

export function emit(model: AppModel, conventions: any, outputDir: string, { dryRun = false } = {}) {
  const writer = new FileWriter(outputDir, { dryRun });

  for (const f of runtimeFiles()) writer.write(f);
  writer.write({ path: 'src/components/locator-templates.generated.ts', contents: renderTemplates(model, conventions) });

  for (const [name, def] of Object.entries(model.components)) {
    if (def.kind !== 'region') continue;
    writer.write({ path: `src/components/${name}.generated.ts`, contents: renderRegion(name, model) });
  }

  for (const screen of model.screens) {
    const dir = `src/pages/${moduleOf(screen.path)}`;
    writer.write({ path: `${dir}/${screen.name}.generated.ts`, contents: renderPage(screen, model) });
    writer.write({ path: `${dir}/${screen.name}.ts`, contents: renderPageSubclass(screen) });
  }

  const index = model.screens
    .map(s => `export { ${s.name} } from './${moduleOf(s.path)}/${s.name}.ts';`)
    .sort().join('\n');
  writer.write({ path: 'src/pages/index.ts', contents: HEADER(model) + index + '\n' });

  const resources = (model.api as any).resources ?? {};
  if (Object.keys(resources).length) {
    writer.write({ path: 'src/api/resources.generated.ts', contents: renderResources(model) });
    writer.write({ path: 'src/api/preconditions.generated.ts', contents: renderPreconditions(model) });
    writer.write({ path: 'src/fixtures/test.ts', contents: renderFixtures(model) });
  }

  for (const f of staticProject(model)) writer.write(f);
  writer.ensureDir('tests/e2e');

  return writer;
}

/**
 * analysis.json carries one entry per screen holding both what the crawl observed and
 * what the compiler derived. The generator only needs the derived half, so it is read
 * back into the shape the emitter has always used rather than teaching every render
 * function about controls it does not emit.
 */
export function modelFromAnalysis(): AppModel {
  const analysis = JSON.parse(readFileSync(join(ROOT, 'analysis.json'), 'utf8'));
  return {
    app: analysis.app,
    components: analysis.components,
    screens: analysis.screens.map((s: any) => ({
      name: s.name, path: s.path, url: s.url, title: s.title,
      aliases: s.aliases, identity: s.identity, source: s.source,
      crawled: s.crawled, uses: s.uses ?? [], actions: s.actions ?? [],
      unverified: s.unverified ?? 0,
      testability: s.testability,
    })),
    api: analysis.api,
    stats: analysis.stats,
  } as AppModel;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dryRun = process.argv.includes('--dry-run');
  const force = process.argv.includes('--force');
  const outputDir = join(ROOT, 'generated-framework');

  try {
    // A dry run writes nothing, so an existing framework is no obstacle to describing
    // what a fresh one would look like.
    if (!dryRun) assertOutputEmpty(outputDir);
    if (!force) {
      const { markdown } = currentDraft();
      assertDraftApproved({ draftPath: DRAFT_PATH, lockPath: LOCK_PATH, current: markdown });
    }
  } catch (error) {
    console.error(`✗ ${(error as Error).message}`);
    process.exit(1);
  }

  const model: AppModel = modelFromAnalysis();
  const analysis = JSON.parse(readFileSync(join(ROOT, 'analysis.json'), 'utf8'));
  const writer = emit(model, analysis.conventions, outputDir, { dryRun });
  console.log(`${dryRun ? '[dry run] ' : ''}${writer.summary()}`);
}
