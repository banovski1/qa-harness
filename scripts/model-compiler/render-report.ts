// The human-readable face of app-model.json. Deterministic, so its diff is reviewable
// alongside the model's.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { AppModel } from './model-types.ts';

export function renderReport(appDir: string, model: AppModel): string {
  const dossier = JSON.parse(readFileSync(join(appDir, 'dossier.json'), 'utf8'));
  const api = JSON.parse(readFileSync(join(appDir, 'api.json'), 'utf8'));
  const regions = Object.entries(model.components).filter(([, c]) => c.kind === 'region');
  const collections = Object.entries(model.components).filter(([, c]) => c.kind === 'collection');
  const uncrawled = model.screens.filter(s => !s.crawled);
  const busiest = [...model.screens].sort((a, b) => b.uses.length - a.uses.length).slice(0, 10);

  const lines = [
    `# ${model.app.name}`,
    '',
    `Generated from \`analysis/${model.app.name}/app-model.json\`. Nothing here is hand-written;`,
    `re-run the skills, then \`compile-model.ts\`, to change it.`,
    '',
    `| | |`,
    `| --- | --- |`,
    `| stack | ${model.app.stack} |`,
    `| clone | \`${model.app.repoPath}\` at \`${model.app.repoCommit.slice(0, 10)}\` |`,
    `| base URL | ${model.app.baseUrl} |`,
    `| screens | ${model.stats.screens} (${model.stats.crawled} crawled, ${model.stats.declaredOnly} declared only) |`,
    `| controls | ${model.stats.uses} named, ${model.stats.unverified} unnamed |`,
    `| components | ${model.stats.components} (${model.stats.regions} shared regions) |`,
    `| proved transitions | ${model.stats.actions} |`,
    '',
    '## Components',
    '',
    regions.length
      ? regions.map(([n, c]) => `- **${n}** — ${Object.keys(c.controls ?? {}).length} controls, on ${c.seenOn} screens. Owns \`${c.root?.args[0]}\`.`).join('\n')
      : '- No region recurs on enough screens to become a shared class.',
    collections.length ? collections.map(([n, c]) => `- **${n}** — rows \`${c.table?.row}\`, addressed by key column, never by index.`).join('\n') : '',
    '',
    '## The screens carrying the most',
    '',
    '| screen | path | controls | unnamed | actions |',
    '| --- | --- | --- | --- | --- |',
    ...busiest.map(s => `| ${s.name} | \`${s.path}\` | ${s.uses.length} | ${s.unverified} | ${s.actions.length} |`),
    '',
    '## Declared but never crawled',
    '',
    uncrawled.length
      ? `${uncrawled.length} route(s) generate a page object with a URL and nothing else. ` +
        `They are real routes the app declares; the crawl did not reach them, usually because ` +
        `they sit behind a gate or beyond the crawl budget.\n\n` +
        uncrawled.slice(0, 15).map(s => `- \`${s.path}\` → ${s.name}`).join('\n') +
        (uncrawled.length > 15 ? `\n- …and ${uncrawled.length - 15} more` : '')
      : 'None: the crawl reached every declared route.',
    '',
    '## Authentication',
    '',
    api.auth
      ? `${api.auth.kind} — ${api.auth.scheme ?? 'see api.json'}. ` +
        `Credentials come from \`APP_USERNAME\`/\`APP_PASSWORD\` and never appear in the analysis.`
      : 'None recorded: this app is crawled unauthenticated.',
    '',
    '## What the analysis could not settle',
    '',
    ...(dossier.notes ?? []).map((n: string) => `- ${n}`),
    '',
  ];
  // Blank lines matter in markdown; only collapse runs of them.
  const out: string[] = [];
  for (const line of lines) if (line !== '' || out[out.length - 1] !== '') out.push(line);
  return out.join('\n') + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const app = process.argv[process.argv.indexOf('--app') + 1];
  const dir = join('analysis', app);
  const model: AppModel = JSON.parse(readFileSync(join(dir, 'app-model.json'), 'utf8'));
  writeFileSync(join(dir, 'ANALYSIS.md'), renderReport(dir, model));
  console.log(`analysis/${app}/ANALYSIS.md`);
}
