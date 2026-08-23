// Application map (YAML) -> normalized domain model.
//
// This module owns every quirk of the mapper's output so that no language
// adapter ever has to know about them. The quirks are real, not hypothetical —
// each function below exists because of something in the OrangeHRM map:
//
//   * `locator:` is absent on the synthetic dropdown-container elements.
//   * Table columns and row count live only inside the prose `comment:` string.
//   * ~93 lines of identical top-nav chrome repeat in all 28 page files.
//   * The `*Module` URLs are redirects that land on their list page, so they
//     map to a byte-equivalent element set and would yield duplicate classes.
//   * `title:` and `verified:` are the same value in every file — no signal.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { fromMap } from './locator-spec.mjs';
import { pageClassName, toKebab, toPascal } from './naming.mjs';

const TABLE_COMMENT_RE = /^Table \((.*); (\d+) row\(s\)\)/;
const TRIGGER_RE = /^open trigger "(.*)"$/;

/**
 * @typedef {{ rawName: string, component: string, locator: object, label: string,
 *             unstable: boolean, unstableReason: string|null, table: {columns: string[], rowCount: number}|null,
 *             signature: string }} ElementModel
 * @typedef {{ rawName: string, triggerLabel: string, elements: ElementModel[], signature: string }} StateModel
 * @typedef {{ slug: string, url: string, group: string, className: string, fileBase: string,
 *             elements: ElementModel[], states: StateModel[], aliases: string[] }} PageModel
 */

// ---- entry point -------------------------------------------------------------

/**
 * Read every `*.yaml` under `config.mapDir` and return the normalized model plus
 * a stats object for the run summary.
 * @returns {{ pages: PageModel[], sharedChrome: ElementModel[], sharedStates: StateModel[], stats: object }}
 */
export function readApplicationMap(config) {
  const files = listMapFiles(config.mapDir);
  if (files.length === 0) {
    throw new Error(`No *.yaml files found in ${config.mapDir}. Run the smart-map skill first.`);
  }

  const stats = { files: files.length, elementsRead: 0, skippedNoLocator: 0, unstable: 0, tables: 0 };
  let pages = files.map((file) => readPage(join(config.mapDir, file), config, stats));

  // Grouping needs every URL at once, so it happens after all files are read.
  const folderSegment = config.pages.folderSegment === 'auto'
    ? detectFolderSegment(pages.map((p) => p.url))
    : config.pages.folderSegment;
  stats.folderSegment = folderSegment;
  stats.folderSegmentDetected = config.pages.folderSegment === 'auto';
  for (const page of pages) {
    const { group, action } = splitUrl(page.url, { ...config.pages, folderSegment });
    page.group = group;
    page.className = pageClassName(group, action);
  }

  const { sharedChrome, sharedStates } = extractSharedChrome(pages, config.elements.sharedChromeThreshold);
  if (config.pages.mergeDuplicates) pages = mergeDuplicatePages(pages);
  assignUniqueClassNames(pages);

  stats.pages = pages.length;
  stats.sharedChrome = sharedChrome.length;
  stats.sharedStates = sharedStates.length;
  return { pages, sharedChrome, sharedStates, stats };
}

// ---- reading -----------------------------------------------------------------

function listMapFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    throw new Error(`Cannot read mapDir '${dir}'. Run the generator from the repo root.`);
  }
  return entries.filter((f) => f.endsWith('.yaml')).sort();
}

function readPage(path, config, stats) {
  const raw = yaml.load(readFileSync(path, 'utf8'));
  if (!raw || typeof raw !== 'object') throw new Error(`Empty or malformed map file: ${path}`);
  if (!raw.url) throw new Error(`Map file has no 'url:' key: ${path}`);

  // `title` and `verified` are deliberately ignored — they are constants across
  // every file the mapper emits and carry no per-page information.
  const templates = config.locatorTemplates ?? {};
  const elements = readElements(raw.elements, path, stats, templates);
  const states = config.elements.includeStates ? readStates(raw.states, path, stats, templates) : [];

  return {
    slug: String(raw.page ?? ''),
    url: String(raw.url),
    group: '', // assigned once every URL is known — see readApplicationMap
    className: '',
    fileBase: '',
    elements,
    states,
    aliases: [],
  };
}

function readElements(list, path, stats, templates) {
  const out = [];
  for (const raw of Array.isArray(list) ? list : []) {
    stats.elementsRead += 1;
    const element = toElement(raw, path, templates);
    if (!element) {
      stats.skippedNoLocator += 1;
      continue;
    }
    if (element.unstable) stats.unstable += 1;
    if (element.table) stats.tables += 1;
    out.push(element);
  }
  return out;
}

