#!/usr/bin/env -S npx tsx
/**
 * One-off: fold the eleven per-app files into analysis.json.
 *
 * The corpus is committed on purpose, and re-deriving it would mean re-running three
 * LLM skills against four clones — so the existing findings are carried across rather
 * than regenerated. Delete this once every app has been re-analysed through the new
 * shape at least once.
 *
 *   npx tsx scripts/analysis/migrate.ts [--app <app>] [--prune]
 */
import { readFileSync, existsSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, writeSection } from './analysis-file.ts';
import type { AnalysisControl, AnalysisScreen } from './analysis-types.ts';

const SEMANTIC = new Set(['testId', 'role', 'label', 'placeholder', 'proximity', 'scoped']);

/** Files the consolidation replaces. */
const REPLACED = [
  'dossier.json', 'routes.json', 'components.json', 'api.json',
  'network.json', 'crawl-state.json', 'app-map.json',
  'ANALYSIS.md', 'API-DOCUMENTATION.md', 'COMPONENT-ANALYSIS.md',
  'LOCATOR-STRATEGY.md', 'SCREEN-INVENTORY.md',
];

const read = (dir: string, file: string): any =>
  existsSync(join(dir, file)) ? JSON.parse(readFileSync(join(dir, file), 'utf8')) : null;

/** The narrowest count of elements this control's semantic handle matches. */
function semanticMatches(el: any): number {
  const semantic = (el.candidates ?? []).filter((c: any) => SEMANTIC.has(c.strategy));
  if (!semantic.length) return el.fragile ? Infinity : 1;
  return Math.min(...semantic.map((c: any) => c.matchCount));
}

function distilScreens(dir: string): AnalysisScreen[] {
  const screensDir = join(dir, 'screens');
  if (!existsSync(screensDir)) return [];
  return readdirSync(screensDir).filter(f => f.endsWith('.json')).sort().map(file => {
    const s = read(screensDir, file);
    // Only what the user can see. A hidden control is skipped by every consumer, and
    // keeping them made two thirds of this file unreadable weight.
    const visible = (s.elements ?? []).filter((el: any) => el.visible);
    const controls: AnalysisControl[] = visible.map((el: any) => ({
      role: el.role ?? null,
      name: el.name ?? '',
      nameSource: el.nameSource ?? (el.name ? 'accessible' : null),
      label: el.label ?? null,
      placeholder: el.placeholder ?? null,
      field: el.data?.['data-name'] ?? el.nameAttr ?? el.testId ?? null,
      region: el.region ?? 'body',
      visible: !!el.visible,
      disabled: !!el.disabled,
      href: el.href ?? null,
      matches: (m => (Number.isFinite(m) ? m : -1))(semanticMatches(el)),
      y: el.box?.y ?? -1,
    }));
    return {
      path: s.path, url: s.url, title: s.title,
      headings: (s.headings ?? []).map((h: any) => ({ level: h.level, text: h.text, y: h.y ?? -1 })),
      tables: s.tables ?? [],
      hiddenControls: (s.elements ?? []).length - visible.length,
      controls,
      links: s.links ?? [],
    };
  });
}

function migrate(app: string, prune: boolean): void {
  const dir = join(ROOT, 'analysis', app);
  const dossier = read(dir, 'dossier.json') ?? {};
  const routes = read(dir, 'routes.json') ?? { routes: [] };
  const components = read(dir, 'components.json') ?? { regions: [], labelAssociation: {} };
  const api = read(dir, 'api.json') ?? {};

  writeSection(app, 'app', {
    name: dossier.app ?? app,
    baseUrl: dossier.baseUrl ?? api.baseUrl ?? '',
    repoPath: dossier.repoPath ?? '',
    repoCommit: dossier.repoCommit ?? routes.repoCommit ?? null,
    generatedAt: new Date().toISOString(),
  });
  writeSection(app, 'source', {
    stack: { frontend: dossier.frontend, backend: dossier.backend },
    routes: routes.routes ?? [],
    entities: dossier.entities ?? [],
    existingTests: dossier.existingTests ?? dossier.tests ?? [],
    docs: dossier.apiDocs ? { apiDocs: dossier.apiDocs } : {},
    dependencies: dossier.dependencies ?? {},
    notes: dossier.notes ?? [],
  });
  writeSection(app, 'components', {
    regions: components.regions ?? [],
    labelAssociation: components.labelAssociation ?? {},
    designSystem: components.designSystem,
    notes: components.notes ?? [],
  });
  writeSection(app, 'api', {
    apiPrefix: api.apiPrefix ?? null,
    tiers: api.tiers ?? {},
    spec: api.spec ?? {},
    auth: api.auth ?? null,
    ...(api.authVerification ? { authVerification: api.authVerification } : {}),
    endpoints: api.endpoints ?? [],
    notes: api.notes ?? [],
  });
  const screens = distilScreens(dir);
  writeSection(app, 'screens', screens);

  const before = REPLACED.filter(f => existsSync(join(dir, f)));
  if (prune) {
    for (const f of before) unlinkSync(join(dir, f));
    rmSync(join(dir, 'screens'), { recursive: true, force: true });
  }
  console.log(`${app}: ${routes.routes?.length ?? 0} routes, ${(api.endpoints ?? []).length} endpoints, ` +
    `${screens.length} screens${prune ? ` — removed ${before.length + 1} files` : ''}`);
}

const argv = process.argv.slice(2);
const only = argv.includes('--app') ? argv[argv.indexOf('--app') + 1] : null;
const prune = argv.includes('--prune');
const apps = only ? [only] : readdirSync(join(ROOT, 'analysis'), { withFileTypes: true })
  .filter(e => e.isDirectory()).map(e => e.name).sort();
for (const app of apps) migrate(app, prune);
