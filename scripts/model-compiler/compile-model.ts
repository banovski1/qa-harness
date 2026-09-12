// Pure: (dossier, routes, components, api, screens/*) -> app-model.json.
// No network, no browser, no judgement that is not stated as a constant below. This is
// the determinism boundary: everything above it is skill output reviewed by eye,
// everything from here down is snapshot-tested code.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
// The profile's login steps are the one flow the analysis knows: a crawl cannot run
// without performing it. Carrying it into the model is what lets the generator emit a
// working login instead of a placeholder.
// @ts-ignore -- a deliberately small YAML reader, shared with the explorer
import { parseYaml } from '../../.claude/skills/app-explorer/lib/yaml-lite.mjs';
import { renderReport } from './render-report.ts';
import type { AppModel, ComponentDef, ComponentUse, Screen, LocatorSpec } from './model-types.ts';

/** A region is shared when it recurs on this many screens... */
export const RECURRENCE_MIN_SCREENS = 2;
/** ...with at least this proportion of its controls present on each. */
export const RECURRENCE_MIN_CONTROL_MATCH = 0.7;
/** ...and carrying at least this many controls, or it is a crawl partition, not a class. */
export const MIN_REGION_CONTROLS = 3;

interface CrawlElement {
  tag: string; type: string | null; role: string | null; name: string;
  label: string | null; placeholder: string | null; id: string | null;
  nameAttr: string | null; testId: string | null; data: Record<string, string>;
  region: string; visible: boolean; disabled: boolean; href: string | null;
  locator: { strategy: string; args: string[]; matchCount: number };
  unique: boolean; fragile: boolean;
}
interface CrawlScreen {
  url: string; path: string; title: string;
  headings: { level: number; text: string }[];
  tables: { columns: string[]; rowCount: number }[];
  elements: CrawlElement[];
  links: { href: string; resolved: string; text: string }[];
}

