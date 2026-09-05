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
// One thing the analysis genuinely cannot supply is the shared navigation bar: OrangeHRM's
// sidebar lives in an external design-system package and is filled from a server menu payload,
// so the rendered DOM is not a function of the clone alone. It is declared in the generator
// config instead of being inferred — see `navigation:`.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fromMap } from './locator-spec.mjs';
import { rankOf } from './locator-ladder.mjs';
import { pageClassName } from './naming.mjs';
import { assignUniqueClassNames, detectFolderSegment, locatorSignature, mergeDuplicatePages, splitUrl } from './page-model.mjs';

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
export function readApplicationModel(config) {
  const dir = config.analysisDir;
  const routeData = readAnalysisFile(dir, 'pages-and-routes.json');
  const componentData = readAnalysisFile(dir, 'frontend-components.json');
  // A framework's route table holds the paths the *router* matches; the app may be mounted
  // under a prefix (OrangeHRM serves everything under /web/index.php). live-urls.json is the
  // analyzer that knows the difference, so the prefix is taken from there rather than guessed.
  const pathPrefix = readPathPrefix(dir);

  const templates = config.locatorTemplates ?? {};
  const stats = {
    files: 2, elementsRead: 0, skippedNoLocator: 0, unstable: 0, tables: 0, rungs: {},
    routes: (routeData.routes ?? []).length, routesWithoutComponent: 0, apiRoutesSkipped: 0,
  };

  const elementsByFile = new Map(
    (componentData.components ?? []).map((component) => [component.file, component.elements ?? []]),
  );

  const apiPrefix = config.api?.pathPrefix ?? '/api/';
  let pages = [];
  for (const route of routeData.routes ?? []) {
    const url = canonicalPath(route.path, pathPrefix);
    if (!url) continue;
    // API routes belong to the api-map track, which generates typed clients rather than
    // page objects. A route that leaked past the analyzer's own prefix filter is dropped here.
    if (canonicalPath(route.path).startsWith(apiPrefix)) {
      stats.apiRoutesSkipped += 1;
      continue;
    }
    if (!route.component) stats.routesWithoutComponent += 1;
    pages.push(toPage(route, url, elementsByFile.get(route.component) ?? [], templates, stats));
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

function readAnalysisFile(dir, name) {
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
    throw new Error(`Malformed JSON in '${file}': ${error.message}`);
  }
}

/**
 * Routes arrive from a framework's own config, which is not obliged to be tidy: a Symfony
 * YAML path may omit its leading slash, and a query string is not part of a page's identity.
 */
function canonicalPath(path, prefix = '') {
  if (!path) return null;
  const [withoutQuery] = String(path).split('?');
  const trimmed = withoutQuery.trim();
  if (!trimmed) return null;
  const rooted = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  // An API path is filtered on its own route, before the mount prefix hides it.
  return prefix && !rooted.startsWith(prefix) ? `${prefix}${rooted}` : rooted;
}

function segmentCount(path) {
  return String(path).split('/').filter(Boolean).length;
}

/** Absent live-urls.json is not an error: an app served from the root has no prefix. */
function readPathPrefix(dir) {
  try {
    const data = JSON.parse(readFileSync(join(dir, 'live-urls.json'), 'utf8'));
    const prefix = String(data.pathPrefix ?? '').trim().replace(/\/$/, '');
    return prefix.startsWith('/') ? prefix : '';
  } catch {
    return '';
  }
}

function toPage(route, url, elements, templates, stats) {
  return {
    slug: route.name ? String(route.name) : url.replace(/^\//, '').replace(/\//g, '-'),
    url,
    group: '',
    className: '',
    fileBase: '',
    elements: elements.map((element) => toElement(element, templates, stats)).filter(Boolean),
    states: [],
    aliases: [],
  };
}

function toElement(raw, templates, stats) {
  stats.elementsRead += 1;
  if (!raw?.name || !raw.component || !raw.locator) {
    stats.skippedNoLocator += 1;
    return null;
  }
  let locator;
  try {
    locator = fromMap(raw.locator, templates);
  } catch (error) {
    throw new Error(`Element '${raw.name}': ${error.message}`);
  }
  if (locator.unstable) stats.unstable += 1;

  const rung = raw.rung ?? rankOf(locator);
  stats.rungs[rung] = (stats.rungs[rung] ?? 0) + 1;

  const table = Array.isArray(raw.columns)
    ? { columns: raw.columns.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean), rowCount: Number(raw.rowCount ?? 0) }
    : null;
  if (table) stats.tables += 1;

  return {
    rawName: String(raw.name),
    component: String(raw.component),
    locator,
    label: raw.label ?? locator.name ?? String(raw.name),
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
function readNavigation(config, templates, stats) {
  const declared = Array.isArray(config.navigation) ? config.navigation : [];
  return declared.map((raw) => {
    const element = toElement(raw, templates, stats);
    if (!element) {
      throw new Error(`navigation: entry needs name, component and locator — got ${JSON.stringify(raw)}`);
    }
    return element;
  });
}
