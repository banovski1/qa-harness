#!/usr/bin/env node
// Deterministic replacement for the LLM-driven `app-map` skill.
//
// Given a login flow as parameters (see ui-mapper-script/app-map-config.yaml) — entry URL,
// credentials, and the locators for username / password / submit — it logs in once
// and builds the UI map of any application from the accessibility (ARIA) tree,
// emitting ui-map-results/application-map/<slug>.yaml and ui-map-results/component-inventory.md
// with the same schema the skill produced.
//
//   node ui-mapper-script/mapper.mjs [path/to/app-map-config.yaml]
//
// Run from the repo root so ui-map-results/ resolves correctly.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { chromium } from 'playwright';
import { fromMap, make, resolve, toYamlInline, yamlString } from './locator-spec.mjs';
import { parseAriaTree, walk, nearestNamedAncestor } from './aria-tree.mjs';

const OUT_DIR = join('ui-map-results', 'application-map');
const INVENTORY = join('ui-map-results', 'component-inventory.md');

// role -> { component, suffix } for the a11y roles emitted as standalone components.
// (textbox is special-cased below: [multiline] -> longInput, else input.)
const ROLE_INFO = {
  searchbox:   { component: 'input',       suffix: 'SearchInput' },
  button:      { component: 'button',      suffix: 'Button' },
  link:        { component: 'link',        suffix: 'Link' },
  checkbox:    { component: 'checkbox',    suffix: 'Checkbox' },
  radio:       { component: 'radio',       suffix: 'Radio' },
  switch:      { component: 'switch',      suffix: 'Switch' },
  combobox:    { component: 'dropdown',    suffix: 'Dropdown' },
  tab:         { component: 'tab',         suffix: 'Tab' },
  img:         { component: 'image',       suffix: 'Image' },
  alert:       { component: 'alert',       suffix: 'Alert' },
  heading:     { component: 'text',        suffix: 'Heading' },
  dialog:      { component: 'modal',       suffix: 'Modal' },
  progressbar: { component: 'progressbar', suffix: 'Progress' },
  menuitem:    { component: 'menuItem',    suffix: 'MenuItem' },
  // 'table' is assembled specially in handleTable(), not via this generic path.
  // 'listbox'/'option' are only meaningful once opened — handled in captureStates().
};

// Structural roles: always walked into (for nested interactive children) but never
// emitted as a standalone component — they're containers, not widgets a user "uses".
const STRUCTURAL_SKIP = new Set([
  'generic', 'list', 'listitem', 'row', 'rowgroup', 'cell', 'columnheader',
  'separator', 'complementary', 'banner', 'navigation', 'paragraph', 'text',
  'group', 'region', 'main', 'contentinfo', 'form', 'article', 'rowheader',
]);

async function main() {
  const specPath = process.argv[2] ?? join('ui-mapper-script', 'app-map-config.yaml');
  const spec = loadSpec(specPath);
  console.log(`[app-map] mapping ${spec.app} @ ${spec.baseUrl}`);

  mkdirSync(OUT_DIR, { recursive: true });
  const inventory = [];

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();
  try {
    await login(page, spec);

    // BFS the app: start from explicit seeds (if any) plus wherever login landed,
    // then follow same-origin nav links discovered in each page's a11y tree —
    // no manual seed list is required for a new app.
    const visited = new Set();
    const queue = [...spec.seeds];
    const postLoginPath = new URL(page.url()).pathname;
    if (!queue.includes(postLoginPath)) queue.push(postLoginPath);

    let mapped = 0;
    while (queue.length > 0 && mapped < spec.maxPages) {
      const path = queue.shift();
      if (visited.has(path)) continue;
      visited.add(path);

      const discovered = await mapPage(page, spec, path, inventory);
      mapped++;

      if (spec.discoverLinks) {
        for (const href of discovered) {
          if (!visited.has(href) && !queue.includes(href)) queue.push(href);
        }
      }
    }

    writeInventory(inventory);
    console.log(`[app-map] done: ${mapped} page(s), ${inventory.length} component(s).`);
  } finally {
    await browser.close();
  }
}