// A selector, not a label: leading sigil, a combinator, an attribute test, or Playwright
// syntax. A label may contain a dot ("A.Beike") or a bracket; only these shapes are banned.
const CSS_SHAPED = /^\s*[.#\[]|[>~]\s*[.#\w]|:nth-|:has\(|\[[\w-]+[~^$*|]?=|^locator\(|^getBy/;

/** Invariant 1: a screen may carry English, never a selector. Enforced, not intended. */
export function assertNoSelectors(screens: Screen[]): void {
  for (const s of screens) {
    for (const u of s.uses) {
      for (const [k, v] of Object.entries(u)) {
        if (typeof v !== 'string' || k === 'as' || k === 'component') continue;
        if (CSS_SHAPED.test(v)) {
          throw new Error(
            `${s.name}.${u.as}: identity "${k}" looks like a selector (${v}). ` +
            `A screen carries labels; a component owns selectors.`,
          );
        }
      }
    }
  }
}

const clean = (s: string) => s.replace(/[^A-Za-z0-9]+/g, ' ').trim();
const pascal = (s: string) => clean(s).split(' ').filter(Boolean)
  .map(w => w[0].toUpperCase() + w.slice(1)).join('');
const camel = (s: string) => { const p = pascal(s); return p ? p[0].toLowerCase() + p.slice(1) : ''; };

/** A page's identity is its full parameterless path; params are record slots, not identity. */
export function pathIdentity(path: string): string {
  return path.split('/').filter(seg => seg && !/^[:{]/.test(seg)).join('/');
}

/** Named from trailing segments, extended toward the root only while two pages collide. */
export function assignPageNames(paths: string[]): Map<string, string> {
  // A route made only of parameters ("/{user}/{type}") has no literal segment to be
  // named from, but the parameter names describe it perfectly well.
  const nameSegs = (p: string) => {
    const literal = pathIdentity(p).split('/').filter(Boolean);
    if (literal.length) return literal;
    return p.split('/').filter(Boolean).map(seg => seg.replace(/[{:}]/g, ''));
  };
  const segs = new Map(paths.map(p => [p, nameSegs(p)]));
  const out = new Map<string, string>();
  const taken = new Set<string>();
  const depthOf = new Map(paths.map(p => [p, 1]));
  for (let round = 0; round < 6; round++) {
    const byName = new Map<string, string[]>();
    for (const p of paths) {
      const s = segs.get(p)!;
      const d = Math.min(depthOf.get(p)!, s.length);
      const name = pascal(s.slice(s.length - d).join(' ')) || 'Home';
      byName.set(name, [...(byName.get(name) ?? []), p]);
    }
    let collided = false;
    for (const [name, ps] of byName) {
      if (ps.length === 1) { out.set(ps[0], name); continue; }
      for (const p of ps) {
        if (depthOf.get(p)! < segs.get(p)!.length) { depthOf.set(p, depthOf.get(p)! + 1); collided = true; }
        else out.set(p, name);
      }
    }
    if (!collided) break;
  }
  // Anything still colliding is a genuine ambiguity: two components on one path.
  const final = new Map<string, string>();
  for (const p of paths) {
    let stem = out.get(p) ?? pascal(pathIdentity(p));
    if (!/^[A-Za-z_]/.test(stem)) stem = 'Record' + stem; // "/#User/view/1" is not a class name
    const base = (stem || 'Home') + 'Page';
    let name = base; let n = 2;
    while (taken.has(name)) name = base.replace(/Page$/, String(n++) + 'Page');
    taken.add(name); final.set(p, name);
  }
  return final;
}

/** Which generated class addresses this element, from role and tag alone. */
function fieldComponentFor(el: CrawlElement): string | null {
  const r = el.role ?? '';
  if (r === 'button') return 'Button';
  if (r === 'link') return 'Link';
  if (r === 'checkbox') return 'Checkbox';
  if (r === 'radio') return 'RadioButton';
  if (r === 'combobox' || el.tag === 'select') return 'Select';
  if (r === 'searchbox' || r === 'textbox') return 'TextField';
  if (r === 'tab') return 'Tab';
  if (r === 'menuitem') return 'MenuItem';
  return null;
}

/** The element's English handle, preferring what a human would recognise. */
function identityOf(el: CrawlElement): { label?: string; field?: string } | null {
  const name = (el.name || '').trim();
  if (name) return { label: name };
  const label = (el.label || el.placeholder || '').trim();
  if (label) return { label };
  const dataName = el.data?.['data-name'] ?? el.nameAttr ?? null;
  if (dataName) return { field: dataName };
  if (el.testId) return { field: el.testId };
  return null;
}

const controlKey = (el: CrawlElement) => `${el.role ?? el.tag}|${(el.name || '').trim()}`;

/** Rule 3: a region recurring on >=N screens with >=M of its controls shared is a class. */
function discoverRegions(screens: CrawlScreen[], conventions: any) {
  const declared: Record<string, any> = {};
  for (const r of conventions?.regions ?? []) declared[r.name] = r;

  const byRegion = new Map<string, { screen: string; keys: Set<string>; els: CrawlElement[] }[]>();
  for (const s of screens) {
    const groups = new Map<string, CrawlElement[]>();
    for (const el of s.elements) {
      if (!el.visible || !el.unique) continue;
      groups.set(el.region, [...(groups.get(el.region) ?? []), el]);
    }
    for (const [region, els] of groups) {
      const named = els.filter(e => (e.name || '').trim() && fieldComponentFor(e));
      if (!named.length) continue;
      byRegion.set(region, [
        ...(byRegion.get(region) ?? []),
        { screen: s.path, keys: new Set(named.map(controlKey)), els: named },
      ]);
    }
  }

  const components: Record<string, ComponentDef> = {};
  const regionClassOf = new Map<string, string>();
  const sharedKeys = new Map<string, Set<string>>();

  for (const [region, instances] of byRegion) {
    if (instances.length < RECURRENCE_MIN_SCREENS) continue;
    const counts = new Map<string, number>();
    for (const inst of instances) for (const k of inst.keys) counts.set(k, (counts.get(k) ?? 0) + 1);
    const shared = [...counts.entries()]
      .filter(([, n]) => n / instances.length >= RECURRENCE_MIN_CONTROL_MATCH)
      .map(([k]) => k);
    if (!shared.length) continue;

    // The declared conventions supply the name and the root; recurrence supplies
    // membership. A region with no declared root is a crawl partition ("body", "footer"),
    // not a component: it has no selector of its own to own, so it is left inline.
    const decl: any = Object.values(declared).find((d: any) =>
      !d.row && (d.name || '').toLowerCase().includes(region.toLowerCase()));
    if (!decl?.selector || shared.length < MIN_REGION_CONTROLS) continue;
    const className = decl.name;
    const controls: Record<string, LocatorSpec> = {};
    const sample = new Map<string, CrawlElement>();
    for (const inst of instances) for (const el of inst.els) if (!sample.has(controlKey(el))) sample.set(controlKey(el), el);
    for (const k of shared) {
      const el = sample.get(k)!;
      const prop = camel(el.name) || camel(k);
      if (prop) controls[prop] = { strategy: el.locator.strategy as any, args: el.locator.args };
    }
    components[className] = {
      kind: 'region',
      root: { strategy: 'css', args: [decl.selector] },
      controls,
      seenOn: instances.length,
      description: `${region} region — ${Object.keys(controls).length} controls shared across ${instances.length} screens`,
    };
    regionClassOf.set(region, className);
    sharedKeys.set(region, new Set(shared));
  }
  return { components, regionClassOf, sharedKeys };
}

/** The first column that identifies a row: a link column, else the first text column. */
export function pickKeyColumn(columns: string[]): string | null {
  const usable = columns.filter(c => c && !/select all|^\s*$/i.test(c));
  return usable[0] ?? null;
}

function uniqueProp(taken: Set<string>, raw: string): string {
  const base = /^[A-Za-z_]/.test(raw) ? raw : raw ? `control${pascal(raw)}` : 'control';
  let name = base; let n = 2;
  while (taken.has(name)) name = `${base}${n++}`;
  taken.add(name);
  return name;
}

/**
 * The newest input, not the clock.
 *
 * A wall-clock stamp makes every recompile a diff, which is exactly the noise that hides
 * a real change — and this repo's whole review model is that a model diff means the
 * output moved. Stamping the newest input keeps the field meaningful (it dates the
 * analysis) while making a no-op recompile produce no diff at all.
 */
export function newestInput(appDir: string): string {
  const files = ['dossier.json', 'routes.json', 'components.json', 'api.json', 'app-profile.yaml']
    .map(f => join(appDir, f))
    .filter(existsSync);
  const screens = join(appDir, 'screens');
  if (existsSync(screens)) for (const f of readdirSync(screens)) files.push(join(screens, f));
  const newest = files.reduce((max, f) => Math.max(max, statSync(f).mtimeMs), 0);
  return new Date(newest).toISOString();
}

export function compile(appDir: string, now = newestInput(appDir)): AppModel {
  const read = (f: string) => JSON.parse(readFileSync(join(appDir, f), 'utf8'));
  const dossier = read('dossier.json');
  const routes = read('routes.json');
  const conventions = existsSync(join(appDir, 'components.json')) ? read('components.json') : { regions: [] };
  const api = existsSync(join(appDir, 'api.json')) ? read('api.json') : { endpoints: [], auth: null };
  const profilePath = join(appDir, 'app-profile.yaml');
  const profile: any = existsSync(profilePath) ? parseYaml(readFileSync(profilePath, 'utf8')) : {};

  const screensDir = join(appDir, 'screens');
  const crawled: CrawlScreen[] = existsSync(screensDir)
    ? readdirSync(screensDir).filter(f => f.endsWith('.json')).sort()
        .map(f => JSON.parse(readFileSync(join(screensDir, f), 'utf8')))
    : [];

  const { components, regionClassOf, sharedKeys } = discoverRegions(crawled, conventions);

  // Field components are parameterised and always present: one class per role, not per element.
  const labelConv = conventions?.labelAssociation ?? {};
  const fieldTemplate: string | undefined = labelConv.preferredTemplate ?? labelConv.template;
  for (const [name, desc] of Object.entries({
    TextField: 'a text input or textarea, addressed by its label',
    Select: 'a select or combobox, addressed by its label',
    Checkbox: 'a checkbox, addressed by its label',
    RadioButton: 'a radio button, addressed by its label',
    Button: 'a button, addressed by its visible text',
    Link: 'a link, addressed by its visible text',
    Tab: 'a tab, addressed by its visible text',
    MenuItem: 'a menu item, addressed by its visible text',
  })) {
    components[name] = { kind: 'field', fieldTemplate, seenOn: 0, description: desc };
  }

  const tableConv = (conventions?.regions ?? []).find((r: any) => r.row && r.cell);
  // Which crawl region the collection component covers, matched by name the same way
  // regions are: "RecordTable" covers the crawl's "table" partition.
  const collectionRegion = tableConv
    ? ['table', 'grid', 'list'].find(r => (tableConv.name || '').toLowerCase().includes(r)) ?? null
    : null;
  if (tableConv) {
    components.RecordTable = {
      kind: 'collection',
      root: { strategy: 'css', args: [tableConv.selector] },
      table: { row: tableConv.row, cell: tableConv.cell, headerCell: tableConv.headerCell, rowKeyAttribute: tableConv.rowKey },
      seenOn: 0,
      description: 'a data table whose rows are addressed by the value in their key column',
    };
  }

  // Routes are the union: declared + crawled, matched on path.
  const declaredByPath = new Map<string, any>();
  for (const r of routes.routes ?? []) declaredByPath.set(r.path, r);
  // A crawl reaches concrete records ("/#User/view/1"); the source declares the shape
  // ("/#User/view/{id}"). They are one screen, and the declared path is its identity —
  // an id is a record slot, never a page. The concrete URL survives as an alias.
  const paramRoutes = [...declaredByPath.keys()]
    .filter(p => /[{:]/.test(p))
    .map(p => ({
      path: p,
      re: new RegExp('^' + p.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?[{:][^/}]*\}?/g, '[^/]+') + '$'),
    }));
  const crawledByPath = new Map<string, CrawlScreen>();
  const aliases = new Map<string, string[]>();
  for (const s of crawled) {
    const declared = declaredByPath.has(s.path)
      ? s.path
      : paramRoutes.find(r => r.re.test(s.path))?.path;
    const key = declared ?? s.path;
    if (declared && declared !== s.path) aliases.set(key, [...(aliases.get(key) ?? []), s.path]);
    if (!crawledByPath.has(key)) crawledByPath.set(key, { ...s, path: key });
  }
  const allPaths = [...new Set([...declaredByPath.keys(), ...crawledByPath.keys()])].sort();
  const names = assignPageNames(allPaths);

  const screens: Screen[] = [];
  const navTargets = new Map<string, string>();
  let unverifiedTotal = 0;
  for (const path of allPaths) {
    const decl = declaredByPath.get(path);
    const crawl = crawledByPath.get(path);
    const uses: ComponentUse[] = [];
    const taken = new Set<string>();
    let unverified = 0;

    if (crawl) {
      for (const t of crawl.tables ?? []) {
        if (!components.RecordTable) break;
        // A <table> with no header row is a layout table: the app is using it to place
        // things, not to list records. It has no rows to address and no key to address
        // them by, so it is not a collection.
        if (pickKeyColumn(t.columns ?? []) === null) continue;
        uses.push({
          component: 'RecordTable',
          as: uniqueProp(taken, camel(crawl.title || 'records') || 'records'),
          heading: crawl.headings?.[0]?.text,
          columns: t.columns,
          keyColumn: pickKeyColumn(t.columns),
        } as ComponentUse);
      }
      for (const el of crawl.elements) {
        if (!el.visible || !el.unique) continue;
        const regionClass = regionClassOf.get(el.region);
        if (regionClass && sharedKeys.get(el.region)?.has(controlKey(el))) continue; // owned by the region
        // Controls inside a table are the collection's business: a row checkbox or a
        // row action has no page-level identity and never should.
        if (collectionRegion && el.region === collectionRegion) continue;
        const cls = fieldComponentFor(el);
        const id = identityOf(el);
        if (!cls || !id) { unverified++; continue; }
        const base = camel(id.label ?? id.field ?? '') || 'control';
        uses.push({ component: cls, as: uniqueProp(taken, base), ...id });
      }
      for (const region of new Set(crawl.elements.map(e => e.region))) {
        const cls = regionClassOf.get(region);
        if (cls) uses.unshift({ component: cls, as: uniqueProp(taken, camel(region)) });
      }
    }
    unverifiedTotal += unverified;

    // Actions: only transitions the crawl proved, and only through a control this screen
    // actually owns. A link the crawl saw but no component exposes is not an action —
    // it would generate a method with nothing behind it.
    const byLabel = new Map<string, string>();
    for (const u of uses) if (u.label) byLabel.set(u.label.trim(), u.as);
    const actions: { name: string; via: string; leadsTo: string }[] = [];
    if (crawl) {
      const seen = new Set<string>();
      for (const l of crawl.links ?? []) {
        const text = l.text.trim();
        const via = byLabel.get(text);
        if (!via) continue;
        // Exact path match. endsWith() would make "/#Account" match "/#Account/create".
        let linkPath: string;
        try { const u = new URL(l.resolved); linkPath = u.pathname.replace(/\/$/, '') + u.hash; }
        catch { continue; }
        if (!linkPath.startsWith('/')) linkPath = '/' + linkPath;
        const target = crawledByPath.has(linkPath) ? linkPath : undefined;
        if (!target || target === path || target === '/') continue;
        const name = 'goTo' + pascal(text);
        if (seen.has(name)) continue;
        seen.add(name);
        actions.push({ name, via, leadsTo: names.get(target)! });
        navTargets.set(text, names.get(target)!);
      }
    }

    screens.push({
      name: names.get(path)!,
      path,
      url: crawl?.url ?? new URL(path.replace(/^\//, ''), dossier.baseUrl).toString(),
      title: crawl?.title ?? decl?.path ?? path,
      aliases: aliases.get(path) ?? [],
      identity: { urlPattern: path, heading: crawl?.headings?.[0]?.text ?? null },
      source: { component: decl?.component ?? null, route: decl?.path ?? null },
      crawled: Boolean(crawl),
      uses,
      actions,
      unverified,
    });
  }

  // A shared region's transitions belong to the region, once, not to all 60 screens.
  for (const def of Object.values(components)) {
    if (def.kind !== 'region' || !def.controls) continue;
    const regionActions: { name: string; via: string; leadsTo: string }[] = [];
    for (const [prop] of Object.entries(def.controls)) {
      for (const [text, target] of navTargets) {
        if (camel(text) === prop) regionActions.push({ name: 'goTo' + pascal(text), via: prop, leadsTo: target });
      }
    }
    if (regionActions.length) (def as any).actions = regionActions;
  }

  assertNoSelectors(screens);

  return {
    app: {
      name: dossier.app,
      baseUrl: dossier.baseUrl,
      repoPath: dossier.repoPath,
      repoCommit: dossier.repoCommit,
      stack: `${dossier.frontend?.framework ?? '?'} / ${dossier.backend?.framework ?? '?'}`,
      generatedAt: now,
    },
    components,
    screens,
    api: {
      endpoints: api.endpoints ?? [],
      auth: api.auth
        ? {
            ...api.auth,
            uiLogin: profile.auth
              ? { loginUrl: profile.auth.loginUrl, steps: profile.auth.steps ?? [], readyWhen: profile.auth.readyWhen }
              : null,
            storageStatePath: profile.auth ? '.auth/user.json' : undefined,
          }
        : null,
    },
    stats: {
      screens: screens.length,
      crawled: screens.filter(s => s.crawled).length,
      declaredOnly: screens.filter(s => !s.crawled).length,
      components: Object.keys(components).length,
      regions: Object.values(components).filter(c => c.kind === 'region').length,
      uses: screens.reduce((n, s) => n + s.uses.length, 0),
      actions: screens.reduce((n, s) => n + s.actions.length, 0),
      unverified: unverifiedTotal,
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const appIdx = process.argv.indexOf('--app');
  if (appIdx < 0) { console.error('usage: compile-model.ts --app <name>'); process.exit(2); }
  const app = process.argv[appIdx + 1];
  const dir = join('analysis', app);
  const model = compile(dir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'app-model.json'), JSON.stringify(model, null, 2) + '\n');
  writeFileSync(join(dir, 'ANALYSIS.md'), renderReport(dir, model));
  console.log(`app-model.json  ${JSON.stringify(model.stats)}`);
}
