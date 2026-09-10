// Page-model construction: URL -> folder group, screen merging and a unique class name.
//
// These rules are about how an application's URLs become a set of page objects, not about
// where the elements came from. The folder layout is still the module segment, but a page's
// *identity* is its full parameterless path: two controls named from the same two segments
// used to collapse onto one class name and come back numbered (KyeAssignmentsPage22), which
// no reader can tell apart. Now every meaningful segment counts, and a name only grows as far
// as it must to be unique.

import { pageClassName, toPascal } from './naming.js';
import type { LocatorSpec, PageModel } from './types.js';

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
 * The segments that carry a page's identity: everything from the module segment on,
 * with parameter placeholders (`{id}`, `{dealId}`, `:id` — any of them, whatever the
 * name) dropped. Params are how a route says "some record goes here", so they never
 * distinguish one screen from another.
 */
export function meaningfulSegments(url: string, folderSegment: number): string[] {
  const parts = String(url).split('/').filter((p) => p && !/^[{:]/.test(p));
  return parts.slice(Math.max(0, folderSegment - 1));
}

export function locatorSignature(locator: LocatorSpec): string {
  const parts = [locator.strategy, `[${locator.args.join('|')}]`];
  if (locator.name != null) parts.push(`name=${locator.name}`);
  if (locator.nth != null) parts.push(`nth=${locator.nth}`);
  if (locator.within) parts.push(`within=${locatorSignature(locator.within)}`);
  return parts.join(' ');
}

/**
 * Routes that render the same component are the same screen, wherever the router
 * mounts it — `/my/submissions/...` and `/kye/assignments/view/{id}/submissions/...`
 * are one page object, not two near-identical classes. The shortest URL is the
 * canonical one and every other mount becomes an alias, so nothing reachable is lost.
 * A route with no component has nothing to prove identity with and never merges.
 */
export function mergeDuplicatePages(pages: PageModel[], folderSegment: number): PageModel[] {
  const byScreen = new Map<string, PageModel[]>();
  for (const page of pages) {
    const key = page.component ?? `url:${page.url}`;
    const group = byScreen.get(key);
    if (group) group.push(page);
    else byScreen.set(key, [page]);
  }

  const merged: PageModel[] = [];
  for (const group of byScreen.values()) {
    group.sort((a, b) => canonicalRank(a, folderSegment) - canonicalRank(b, folderSegment)
      || a.url.length - b.url.length || a.url.localeCompare(b.url));
    const [keep, ...rest] = group;
    const urls = new Set([...keep.aliases, ...rest.flatMap((page) => [page.url, ...page.aliases])]);
    urls.delete(keep.url);
    keep.aliases = [...urls];
    merged.push(keep);
  }
  return merged.sort((a, b) => a.url.localeCompare(b.url));
}

/**
 * Fewer segments make the better canonical URL (and the shorter class name). A leaf
 * ending in `Module` is a server-side redirect onto its list page, so it never wins
 * over the page it lands on.
 */
function canonicalRank(page: PageModel, folderSegment: number): number {
  const segments = meaningfulSegments(page.url, folderSegment);
  const redirect = toPascal(segments[segments.length - 1] ?? '').endsWith('Module') ? 1000 : 0;
  return segments.length + redirect;
}

/**
 * Name every page from its own path, extending a name toward the root only while it
 * collides: `/kye/employee-trading/firm-trades` is FirmTradesPage on its own, and
 * `/kye/assignments` + `/kytp/assignments` become KyeAssignmentsPage and
 * KytpAssignmentsPage — both extend, so a name never depends on which route was read
 * first. A numeric suffix survives only for paths whose meaningful segments are
 * identical (`/requests/add` next to `/requests/add/{id}` with different components),
 * where the URL itself offers nothing left to say.
 */
export function assignPageNames(pages: PageModel[], folderSegment: number): void {
  const segments = pages.map((page) => {
    const segs = meaningfulSegments(page.url, folderSegment);
    return segs.length ? segs : ['home'];
  });
  const depths = pages.map(() => 1);
  const nameOf = (i: number) => pageClassName(segments[i], depths[i]);

  for (let changed = true; changed;) {
    changed = false;
    const byName = new Map<string, number[]>();
    pages.forEach((_, i) => {
      const name = nameOf(i);
      const clash = byName.get(name);
      if (clash) clash.push(i);
      else byName.set(name, [i]);
    });
    for (const clash of byName.values()) {
      if (clash.length < 2) continue;
      for (const i of clash) {
        if (depths[i] < segments[i].length) {
          depths[i] += 1;
          changed = true;
        }
      }
    }
  }

  const used = new Map<string, number>();
  pages.forEach((page, i) => {
    let name = nameOf(i);
    const count = (used.get(name) ?? 0) + 1;
    used.set(name, count);
    if (count > 1) name = `${name}${count}`;
    page.className = name;
    page.fileBase = name;
  });
}