function loadSpec(path) {
  const root = yaml.load(readFileSync(path, 'utf8'));
  if (!root) throw new Error(`Empty spec file: ${path}`);
  const creds = root.credentials ?? {};
  const login = root.login;
  if (!login) throw new Error("Missing 'login:' block in spec");
  return {
    app: root.app,
    baseUrl: root.baseUrl,
    username: creds.username,
    password: creds.password,
    loginUrl: login.loginUrl,
    usernameLocator: fromMap(login.usernameLocator),
    passwordLocator: fromMap(login.passwordLocator),
    submitLocator: fromMap(login.submitLocator),
    successSignal: login.successSignal ? fromMap(login.successSignal) : null,
    seeds: Array.isArray(root.seeds) ? root.seeds.map(String) : [],
    captureStates: Boolean(root.crawl?.captureStates),
    maxStatesPerPage: Number(root.crawl?.maxStatesPerPage ?? 6),
    discoverLinks: root.crawl?.discoverLinks !== false, // on by default
    maxPages: Number(root.crawl?.maxPages ?? 40),
    maxClickProbesPerPage: Number(root.crawl?.maxClickProbesPerPage ?? 20),
  };
}

/** Parameterized login: fill username/password and submit using the spec's locators. */
async function login(page, spec) {
  await page.goto(spec.baseUrl + spec.loginUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await resolve(page, spec.usernameLocator).fill(spec.username);
  await resolve(page, spec.passwordLocator).fill(spec.password);
  await resolve(page, spec.submitLocator).click();
  if (spec.successSignal) {
    await resolve(page, spec.successSignal).first().waitFor();
  } else {
    await settle(page);
  }
  console.log(`[app-map] logged in, now at ${page.url()}`);
}

/**
 * Snapshot one page's a11y tree, emit its YAML map (elements + opened-state elements),
 * and return same-origin nav links discovered on the page (as paths) so the caller can
 * queue them.
 */
async function mapPage(page, spec, seed, inventory) {
  await page.goto(spec.baseUrl + seed, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(page);

  const slug = slugOf(seed);
  const title = await page.title();
  const tree = await snapshotTree(page);

  const ctx = { page, slug, inventory, elements: [], usedNames: new Set(), roleCounters: new Map(), skipped: 0 };
  await walkAndCollect(tree, ctx);

  const states = spec.captureStates
    ? await captureStates(page, spec, seed, ctx)
    : [];

  writePageYaml(slug, seed, title, ctx.elements, states);
  console.log(`[app-map] ${slug}: ${ctx.elements.length} element(s), ${states.length} state(s)`
      + (ctx.skipped ? `, ${ctx.skipped} skipped` : ''));

  // captureStates() may have left the page mid-navigation if a "trigger" candidate
  // turned out to be a real nav link rather than a popup/dropdown — re-settle on the
  // seed page before reading hrefs off it.
  if (spec.captureStates) {
    await page.goto(spec.baseUrl + seed, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle(page);
  }

  const hrefPaths = await discoverNavLinks(page, spec.baseUrl);
  const clickPaths = await discoverNavByClicking(page, spec, seed);

  // discoverNavByClicking() leaves the page wherever the last successful probe
  // navigated to — reset to the seed so callers reading page state afterwards
  // (or a subsequent mapPage() call) start clean.
  await page.goto(spec.baseUrl + seed, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await settle(page);

  return [...new Set([...hrefPaths, ...clickPaths])];
}

async function snapshotTree(page) {
  const text = await page.locator('body').ariaSnapshot();
  return parseAriaTree(text);
}

/** Walk the parsed tree, classifying and locating every component we recognize. */
async function walkAndCollect(tree, ctx) {
  const nodes = [];
  walk(tree, (node, ancestors) => nodes.push({ node, ancestors }));

  for (const { node, ancestors } of nodes) {
    if (node.role === 'table') {
      await handleTable(node, ancestors, ctx);
      continue;
    }
    if (STRUCTURAL_SKIP.has(node.role) || node.role === 'option' || node.role === 'listbox') continue;

    const info = classify(node);
    if (!info) continue; // role genuinely outside our vocabulary (e.g. 'time', 'status')

    await emitComponent(node, ancestors, info, ctx);
  }
}

function classify(node) {
  if (node.role === 'textbox') {
    return node.attrs.has('multiline')
      ? { component: 'longInput', suffix: 'TextArea' }
      : { component: 'input', suffix: 'Input' };
  }
  return ROLE_INFO[node.role] ?? null;
}

/**
 * Derive a locator for one node and record it as a component. Three tiers, in order:
 *  1. accessible-name based (getByRole, then the fallback ladder) — the common case.
 *  2. ancestor-scoped by the nearest named ancestor — disambiguates repeated widgets
 *     (e.g. a checkbox inside a specific named column header or table row).
 *  3. page-wide positional (`nth`) among same-role matches, counted in the same
 *     document order Playwright's own tree walk and getByRole() both use — always
 *     succeeds, but flagged `unstable` since it has no semantic anchor.
 * Nothing is silently dropped: only a genuine `count()==0` scenario is skipped and logged.
 */
async function emitComponent(node, ancestors, info, ctx) {
  const idx = nextIndex(ctx.roleCounters, node.role);
  const label = node.name ?? contextualLabel(node, ancestors);

  let loc = null;
  if (node.name) {
    loc = await tryNamed(ctx.page, node.role, node.name);
  }
  if (!loc) {
    const ancestor = nearestNamedAncestor(ancestors);
    if (ancestor) {
      const candidate = make('getByRole', [node.role], node.name, {
        within: make('getByRole', [ancestor.role], ancestor.name),
        unstable: !node.name,
        unstableReason: node.name ? null : 'no accessible name; scoped to nearest named ancestor',
      });
      if (await isUnique(ctx.page, candidate)) loc = candidate;
    }
  }
  if (!loc) {
    const candidate = make('getByRole', [node.role], null, {
      nth: idx,
      unstable: true,
      unstableReason: 'no accessible name or unique ancestor scope; positional index used',
    });
    if (await isUnique(ctx.page, candidate)) loc = candidate;
  }
  if (!loc) {
    ctx.skipped++;
    console.warn(`[app-map] skipped: ${node.role} "${label ?? ''}" on ${ctx.slug} (no unique locator)`);
    return;
  }

  const name = uniqueName(camel(label ?? node.role) + info.suffix, ctx.usedNames);
  const element = { name, component: info.component, locator: loc, accName: label ?? '(unnamed)' };
  ctx.elements.push(element);
  ctx.inventory.push({ component: info.component, page: ctx.slug, accName: element.accName, locator: loc });
}

/** A human-readable label for an unnamed node, derived from context — never left blank. */
function contextualLabel(node, ancestors) {
  const ancestor = nearestNamedAncestor(ancestors);
  return ancestor ? `${ancestor.name} ${node.role}` : null;
}

async function tryNamed(page, role, accName) {
  const byRole = make('getByRole', [role], accName);
  if (await isUnique(page, byRole)) return byRole;
  for (const strategy of ['getByLabel', 'getByPlaceholder', 'getByAltText', 'getByText']) {
    const cand = make(strategy, [accName]);
    if (await isUnique(page, cand)) return cand;
  }
  return null;
}

/**
 * A table isn't one node — assemble it from its rowgroup/row/columnheader/cell
 * descendants into a single "table" component with its columns recorded in the
 * comment. Nested interactive controls (e.g. a header checkbox) are still emitted
 * separately by the normal walk, since walk() always recurses regardless.
 */
async function handleTable(node, ancestors, ctx) {
  const idx = nextIndex(ctx.roleCounters, 'table');
  const columns = [];
  walk(node, (n) => {
    if (n.role === 'columnheader') columns.push((n.name || n.text || '').trim());
  });
  const rowCount = node.children.filter((c) => c.role === 'rowgroup')
    .flatMap((rg) => rg.children.filter((r) => r.role === 'row')).length;

  let loc = null;
  if (node.name) loc = await tryNamed(ctx.page, 'table', node.name);
  if (!loc) {
    const candidate = make('getByRole', ['table'], null, {
      nth: idx,
      unstable: !node.name,
      unstableReason: node.name ? null : 'table has no accessible name; positional index used',
    });
    if (await isUnique(ctx.page, candidate)) loc = candidate;
  }
  if (!loc) {
    ctx.skipped++;
    console.warn(`[app-map] skipped: table on ${ctx.slug} (no unique locator)`);
    return;
  }

  const label = node.name ?? contextualLabel(node, ancestors) ?? 'table';
  const name = uniqueName(camel(label) + 'Table', ctx.usedNames);
  const cleanColumns = columns.filter(Boolean);
  const colSummary = cleanColumns.join(', ') || '(icon-only columns)';
  const accName = node.name ?? `Table (${colSummary}; ${rowCount} row(s))`;
  const element = {
    name, component: 'table', locator: loc, accName,
    columns: cleanColumns.map((c) => ({ name: c })),
    rowCount,
  };
  ctx.elements.push(element);
  ctx.inventory.push({ component: 'table', page: ctx.slug, accName, locator: loc });
}

async function isUnique(page, locSpec) {
  try {
    return (await resolve(page, locSpec).count()) === 1;
  } catch {
    return false;
  }
}

function nextIndex(counters, role) {
  const i = counters.get(role) ?? 0;
  counters.set(role, i + 1);
  return i;
}

// ---- Tier 2: open closed widgets (dropdowns, date pickers, tabs, popups) ----------

/**
 * Find likely disclosure triggers (tabs, aria-haspopup elements, custom dropdown
 * headers, readonly/date-style inputs), open each one from a clean page state, and
 * diff the a11y tree before/after to capture what only exists once opened —
 * mirrors the skill's "open each modal, dropdown, tab and date picker" rule.
 */
// One combined CSS selector — a comma-separated list is a single query, so an element
// matching more than one clause (e.g. both [aria-haspopup] and a dropdown class) is only
// counted once. Keeps the maxStatesPerPage budget from being burned on the same widget.
const TRIGGER_SELECTOR = [
  '[role="tab"]', '[aria-haspopup]',
  '[class*="select-text" i]', '[class*="dropdown" i]',
  'input[readonly]',
].join(', ');

async function captureStates(page, spec, seed, ctx) {
  // Candidate elements are frequently layered (an outer wrapper with [aria-haspopup]
  // around an inner span matching the dropdown-class selector) — clicking both opens
  // the same widget twice. Keep only the topmost match in each containment chain.
  let topIndexes = [];
  try {
    topIndexes = await page.locator(TRIGGER_SELECTOR).evaluateAll((els) =>
      els.map((el, i) => ({ el, i })).filter(({ el }) => !els.some((other) => other !== el && other.contains(el))).map(({ i }) => i)
    );
  } catch { return []; }

  const states = [];
  const seenDiffs = new Set(); // dedupe by resulting new-node signature set
  for (const i of topIndexes) {
    if (states.length >= spec.maxStatesPerPage) break;
    // Reset to a clean page state before every trigger so opens can't compound.
    await page.goto(spec.baseUrl + seed, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle(page);
    const candidate = page.locator(TRIGGER_SELECTOR).nth(i);
    let label = `trigger${i}`;
    try {
      label = (await candidate.getAttribute('aria-label'))
        || (await candidate.innerText().catch(() => '')).trim()
        || label;
    } catch { /* keep default label */ }

    const before = await snapshotTree(page);
    const beforeSet = signatureSet(before);

    try {
      await candidate.click({ timeout: 5000 });
    } catch {
      continue; // not clickable / detached — skip this candidate
    }
    await page.waitForTimeout(300);

    const after = await snapshotTree(page);
    const newNodes = [];
    walk(after, (node, ancestors) => {
      if (beforeSet.has(signature(node))) return;
      if (node.role === 'table' || STRUCTURAL_SKIP.has(node.role)) return;
      const info = classify(node) ?? (node.role === 'option' ? { component: 'dropdown', suffix: 'Option' }
        : node.role === 'listbox' ? { component: 'dropdown', suffix: 'Options' } : null);
      if (info) newNodes.push({ node, ancestors, info });
    });
    if (newNodes.length === 0) {
      await closeOverlay(page);
      continue;
    }
    const diffKey = newNodes.map(({ node }) => signature(node)).sort().join('\n');
    if (seenDiffs.has(diffKey)) {
      // Same content revealed by a different (nested/layered) trigger — skip the
      // duplicate rather than spending the state budget on the same widget twice.
      await closeOverlay(page);
      continue;
    }
    seenDiffs.add(diffKey);

    const stateElements = [];
    for (const { node, ancestors, info } of newNodes) {
      const stateName = uniqueName(camel(node.name ?? contextualLabel(node, ancestors) ?? node.role) + info.suffix, ctx.usedNames);
      let loc = node.name ? await tryNamed(page, node.role, node.name) : null;
      stateElements.push({
        name: stateName,
        component: info.component,
        locator: loc, // may be null: still recorded (name/comment), locator omitted from YAML if unresolved
        accName: node.name ?? '(unnamed)',
      });
      if (loc) ctx.inventory.push({ component: info.component, page: ctx.slug, accName: node.name ?? '(unnamed)', locator: loc });
    }

    states.push({
      name: uniqueName(camel(label) + 'Open', ctx.usedNames),
      trigger: `open trigger "${label}"`,
      elements: stateElements,
    });

    await closeOverlay(page);
  }
  return states;
}

async function closeOverlay(page) {
  try {
    await page.keyboard.press('Escape');
    await page.mouse.click(2, 2);
  } catch { /* best-effort cleanup */ }
}

function signature(node) {
  return `${node.role}|${node.name ?? ''}`;
}

function signatureSet(tree) {
  const set = new Set();
  walk(tree, (node) => set.add(signature(node)));
  return set;
}

/** Collect same-origin, navigable hrefs from anchors on the current page. */
async function discoverNavLinks(page, baseUrl) {
  const origin = new URL(baseUrl).origin;
  let hrefs;
  try {
    hrefs = await page.locator('a[href]').evaluateAll((els) => els.map((e) => e.href));
  } catch {
    return []; // page was mid-navigation; this page's links just won't be a discovery source
  }
  const paths = new Set();
  for (const href of hrefs) {
    try {
      const u = new URL(href);
      if (u.origin !== origin) continue;               // skip external/social links
      if (/logout|signout/i.test(u.pathname)) continue; // don't crawl into logout
      paths.add(u.pathname + u.search);
    } catch {
      // ignore malformed hrefs (e.g. "javascript:void(0)")
    }
  }
  return [...paths];
}

// Raw-DOM candidates for click-discovery — deliberately NOT the ARIA-tree-derived
// ctx.elements list. Elements with no accessible name and no text content (e.g.
// saucedemo's cart icon: `<a class="shopping_cart_link"></a>`, an empty anchor
// styled via a CSS pseudo-element) never produce a node in the ARIA snapshot at
// all, so they're invisible to the rest of the pipeline. Querying markup directly
// catches those too.
const CLICKABLE_SELECTOR = 'a, button, [role="link"], [role="button"], [onclick]';

/**
 * Fallback discovery for apps that don't navigate via real `<a href>`s (JS click
 * handlers, SPA routers, href="#" icons/buttons with no accessible name at all).
 * discoverNavLinks() can't see any of that since it only reads `href` off anchors,
 * and the ARIA-tree walk skips elements with no name/content. Instead, actually
 * click every clickable-looking element on the page and see where the browser
 * ends up: if the pathname changed to a same-origin path, that's a page a real
 * user could reach that we'd otherwise miss.
 */
async function discoverNavByClicking(page, spec, seed) {
  const origin = new URL(spec.baseUrl).origin;
  const seedPath = new URL(spec.baseUrl + seed).pathname;

  let count;
  try {
    count = await page.locator(CLICKABLE_SELECTOR).count();
  } catch {
    return [];
  }
  const probeCount = Math.min(count, spec.maxClickProbesPerPage);

  const paths = new Set();
  for (let i = 0; i < probeCount; i++) {
    // Reset to a clean seed state before every probe so clicks can't compound
    // (same pattern captureStates() uses for opening triggers) — the reload also
    // keeps DOM order (and so `nth(i)`) stable across probes.
    await page.goto(spec.baseUrl + seed, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle(page);

    const candidate = page.locator(CLICKABLE_SELECTOR).nth(i);
    let label = '';
    try {
      label = (await candidate.getAttribute('aria-label'))
        || (await candidate.innerText().catch(() => ''))
        || '';
    } catch { /* keep default label */ }
    if (/logout|sign ?out/i.test(label)) continue; // don't crawl into logout

    try {
      await candidate.click({ timeout: 5000 });
    } catch {
      continue; // not clickable / detached — skip this candidate
    }
    await page.waitForTimeout(300);

    let url;
    try {
      url = new URL(page.url());
    } catch {
      continue;
    }
    if (url.origin !== origin) continue;         // left the app entirely
    if (url.pathname === seedPath) continue;      // didn't navigate (opened a widget, or a no-op)
    paths.add(url.pathname + url.search);
  }
  return [...paths];
}

// ---- emitters ---------------------------------------------------------------

function writePageYaml(slug, url, title, elements, states) {
  let sb = '';
  sb += `page: ${slug}\n`;
  sb += `url: ${url}\n`;
  sb += `title: ${yamlString(title)}\n`;
  sb += `verified: ${today()}\n`;
  sb += 'elements:\n';
  for (const e of elements) {
    sb += elementYaml(e, '  ');
  }
  if (states.length > 0) {
    sb += 'states:\n';
    for (const s of states) {
      sb += `  - name: ${s.name}\n`;
      sb += `    trigger: ${yamlString(s.trigger)}\n`;
      sb += '    elements:\n';
      for (const e of s.elements) {
        sb += elementYaml(e, '      ');
      }
    }
  }
  writeFileSync(join(OUT_DIR, `${slug}.yaml`), sb);
}

function elementYaml(e, indent) {
  let sb = '';
  sb += `${indent}- name: ${e.name}\n`;
  sb += `${indent}  component: ${e.component}\n`;
  if (e.locator) sb += `${indent}  locator: ${toYamlInline(e.locator)}\n`;
  if (e.columns) {
    sb += `${indent}  columns:\n`;
    for (const col of e.columns) {
      sb += `${indent}    - name: ${yamlString(col.name)}\n`;
    }
  }
  if (e.rowCount != null) sb += `${indent}  rowCount: ${e.rowCount}\n`;
  sb += `${indent}  comment: ${yamlString(`${e.accName} (${e.component})`)}\n`;
  return sb;
}

function writeInventory(rows) {
  const byType = new Map();
  for (const r of rows) {
    if (!byType.has(r.component)) byType.set(r.component, []);
    byType.get(r.component).push(r);
  }
  let sb = '# Component inventory\n\n';
  sb += `_Generated by \`ui-mapper-script\` on ${today()}._\n\n`;
  for (const [type, list] of byType) {
    sb += `## ${type}\n\n`;
    sb += '| Component | Page | Accessible name | Locator | Tier | Notes |\n';
    sb += '|---|---|---|---|---|---|\n';
    for (const r of list) {
      sb += `| ${r.component} | ${r.page} | ${r.accName} | \`${toYamlInline(r.locator)}\``
          + ` | ${r.locator.strategy} | ${r.locator.unstable ? (r.locator.unstableReason ?? 'unstable') : ''} |\n`;
    }
    sb += '\n';
  }
  writeFileSync(INVENTORY, sb);
}

// ---- helpers ----------------------------------------------------------------

/**
 * Build a filesystem-safe, collision-resistant slug from a page path. Using only the
 * last segment (e.g. "7") was ambiguous: apps that put an ID as the final segment
 * (/pim/viewMemberships/empNumber/7, /pim/viewJobDetails/empNumber/7, ...) all reduced
 * to the same slug and silently clobbered each other's output file. Join every segment
 * instead, so the slug is unique whenever the path is.
 */
function slugOf(path) {
  const clean = path.replace(/[?#].*$/, '');
  const segments = clean.split('/').filter(Boolean);
  return segments.length ? segments.join('-') : 'index';
}

/** camelCase from an arbitrary accessible name (or fallback label). */
function camel(s) {
  const words = String(s).replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'element';
  return words
    .map((w, i) => (i === 0 ? w[0].toLowerCase() : w[0].toUpperCase()) + w.slice(1))
    .join('');
}

function uniqueName(base, used) {
  let name = base;
  let i = 2;
  while (used.has(name)) name = base + i++;
  used.add(name);
  return name;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * `waitUntil: 'networkidle'` can hang indefinitely on pages with background polling
 * (analytics, etc.) even though the page itself is fully interactive — this bit us
 * directly on the OrangeHRM demo. Use domcontentloaded for navigation and this short,
 * bounded settle instead of waiting on network silence.
 */
async function settle(page) {
  await page.waitForLoadState('load').catch(() => {});
  // Give network activity a bounded chance to quiet down (helps SPAs finish hydrating)
  // without the unbounded hang a plain networkidle wait caused.
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  // Correctness gate: poll for non-trivial content rather than trusting a fixed delay —
  // client-rendered apps can still be blank right after 'load'.
  for (let i = 0; i < 10; i++) {
    const snap = await page.locator('body').ariaSnapshot().catch(() => '');
    if (snap.trim().length > 0) return;
    await page.waitForTimeout(300);
  }
}

main().catch((err) => {
  console.error('[app-map] ERROR', err);
  process.exit(1);
});
