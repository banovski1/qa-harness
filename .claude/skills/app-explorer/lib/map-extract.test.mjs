import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

/**
 * `__mapNav` runs inside the page, so exercising it needs a DOM. Rather than take a
 * dependency for one function, this is the smallest document that can answer the
 * handful of calls it makes: each element declares the selectors it matches, and the
 * tree is walked by hand for `contains` / `closest`.
 */
function makeDocument(spec) {
  const all = [];

  const build = (node, parent) => {
    const el = {
      tagName: (node.tag ?? 'div').toUpperCase(),
      _selectors: new Set(node.matches ?? []),
      _text: node.text ?? '',
      _attrs: node.attrs ?? {},
      _box: node.box ?? { x: 0, y: 0, width: 100, height: 20 },
      parentElement: parent,
      children: [],
    };
    el.getAttribute = (name) => (name in el._attrs ? el._attrs[name] : null);
    el.getClientRects = () => [el._box];
    el.getBoundingClientRect = () => el._box;
    Object.defineProperty(el, 'innerText', { get: () => el._text });
    Object.defineProperty(el, 'textContent', { get: () => el._text });
    el.contains = (other) => {
      for (let n = other; n; n = n.parentElement) if (n === el) return true;
      return false;
    };
    const selfMatches = (selector) => selector.split(',').some((s) => el._selectors.has(s.trim()));
    el.matches = selfMatches;
    el.closest = (selector) => {
      for (let n = el; n; n = n.parentElement) {
        if (selector.split(',').some((s) => n._selectors.has(s.trim()))) return n;
      }
      return null;
    };
    el.querySelector = (selector) => el.querySelectorAll(selector)[0] ?? null;
    el.querySelectorAll = (selector) => {
      const wanted = selector.split(',').map((s) => s.trim());
      const out = [];
      const visit = (n) => {
        for (const child of n.children) {
          if (wanted.some((s) => child._selectors.has(s))) out.push(child);
          visit(child);
        }
      };
      visit(el);
      return out;
    };

    all.push(el);
    if (parent) parent.children.push(el);
    for (const child of node.children ?? []) build(child, el);
    return el;
  };

  const root = build({ tag: 'html', matches: [], children: spec }, null);

  return {
    document: {
      querySelectorAll: (selector) => {
        const wanted = selector.split(',').map((s) => s.trim());
        return all.filter((el) => wanted.some((s) => el._selectors.has(s)));
      },
    },
    getComputedStyle: () => ({ visibility: 'visible', display: 'block' }),
    root,
  };
}

async function loadMapNav(env) {
  const src = await readFile(new URL('./map-extract.js', import.meta.url), 'utf8');
  const factory = new Function(
    'document', 'getComputedStyle',
    `${src}\nreturn __mapNav;`,
  );
  return factory(env.document, env.getComputedStyle);
}

const item = (name, href, y) => ({
  tag: 'a',
  matches: ['a[href]'],
  text: name,
  attrs: { href },
  box: { x: 0, y, width: 80, height: 20 },
});

test('a nav inside the content region loses to the application shell menu', async () => {
  // The shape that caused the bug: an overview screen offering more "Add a…" shortcuts
  // inside its own <nav> than the primary menu has modules. Both are landmarks, so only
  // the side of <main> they sit on separates them.
  const env = makeDocument([
    {
      tag: 'nav', matches: ['nav'], text: 'HOME MY KYE',
      children: [item('HOME', '#/home', 10), item('MY', '#/my', 30), item('KYE', '#/kye', 50)],
    },
    {
      tag: 'main', matches: ['main'], text: 'overview',
      children: [
        {
          tag: 'nav', matches: ['nav'], text: 'shortcuts',
          children: [
            item('Add a Trade', '#/add/trade', 100),
            item('Add an Account', '#/add/account', 120),
            item('Add a Holding', '#/add/holding', 140),
            item('Account Request', '#/add/request', 160),
            item('Gift Given', '#/add/gift', 180),
          ],
        },
      ],
    },
  ]);

  const mapNav = await loadMapNav(env);
  const nav = mapNav({});

  assert.deepEqual(nav.primary.items.map((i) => i.name), ['HOME', 'MY', 'KYE'],
    'the shell menu is the primary one even though the content nav has more entries');
  assert.ok(
    nav.secondary.some((m) => m.items.some((i) => i.name === 'Add a Trade')),
    'the content nav is still reported, as a secondary menu',
  );
});

test('with no content region to distinguish them, the larger landmark still wins', async () => {
  const env = makeDocument([
    {
      tag: 'nav', matches: ['nav'], text: 'small',
      children: [item('One', '#/one', 10), item('Two', '#/two', 30)],
    },
    {
      tag: 'nav', matches: ['nav'], text: 'big',
      children: [item('A', '#/a', 100), item('B', '#/b', 120), item('C', '#/c', 140)],
    },
  ]);

  const mapNav = await loadMapNav(env);
  const nav = mapNav({});
  assert.deepEqual(nav.primary.items.map((i) => i.name), ['A', 'B', 'C']);
});

test('a landmark holding two lists yields one menu per list, biggest first', async () => {
  // The application shell puts the module list and the open module's own screens in
  // one <nav>. Read as a single menu they merge; the per-module walk then has no
  // secondary menu to find, and the module count is the sum of both.
  const env = makeDocument([
    {
      tag: 'nav', matches: ['nav'], text: 'shell',
      children: [
        {
          tag: 'ol', matches: ['ol'], text: 'modules',
          children: [
            item('Module A', '#/a', 10), item('Module B', '#/b', 30),
            item('Module C', '#/c', 50), item('Module D', '#/d', 70),
          ],
        },
        {
          tag: 'ul', matches: ['ul'], text: 'screens of the open module',
          children: [item('Screen one', '#/a/one', 200), item('Screen two', '#/a/two', 220)],
        },
      ],
    },
  ]);

  const mapNav = await loadMapNav(env);
  const nav = mapNav({});

  assert.deepEqual(nav.primary.items.map((i) => i.name), ['Module A', 'Module B', 'Module C', 'Module D']);
  assert.deepEqual(nav.secondary.map((m) => m.items.map((i) => i.name)), [['Screen one', 'Screen two']],
    'the second list survives as a secondary menu rather than being merged or dropped');
});

test('a wrapper and the entry inside it are one item even when named differently', async () => {
  // The <li> takes its name from an icon and the <a> inside carries an aria-label, so
  // name-based de-duplication sees two entries where the DOM has one.
  const env = makeDocument([
    {
      tag: 'nav', matches: ['nav'], text: 'shell',
      children: [
        {
          tag: 'li', matches: ['[class*="menu-item" i]'], text: 'HOME',
          box: { x: 0, y: 10, width: 80, height: 20 },
          children: [{ ...item('ignored', '#/home', 10), attrs: { href: '#/home', 'aria-label': 'Compliance Manager' } }],
        },
        {
          tag: 'li', matches: ['[class*="menu-item" i]'], text: 'MY',
          box: { x: 0, y: 40, width: 80, height: 20 },
          children: [{ ...item('ignored', '#/my', 40), attrs: { href: '#/my', 'aria-label': 'My MCO' } }],
        },
      ],
    },
  ]);

  const mapNav = await loadMapNav(env);
  const nav = mapNav({});
  assert.deepEqual(nav.primary.items.map((i) => i.name), ['Compliance Manager', 'My MCO'],
    'one entry per wrapper, named by the link the user actually activates');
});
