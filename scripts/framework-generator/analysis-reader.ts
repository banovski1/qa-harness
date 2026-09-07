// analysis/*.json -> the same normalized domain model the generator has always consumed.
//
// This is the deterministic replacement for the YAML application map. Where the map was a
// record of a browser walk, this is a join over three files the repo analyzer writes from a
// local clone of the app:
//
//   pages-and-routes.json    every route the app defines, and the component that renders it
//   frontend-components.json the elements extracted from each component, ranked by the ladder
//   live-urls.json           the base URL and path prefix those routes are served under
//
// The contract it returns — { pages, sharedChrome, sharedStates, stats } — is unchanged, which
// is what lets every language adapter stay exactly as it was.
//
// One thing the analysis may not supply is the shared navigation bar. Where a sidebar lives in an
// external design-system package and is filled from a server menu payload, the rendered DOM is not
// a function of the clone alone, so it is declared in the generator config rather than inferred —
// see `navigation:`.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fromMap } from './locator-spec.js';
import { rankOf } from './locator-ladder.js';
import { pageClassName } from './naming.js';
import { assignUniqueClassNames, detectFolderSegment, locatorSignature, mergeDuplicatePages, splitUrl } from './page-model.js';
import { errorMessage, isRecord, list, record } from './types.js';
import type { ApplicationConfig, ApplicationModel, ApplicationStats, ElementModel, LocatorTemplates, PageModel } from './types.js';
import type { RoutesReport, ComponentsReport } from '../repo-analyzer/types.js';

/**
 * @typedef {{ rawName: string, component: string, locator: object, label: string,
 *             unstable: boolean, unstableReason: string|null, rung: number|null,
 *             table: {columns: string[], rowCount: number}|null, signature: string }} ElementModel
 * @typedef {{ slug: string, url: string, group: string, className: string, fileBase: string,
 *             elements: ElementModel[], states: StateModel[], aliases: string[] }} PageModel
 */

/**
 * @returns {{ pages: PageModel[], sharedChrome: ElementModel[], sharedStates: StateModel[], stats: object }}
 */
export function readApplicationModel(config: ApplicationConfig): ApplicationModel {
  const dir = config.analysisDir;
  const routeData = readRoutesReport(readAnalysisFile(dir, 'pages-and-routes.json'));
  const componentData = readComponentsReport(readAnalysisFile(dir, 'frontend-components.json'));
  // A framework's route table holds the paths the *router* matches; the app may be mounted
  // under a prefix (`/web/index.php`, say). live-urls.json is the
  // analyzer that knows the difference, so the prefix is taken from there rather than guessed.
  const pathPrefix = readPathPrefix(dir);

  const templates = config.locatorTemplates ?? {};
  const stats: ApplicationStats = {
    files: 2, elementsRead: 0, skippedNoLocator: 0, unstable: 0, tables: 0, rungs: {},
    routes: (routeData.routes ?? []).length, routesWithoutComponent: 0, apiRoutesSkipped: 0,
  };

  const elementsByFile = new Map(
    (componentData.components ?? []).map((component) => [component.file, component.elements ?? []]),
  );

  const apiPrefix = config.api?.pathPrefix ?? '/api/';
  let pages: PageModel[] = [];
  for (const route of routeData.routes ?? []) {
    const url = canonicalPath(route.path, pathPrefix);
    if (!url) continue;
    // API routes belong to the api-map track, which generates typed clients rather than
    // page objects. A route that leaked past the analyzer's own prefix filter is dropped here.
    if (canonicalPath(route.path)?.startsWith(apiPrefix)) {
      stats.apiRoutesSkipped += 1;
      continue;
    }
    if (!route.component) stats.routesWithoutComponent += 1;
    pages.push(toPage(route, url, elementsByFile.get(route.component ?? '') ?? [], templates, stats));
  }

  if (pages.length === 0) {
    throw new Error(`No usable routes in ${join(dir, 'pages-and-routes.json')}. Run the repo analyzer first.`);
  }

  // Grouping needs every URL at once, so it happens after every route is read.
  //
  // When the mount prefix is known, the module segment is the one straight after it — exact,
  // rather than inferred from what the URLs happen to share. Inference is kept for an app
  // served from the root, but it cannot be trusted here: a single short route (`/` becomes
  // just the prefix) would drag the detected segment back onto the prefix itself.
  const folderSegment = config.pages.folderSegment === 'auto'
    ? (pathPrefix ? segmentCount(pathPrefix) + 1 : detectFolderSegment(pages.map((p) => p.url)))
    : config.pages.folderSegment;
  stats.folderSegment = folderSegment;
  stats.folderSegmentDetected = config.pages.folderSegment === 'auto';
  for (const page of pages) {
    const { group, action } = splitUrl(page.url, { ...config.pages, folderSegment });
    page.group = group;
    page.className = pageClassName(group, action);
  }

  const sharedChrome = readNavigation(config, templates, stats);
  // A declared nav element must not also appear on individual pages, or every page object
  // would carry its own copy of a getter the navigation component already provides.
  const chromeKeys = new Set(sharedChrome.map((e) => e.signature));
  for (const page of pages) {
    page.elements = page.elements.filter((e) => !chromeKeys.has(e.signature));
  }

  if (config.pages.mergeDuplicates) pages = mergeDuplicatePages(pages);
  assignUniqueClassNames(pages);

  stats.pages = pages.length;
  stats.sharedChrome = sharedChrome.length;
  stats.sharedStates = 0;
  // States were a live-walk product: a menu had to be opened for its options to exist. Static
  // analysis sees the markup, never the interaction that reveals it.
  return { pages, sharedChrome, sharedStates: [], stats };
}

