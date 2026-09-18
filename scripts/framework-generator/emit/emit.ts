// analysis.json in, a Playwright project out. The generator never reads the app, the
// crawl or the repo: everything it needs was decided by compile-model.ts.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FileWriter, assertOutputEmpty } from '../file-writer.ts';
import { assertDraftApproved } from './gates.ts';
import { currentDraft, DRAFT_PATH, LOCK_PATH } from './draft.ts';
import { ROOT } from '../../config/profile.mjs';
import { moduleOf, header } from './naming.ts';
import { renderPage } from './pages.ts';
import { renderRegion, renderTemplates, runtimeFiles } from './components.ts';
import { renderResource, renderApi, renderPreconditions, renderFixtures } from './api.ts';
import { renderAuthPlan, authFacts } from './auth.ts';
import { renderRoundTripGate } from './gate.ts';
import { staticProject } from './project.ts';
import type { AppModel } from '../../model-compiler/model-types.ts';
import { pathToFileURL } from 'node:url';

/**
 * An API layer may only be built on a login that was executed against the running
 * application. `authVerification` is written by verify-auth.ts or it is absent, and the
 * rest of this pipeline has always said so — the generator was the one consumer not
 * honouring it, and it emitted an API layer that could not authenticate at all.
 */
export function assertAuthVerified(model: AppModel): void {
  if (!Object.keys((model.api as any).resources ?? {}).length) return;
  if (authFacts(model)) return;

  const verification = (model.api as any).authVerification;
  const verdict = verification?.verdict ?? 'missing';
  const attempts = (verification?.attempts ?? [])
    .map((a: any) => `\n    ${a.strategy}: ${a.reason}`).join('');
  throw new Error(
    `The API layer needs a proven login, and authVerification says "${verdict}".\n` +
    (verification?.reason ? `  ${verification.reason}\n` : '') +
    (attempts ? `  strategies tried:${attempts}\n` : '') +
    `  Run: npm run verify-auth -- --write`,
  );
}

export function emit(model: AppModel, conventions: any, outputDir: string, { dryRun = false } = {}) {
  assertAuthVerified(model);
  const writer = new FileWriter(outputDir, { dryRun });

  for (const f of runtimeFiles()) writer.write(f);
  writer.write({ path: 'src/components/locator-templates.ts', contents: renderTemplates(model, conventions) });

  for (const [name, def] of Object.entries(model.components)) {
    if (def.kind !== 'region') continue;
    writer.write({ path: `src/components/${name}.ts`, contents: renderRegion(name, model) });
  }

  for (const screen of model.screens) {
    const dir = `src/pages/${moduleOf(screen.path)}`;
    writer.write({ path: `${dir}/${screen.name}.ts`, contents: renderPage(screen, model) });
  }

  const index = model.screens
    .map(s => `export { ${s.name} } from './${moduleOf(s.path)}/${s.name}.ts';`)
    .sort().join('\n');
  writer.write({ path: 'src/pages/index.ts', contents: header(model) + index + '\n' });

  const resources = (model.api as any).resources ?? {};
  if (Object.keys(resources).length) {
    for (const [name, resource] of Object.entries(resources)) {
      writer.write({ path: `src/api/${name}Api.ts`, contents: renderResource(name, resource, model) });
    }
    writer.write({ path: 'src/api/Api.ts', contents: renderApi(model) });
    writer.write({ path: 'src/api/Preconditions.ts', contents: renderPreconditions(model) });
    writer.write({ path: 'src/config/auth-plan.ts', contents: renderAuthPlan(model) });
    writer.write({ path: 'src/fixtures/test.ts', contents: renderFixtures(model) });
    writer.write({ path: 'gates/api-roundtrip.spec.ts', contents: renderRoundTripGate(model) });
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

// `file://${process.argv[1]}` is not this module's URL on Windows: argv carries a
// drive-letter path with backslashes and import.meta.url is a percent-encoded file
// URL with forward slashes. The two never matched, so running this file directly did
// nothing at all and said so with exit code 0. pathToFileURL is the comparison that
// holds on every platform.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
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
