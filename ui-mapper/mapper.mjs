#!/usr/bin/env node
// Deterministic replacement for the LLM-driven `app-map` skill.
//
// Given a login flow as parameters (see ui-model/app-map.yaml) — entry URL,
// credentials, and the locators for username / password / submit — it logs in once
// and builds the UI map of any application from the accessibility (ARIA) tree,
// emitting ui-model/application-map/<slug>.yaml and ui-model/component-inventory.md
// with the same schema the skill produced.
//
//   node ui-mapper/mapper.mjs [path/to/app-map.yaml]
//
// Run from the repo root so ui-model/ resolves correctly.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';
import { chromium } from 'playwright';
import { fromMap, resolve, toYamlInline, yamlString } from './locator-spec.mjs';

const OUT_DIR = join('ui-model', 'application-map');
const INVENTORY = join('ui-model', 'component-inventory.md');

// role -> { component, suffix } for the a11y roles worth mapping.
const ROLE_INFO = {
  textbox:  { component: 'input',    suffix: 'Input' },
  button:   { component: 'button',   suffix: 'Button' },
  link:     { component: 'link',     suffix: 'Link' },
  checkbox: { component: 'checkbox', suffix: 'Checkbox' },
  radio:    { component: 'radio',    suffix: 'Radio' },
  combobox: { component: 'dropdown', suffix: 'Dropdown' },
  tab:      { component: 'tab',      suffix: 'Tab' },
  img:      { component: 'image',    suffix: 'Image' },
  alert:    { component: 'alert',    suffix: 'Alert' },
  heading:  { component: 'text',     suffix: 'Heading' },
};

// matches an aria-snapshot node line:  - <role> "<name>"  (optional [attrs]/trailing ':')
const NODE_RE = /^\s*-\s+([a-zA-Z]+)(?:\s+"((?:[^"\\]|\\.)*)")?.*$/;

async function main() {
  const specPath = process.argv[2] ?? join('ui-model', 'app-map.yaml');
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
    discoverLinks: root.crawl?.discoverLinks !== false, // on by default
    maxPages: Number(root.crawl?.maxPages ?? 40),
  };
}

/** Parameterized login: fill username/password and submit using the spec's locators. */
async function login(page, spec) {
  await page.goto(spec.baseUrl + spec.loginUrl, { waitUntil: 'networkidle' });
  await resolve(page, spec.usernameLocator).fill(spec.username);
  await resolve(page, spec.passwordLocator).fill(spec.password);
  await resolve(page, spec.submitLocator).click();
  if (spec.successSignal) {
    await resolve(page, spec.successSignal).first().waitFor();
  } else {
    await page.waitForLoadState('networkidle');
  }
  console.log(`[app-map] logged in, now at ${page.url()}`);
}

/**
 * Snapshot one page's a11y tree, emit its YAML map, and return same-origin nav
 * links discovered on the page (as paths) so the caller can queue them.
 */
async function mapPage(page, spec, seed, inventory) {
  await page.goto(spec.baseUrl + seed, { waitUntil: 'networkidle' });

  const slug = slugOf(seed);
  const title = await page.title();
  const aria = await page.locator('body').ariaSnapshot();

  const elements = [];
  const usedNames = new Set();

  for (const line of aria.split('\n')) {
    const m = NODE_RE.exec(line);
    if (!m) continue;
    const role = m[1];
    let accName = m[2];
    const info = ROLE_INFO[role];
    if (!info || !accName) continue;
    accName = unescape(accName);

    const loc = await deriveLocator(page, role, accName);
    if (!loc) continue; // not uniquely addressable from the a11y tree

    const name = uniqueName(camel(accName) + info.suffix, usedNames);
    elements.push({ name, component: info.component, locator: loc, accName });
    inventory.push({ component: info.component, page: slug, accName, locator: loc });
  }

  writePageYaml(slug, seed, title, elements);
  console.log(`[app-map] ${slug}: ${elements.length} element(s)`);

  return discoverNavLinks(page, spec.baseUrl);
}

/** Collect same-origin, navigable hrefs from anchors on the current page. */
async function discoverNavLinks(page, baseUrl) {
  const origin = new URL(baseUrl).origin;
  const hrefs = await page.locator('a[href]').evaluateAll((els) => els.map((e) => e.href));
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

/**
 * Derive a locator by the priority ladder and verify it resolves to exactly one
 * element. getByRole(role, name) is preferred; lower tiers are fallbacks.
 */
async function deriveLocator(page, role, accName) {
  const byRole = { strategy: 'getByRole', args: [role], name: accName, unstable: false };
  if (await isUnique(resolve(page, byRole))) return byRole;

  for (const strategy of ['getByLabel', 'getByPlaceholder', 'getByAltText', 'getByText']) {
    const cand = { strategy, args: [accName], name: null, unstable: false };
    if (await isUnique(resolve(page, cand))) return cand;
  }
  return null;
}

async function isUnique(locator) {
  try {
    return (await locator.count()) === 1;
  } catch {
    return false;
  }
}

// ---- emitters ---------------------------------------------------------------

function writePageYaml(slug, url, title, elements) {
  let sb = '';
  sb += `page: ${slug}\n`;
  sb += `url: ${url}\n`;
  sb += `title: ${yamlString(title)}\n`;
  sb += `verified: ${today()}\n`;
  sb += 'elements:\n';
  for (const e of elements) {
    sb += `  - name: ${e.name}\n`;
    sb += `    component: ${e.component}\n`;
    sb += `    locator: ${toYamlInline(e.locator)}\n`;
    sb += `    comment: ${yamlString(`${e.accName} (${e.component})`)}\n`;
  }
  writeFileSync(join(OUT_DIR, `${slug}.yaml`), sb);
}

function writeInventory(rows) {
  const byType = new Map();
  for (const r of rows) {
    if (!byType.has(r.component)) byType.set(r.component, []);
    byType.get(r.component).push(r);
  }
  let sb = '# Component inventory\n\n';
  sb += `_Generated by \`ui-mapper\` on ${today()}._\n\n`;
  for (const [type, list] of byType) {
    sb += `## ${type}\n\n`;
    sb += '| Component | Page | Accessible name | Locator | Tier | Notes |\n';
    sb += '|---|---|---|---|---|---|\n';
    for (const r of list) {
      sb += `| ${r.component} | ${r.page} | ${r.accName} | \`${toYamlInline(r.locator)}\``
          + ` | ${r.locator.strategy} | ${r.locator.unstable ? 'unstable' : ''} |\n`;
    }
    sb += '\n';
  }
  writeFileSync(INVENTORY, sb);
}

// ---- helpers ----------------------------------------------------------------

function slugOf(path) {
  const clean = path.replace(/[?#].*$/, '');
  const last = clean.split('/').filter(Boolean).pop();
  return last || 'index';
}

/** camelCase from an arbitrary accessible name. */
function camel(s) {
  const words = s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).filter(Boolean);
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

function unescape(s) {
  return s.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

main().catch((err) => {
  console.error('[app-map] ERROR', err);
  process.exit(1);
});