function readAnalysisFile(dir: string, name: string): unknown {
  const file = join(dir, name);
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    throw new Error(`Cannot read '${file}'. Run the repo analyzer first, from the repo root.`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Malformed JSON in '${file}': ${errorMessage(error)}`);
  }
}

/**
 * Routes arrive from a framework's own config, which is not obliged to be tidy: a Symfony
 * YAML path may omit its leading slash, and a query string is not part of a page's identity.
 */
function canonicalPath(path: unknown, prefix = ''): string | null {
  if (!path) return null;
  const [withoutQuery] = String(path).split('?');
  const trimmed = withoutQuery.trim();
  if (!trimmed) return null;
  const rooted = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  // An API path is filtered on its own route, before the mount prefix hides it.
  return prefix && !rooted.startsWith(prefix) ? `${prefix}${rooted}` : rooted;
}

function segmentCount(path: string): number {
  return String(path).split('/').filter(Boolean).length;
}

/** Absent live-urls.json is not an error: an app served from the root has no prefix. */
function readPathPrefix(dir: string): string {
  try {
    const data = record(JSON.parse(readFileSync(join(dir, 'live-urls.json'), 'utf8')) as unknown);
    const prefix = String(data.pathPrefix ?? '').trim().replace(/\/$/, '');
    return prefix.startsWith('/') ? prefix : '';
  } catch {
    return '';
  }
}

function toPage(route: RoutesReport['routes'][number], url: string, elements: unknown[], templates: LocatorTemplates, stats: ApplicationStats): PageModel {
  return {
    slug: route.name ? String(route.name) : url.replace(/^\//, '').replace(/\//g, '-'),
    url,
    group: '',
    className: '',
    fileBase: '',
    elements: elements.map((element) => toElement(element, templates, stats)).filter((element) => element !== null),
    states: [],
    aliases: [],
  };
}

function toElement(raw: unknown, templates: LocatorTemplates, stats: ApplicationStats): ElementModel | null {
  stats.elementsRead += 1;
  if (!isRecord(raw) || !raw.name || !raw.component || !raw.locator) {
    stats.skippedNoLocator += 1;
    return null;
  }
  let locator;
  try {
    locator = fromMap(raw.locator, templates);
  } catch (error) {
    throw new Error(`Element '${raw.name}': ${errorMessage(error)}`);
  }
  if (locator.unstable) stats.unstable += 1;

  const rung = typeof raw.rung === 'number' ? raw.rung : rankOf(locator);
  stats.rungs[String(rung)] = (stats.rungs[String(rung)] ?? 0) + 1;

  const table = Array.isArray(raw.columns)
    ? { columns: raw.columns.map((c: unknown) => (typeof c === 'string' ? c : String(record(c).name ?? ''))).filter(Boolean), rowCount: Number(raw.rowCount ?? 0) }
    : null;
  if (table) stats.tables += 1;

  return {
    rawName: String(raw.name),
    component: String(raw.component),
    locator,
    label: raw.label != null ? String(raw.label) : locator.name ?? String(raw.name),
    unstable: Boolean(locator.unstable),
    unstableReason: locator.unstableReason ?? null,
    rung,
    table,
    signature: `${raw.component}|${locatorSignature(locator)}`,
  };
}

/**
 * The declared navigation bar. Absent or empty is a supported configuration: the framework is
 * generated without a NavigationBar, and each page object carries only its own elements.
 */
function readNavigation(config: ApplicationConfig, templates: LocatorTemplates, stats: ApplicationStats): ElementModel[] {
  const declared = Array.isArray(config.navigation) ? config.navigation : [];
  return declared.map((raw) => {
    const element = toElement(raw, templates, stats);
    if (!element) {
      throw new Error(`navigation: entry needs name, component and locator — got ${JSON.stringify(raw)}`);
    }
    return element;
  });
}

export function readRoutesReport(value: unknown): Pick<RoutesReport, 'routes'> & Partial<Pick<RoutesReport, 'app'>> {
  const raw = record(value);
  return {
    app: typeof raw.app === 'string' ? raw.app : undefined,
    routes: list(raw.routes).map((entry) => {
      const route = record(entry);
      return {
        path: String(route.path ?? ''), component: route.component == null ? null : String(route.component),
        name: route.name == null ? null : String(route.name), params: list(route.params).map(String), source: String(route.source ?? ''),
      };
    }),
  };
}

export function readComponentsReport(value: unknown): { app?: string; components: (Pick<ComponentsReport['components'][number], 'file'> & { elements: unknown[] })[] } {
  const raw = record(value);
  return {
    app: typeof raw.app === 'string' ? raw.app : undefined,
    components: list(raw.components).map((entry) => {
      const component = record(entry);
      return { file: String(component.file ?? ''), elements: list(component.elements) };
    }),
  };
}