function readStates(list, path, stats, templates) {
  const out = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const elements = readElements(raw?.elements, path, stats, templates);
    if (elements.length === 0) continue;
    const triggerLabel = TRIGGER_RE.exec(String(raw?.trigger ?? ''))?.[1] ?? String(raw?.name ?? '');
    out.push({
      rawName: String(raw?.name ?? 'state'),
      triggerLabel,
      elements,
      signature: `${triggerLabel}|${elements.map((e) => e.signature).join(',')}`,
    });
  }
  return out;
}

/** One map element -> ElementModel, or null when it carries no locator to generate from. */
function toElement(raw, path, templates) {
  if (!raw || !raw.name || !raw.component) return null;
  if (!raw.locator) return null; // synthetic container (e.g. the unnamed listbox wrappers)

  let locator;
  try {
    locator = fromMap(raw.locator, templates);
  } catch (err) {
    throw new Error(`${path}: element '${raw.name}' has an unusable locator — ${err.message}`);
  }

  const comment = String(raw.comment ?? '');
  return {
    rawName: String(raw.name),
    component: String(raw.component),
    locator,
    label: labelFromComment(comment, raw.component) || locator.name || String(raw.name),
    unstable: Boolean(locator.unstable),
    unstableReason: locator.unstableReason ?? null,
    table: raw.component === 'table' ? tableShapeOf(raw, comment) : null,
    signature: `${raw.component}|${locatorSignature(locator)}`,
  };
}

// ---- comment parsing ---------------------------------------------------------

/** `"Change Password (menuItem)"` -> `"Change Password"`. */
export function labelFromComment(comment, component) {
  const suffix = ` (${component})`;
  const text = comment.endsWith(suffix) ? comment.slice(0, -suffix.length) : comment;
  return text.trim();
}

/**
 * A table's shape comes from the structured `columns:`/`rowCount:` keys the
 * mapper emits; older map files only recorded it inside the prose comment, so
 * the comment parse stays as a fallback.
 */
function tableShapeOf(raw, comment) {
  if (Array.isArray(raw.columns)) {
    return {
      columns: raw.columns.map((c) => String(c?.name ?? '').trim()).filter(Boolean),
      rowCount: Number(raw.rowCount ?? 0),
    };
  }
  return parseTableComment(comment);
}

/**
 * Legacy fallback: recover a table's shape from its prose comment, which used to
 * be the only place the mapper recorded it: `Table (, Username , User Role ; 3 row(s)) (table)`.
 * The leading empty column is the select-all checkbox column and is dropped;
 * every label is trimmed because the mapper preserves the DOM's whitespace.
 */
function parseTableComment(comment) {
  const m = TABLE_COMMENT_RE.exec(comment);
  if (!m) return { columns: [], rowCount: 0 };
  const columns = m[1].split(',').map((c) => c.trim()).filter(Boolean);
  return { columns, rowCount: Number(m[2]) };
}

// ---- url -> folder + action --------------------------------------------------

/**
 * Work out which path segment names the app's module, by stripping the prefix
 * every mapped URL shares.
 *
 * OrangeHRM mounts its whole app under `/web/index.php/`, so segments 1 and 2
 * are identical everywhere and carry no grouping information; the first segment
 * that actually varies is the module (`admin`, `pim`, `leave`), which is what a
 * folder should be named after. An app served from the root gets 1, and an app
 * behind `/app/v2/` gets 3, with no configuration either way.
 *
 * At least one segment is always left over for the action, so a flat app whose
 * URLs are `/users`, `/orders` groups by those rather than collapsing to one
 * folder.
 *
 * @returns {number} a 1-based segment index
 */
function detectFolderSegment(urls) {
  const parts = urls.map((u) => String(u).split('/').filter(Boolean));
  if (parts.length === 0) return 1;
  const shortest = Math.min(...parts.map((p) => p.length));

  let common = 0;
  while (common < shortest - 1 && parts.every((p) => p[common] === parts[0][common])) {
    common += 1;
  }
  return common + 1;
}

/**
 * `/web/index.php/admin/viewSystemUsers` with folderSegment 3 -> group `admin`,
 * action `viewSystemUsers`. Trailing `/empNumber/7` style pairs are identity
 * noise (fixture data baked into the crawl) and are dropped by default.
 */
