// Page-model construction: URL -> folder group, action and a unique class name.
//
// These rules are about how an application's URLs become a set of page objects, not about
// where the elements came from. They were written against the YAML application map and are
// kept here so the analysis reader inherits them unchanged — the folder layout and class
// names of a generated framework must not shift just because the input format did.

import { toKebab, toPascal } from './naming.js';
import type { LocatorSpec, PageModel, PagesConfig } from './types.js';

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
export function detectFolderSegment(urls: string[]): number {
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
export function splitUrl(url: string, pagesConfig: Omit<PagesConfig, 'folderSegment'> & { folderSegment: number }) {
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
export function locatorSignature(locator: LocatorSpec): string {
  const parts = [locator.strategy, `[${locator.args.join('|')}]`];
  if (locator.name != null) parts.push(`name=${locator.name}`);
  if (locator.nth != null) parts.push(`nth=${locator.nth}`);
  if (locator.within) parts.push(`within=${locatorSignature(locator.within)}`);
  return parts.join(' ');
}
/**
 * The `*Module` URLs are server-side redirects onto their list page, so the
 * crawler mapped the same screen twice. Keep one page object and record the
 * other URL as an alias instead of emitting two near-identical classes.
 */
export function mergeDuplicatePages(pages: PageModel[]): PageModel[] {
  const byFingerprint = new Map<string, PageModel>();
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
function preferredOf(a: PageModel, b: PageModel): [PageModel, PageModel] {
  const aIsModule = a.className.endsWith('ModulePage');
  const bIsModule = b.className.endsWith('ModulePage');
  if (aIsModule && !bIsModule) return [b, a];
  if (bIsModule && !aIsModule) return [a, b];
  return a.slug <= b.slug ? [a, b] : [b, a];
}
/** Guarantee class names are unique across the whole project and set fileBase. */
export function assignUniqueClassNames(pages: PageModel[]): void {
  const used = new Set<string>();
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

function uniqueSuffix(base: string, used: Set<string>): string {
  let n = 2;
  while (used.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}