function splitUrl(url, pagesConfig) {
  // `{id}` segments are the mapper's collapsed entity-ID placeholders — identity
  // noise, never grouping or action information.
  const parts = String(url).split('/').filter((p) => p && p !== '{id}');
  const groupIndex = Math.max(0, pagesConfig.folderSegment - 1);
  const group = parts[groupIndex] ?? 'app';
  let action = parts[groupIndex + 1] ?? 'index';
  if (!pagesConfig.dropParamSegments && parts.length > groupIndex + 2) {
    action = parts.slice(groupIndex + 1).join('-');
  }
  return { group: toKebab(group) || 'app', action };
}

// ---- shared chrome -----------------------------------------------------------

function locatorSignature(locator) {
  const parts = [locator.strategy, `[${locator.args.join('|')}]`];
  if (locator.name != null) parts.push(`name=${locator.name}`);
  if (locator.nth != null) parts.push(`nth=${locator.nth}`);
  if (locator.within) parts.push(`within=${locatorSignature(locator.within)}`);
  return parts.join(' ');
}

/**
 * Lift every element that appears on at least `threshold` of the pages into a
 * shared set, and remove it from the individual pages. On the OrangeHRM map
 * this is the whole top bar and side menu — 17 links plus the profile chrome
 * that would otherwise be regenerated 28 times.
 *
 * Positional (`nth`) elements are never treated as chrome: two pages sharing
 * `button nth=7` is a coincidence of layout, not the same widget.
 */
function extractSharedChrome(pages, threshold) {
  const minPages = Math.ceil(pages.length * threshold);
  const sharedChrome = pickShared(pages, minPages, (p) => p.elements, (e) => e.signature,
    (e) => !e.unstable);
  const sharedStates = pickShared(pages, minPages, (p) => p.states, (s) => s.signature, () => true);

  const chromeKeys = new Set(sharedChrome.map((e) => e.signature));
  const stateKeys = new Set(sharedStates.map((s) => s.signature));
  for (const page of pages) {
    page.elements = page.elements.filter((e) => !chromeKeys.has(e.signature));
    page.states = page.states.filter((s) => !stateKeys.has(s.signature));
  }
  return { sharedChrome, sharedStates };
}

/** Items whose key occurs on >= minPages distinct pages, in first-seen order. */
function pickShared(pages, minPages, select, keyOf, eligible) {
  const counts = new Map();
  const first = new Map();
  for (const page of pages) {
    const seen = new Set();
    for (const item of select(page)) {
      const key = keyOf(item);
      if (!eligible(item) || seen.has(key)) continue;
      seen.add(key);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      if (!first.has(key)) first.set(key, item);
    }
  }
  const out = [];
  for (const [key, item] of first) {
    if (counts.get(key) >= minPages && minPages > 1) out.push(item);
  }
  return out;
}

// ---- duplicate pages ---------------------------------------------------------

/**
 * The `*Module` URLs are server-side redirects onto their list page, so the
 * crawler mapped the same screen twice. Keep one page object and record the
 * other URL as an alias instead of emitting two near-identical classes.
 */
function mergeDuplicatePages(pages) {
  const byFingerprint = new Map();
  for (const page of pages) {
    const key = `${page.group}::${page.elements.map((e) => e.signature).join(';')}`;
    const existing = byFingerprint.get(key);
    if (!existing) {
      byFingerprint.set(key, page);
      continue;
    }
    const [keep, drop] = preferredOf(existing, page);
    keep.aliases.push(drop.url, ...drop.aliases);
    byFingerprint.set(key, keep);
  }
  return [...byFingerprint.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Prefer the concrete list page over the `*Module` redirect that lands on it. */
function preferredOf(a, b) {
  const aIsModule = a.className.endsWith('ModulePage');
  const bIsModule = b.className.endsWith('ModulePage');
  if (aIsModule && !bIsModule) return [b, a];
  if (bIsModule && !aIsModule) return [a, b];
  return a.slug <= b.slug ? [a, b] : [b, a];
}

// ---- class names -------------------------------------------------------------

/** Guarantee class names are unique across the whole project and set fileBase. */
function assignUniqueClassNames(pages) {
  const used = new Set();
  for (const page of pages) {
    let name = page.className;
    if (used.has(name)) {
      const qualified = `${toPascal(page.group)}${name}`;
      name = used.has(qualified) ? uniqueSuffix(qualified, used) : qualified;
    }
    used.add(name);
    page.className = name;
    page.fileBase = name;
  }
}

function uniqueSuffix(base, used) {
  let n = 2;
  while (used.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}
