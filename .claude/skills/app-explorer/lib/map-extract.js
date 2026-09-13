// Runs inside the page. Answers one question per screen: what does a tester see
// here? Names and shapes only — never a value, never a locator.

function __mapExtract() {
  const MAX_TEXT = 60;
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT);

  const visible = (el) => {
    if (!el || !el.getClientRects().length) return false;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0) return false;
    const box = el.getBoundingClientRect();
    return box.width > 1 && box.height > 1;
  };

  // The accessible name, near enough: what a tester would call the thing.
  const nameOf = (el) => {
    const aria = el.getAttribute && el.getAttribute('aria-label');
    if (aria) return clean(aria);
    const labelledBy = el.getAttribute && el.getAttribute('aria-labelledby');
    if (labelledBy) {
      const source = document.getElementById(labelledBy.split(' ')[0]);
      if (source) return clean(source.textContent);
    }
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
      if (el.id) {
        const explicit = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
        if (explicit) return clean(explicit.textContent);
      }
      const wrapping = el.closest('label');
      if (wrapping) return clean(wrapping.textContent);
      // The pattern with no `for=`: a label beside the control inside a wrapper.
      let node = el.parentElement;
      for (let up = 0; up < 3 && node; up++, node = node.parentElement) {
        const label = node.querySelector('label, .label, [class*="label" i]');
        if (label && !label.contains(el)) {
          const text = clean(label.textContent);
          if (text) return text;
        }
      }
      if (el.placeholder) return clean(el.placeholder);
      if (el.name) return clean(el.name);
      return '';
    }
    const text = clean(el.innerText || el.textContent);
    if (text) return text;
    const title = el.getAttribute && el.getAttribute('title');
    return title ? clean(title) : '';
  };

  // A design system builds its dropdown from a div. Recognising only real inputs
  // reports a filter bar of five controls as a filter bar of one.
  const CONTROL = [
    'input', 'select', 'textarea',
    '[role="combobox"]', '[role="listbox"]', '[role="switch"]', '[role="spinbutton"]',
    '[class*="select-text" i]', '[class*="dropdown-toggle" i]', '[contenteditable="true"]',
  ].join(',');

  const LABEL = 'label,.label,[class*="label" i],legend,dt';

  /** The label that belongs to a control, whatever the control is made of. */
  const labelFor = (el) => {
    const aria = el.getAttribute('aria-label');
    if (aria) return clean(aria);
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
      const source = document.getElementById(labelledBy.split(' ')[0]);
      if (source) return clean(source.textContent);
    }
    if (el.id) {
      const explicit = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (explicit) return clean(explicit.textContent);
    }
    const wrapping = el.closest('label');
    if (wrapping) return clean(wrapping.textContent);
    // No `for=`: the label is a sibling inside a shared wrapper. Walk out until one
    // appears, and stop before the wrapper is large enough to belong to the page.
    let node = el.parentElement;
    for (let up = 0; up < 4 && node; up++, node = node.parentElement) {
      // Stop once the wrapper also covers a *different* control — its label would
      // belong to that one. A control's own inner parts do not count.
      const others = Array.from(node.querySelectorAll(CONTROL))
        .filter((other) => other !== el && !other.contains(el) && !el.contains(other));
      if (others.length) break;
      const label = node.querySelector(LABEL);
      if (label && !label.contains(el)) {
        const text = clean(label.textContent);
        if (text) return text;
      }
    }
    return '';
  };

  const typeOf = (el) => {
    if (el.tagName === 'SELECT') return 'select';
    if (el.tagName === 'TEXTAREA') return 'textarea';
    const role = el.getAttribute('role');
    if (role === 'switch') return 'toggle';
    if (role === 'combobox' || role === 'listbox') return 'dropdown';
    if (el.tagName !== 'INPUT') return 'dropdown';          // a div that behaves as one
    return el.type || 'text';
  };

  const isNavigational = (el) => !!el.closest('nav,[role="navigation"],aside,header,[class*="sidepanel" i],[class*="sidebar" i],[class*="topbar" i],[role="tablist"]');

  /** The main content region, so navigation chrome is not reported as page content. */
  const contentRoot = () => {
    const main = document.querySelector('main,[role="main"],.content,#content,[class*="main-content" i]');
    if (main && visible(main)) return main;
    return document.body;
  };

  const DESTRUCTIVE = /\b(delete|remove|destroy|reset|wipe|purge)\b/i;

  const root = contentRoot();
  const within = (selector) => Array.from(root.querySelectorAll(selector)).filter(visible);

  // ---- buttons: what a tester can press here
  const buttons = [];
  const seenButtons = new Set();
  for (const el of within('button,[role="button"],input[type="submit"],input[type="button"],a[class*="button" i],a[class*="btn" i]')) {
    if (isNavigational(el)) continue;
    const name = nameOf(el) || clean(el.value);
    // Pagination renders as numbered buttons; they are not actions a test performs.
    if (!name || /^[\d\s.,>«»<-]+$/.test(name) || seenButtons.has(name.toLowerCase())) continue;
    seenButtons.add(name.toLowerCase());
    buttons.push({
      name,
      destructive: DESTRUCTIVE.test(name) || undefined,
      href: el.tagName === 'A' ? (el.getAttribute('href') || undefined) : undefined,
      disabled: el.disabled || el.getAttribute('aria-disabled') === 'true' ? true : undefined,
    });
    if (buttons.length >= 40) break;
  }

  // ---- controls: the filters and fields on the screen
  const fields = [];
  const seenFields = new Set();
  // A div-built dropdown is a cluster: a wrapper, an inner text node, a caret. The
  // wrapper is the control; the parts are not. A native input, by contrast, is the
  // control even when a div wraps it. Getting this backwards reports a filter bar of
  // five dropdowns as a filter bar of none, because each inner part looks like a
  // sibling control and blocks the label lookup.
  const candidates = within(CONTROL).filter((el) => !isNavigational(el));
  const native = (el) => el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA';
  const controls = candidates.filter((el) => {
    if (native(el)) return true;
    if (el.querySelector('input,select,textarea')) return false;      // wraps a real control
    return !candidates.some((other) => other !== el && !native(other) && other.contains(el));
  });

  for (const el of controls) {
    const type = typeOf(el);
    if (type === 'hidden' || type === 'submit' || type === 'button') continue;
    const name = labelFor(el) || clean(el.placeholder) || clean(el.name);
    if (!name) continue;
    const key = type + ':' + name.toLowerCase();
    if (seenFields.has(key)) continue;
    seenFields.add(key);
    const field = { name, type };
    if (el.tagName === 'SELECT') {
      const options = Array.from(el.options).map((o) => clean(o.textContent)).filter(Boolean).slice(0, 12);
      if (options.length) field.options = options;
    }
    if (el.required || el.getAttribute('aria-required') === 'true') field.required = true;
    fields.push(field);
    if (fields.length >= 40) break;
  }

  // ---- collections: a table is only a table when it has a header row
  const collections = [];
  for (const table of within('table,[role="table"],[role="grid"]')) {
    const headerCells = Array.from(table.querySelectorAll('th,[role="columnheader"]')).filter(visible);
    if (!headerCells.length) continue;                    // a layout table, not a collection
    const bodyRows = table.querySelectorAll('tbody tr,[role="row"]');
    collections.push({
      kind: 'table',
      columns: headerCells.map((c) => clean(c.textContent)).filter(Boolean).slice(0, 20),
      rows: Math.max(0, bodyRows.length - (table.querySelector('thead') ? 0 : headerCells.length ? 1 : 0)),
    });
    if (collections.length >= 4) break;
  }
  if (!collections.length) {
    // A grid built from divs: a header row and repeated sibling rows, named by role.
    const header = within('[class*="table-header" i],[role="rowgroup"] [role="columnheader"]')[0];
    if (header) {
      const container = header.closest('[class*="table" i],[role="table"]') || header.parentElement;
      const cells = Array.from(container.querySelectorAll('[role="columnheader"],[class*="header-cell" i]')).filter(visible);
      const rows = container.querySelectorAll('[role="row"],[class*="table-row" i],[class*="card" i]');
      if (cells.length) {
        collections.push({ kind: 'grid', columns: cells.map((c) => clean(c.textContent)).filter(Boolean).slice(0, 20), rows: rows.length });
      }
    }
  }

  // ---- heading: what the screen calls itself
  const headingEl = within('h1,h2,h3,h4,h5,[role="heading"],[class*="topbar-header-title" i],[class*="page-title" i]')[0];

  return {
    url: location.href,
    title: clean(document.title),
    heading: headingEl ? nameOf(headingEl) : '',
    buttons,
    fields,
    collections,
    counts: {
      buttons: buttons.length,
      fields: fields.length,
      collections: collections.length,
    },
  };
}

/**
 * The application's own menus, found without knowing the application.
 *
 * A menu is a group of links or menu items that live together in a landmark and
 * whose labels are short. The primary menu is the largest such group; a secondary
 * menu is any other group that is not part of it.
 */
function __mapNav(options) {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const visible = (el) => {
    if (!el || !el.getClientRects().length) return false;
    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.display === 'none') return false;
    const box = el.getBoundingClientRect();
    return box.width > 1 && box.height > 1;
  };
  // A menu entry is not always a link or a button. A parent that only opens a
  // submenu is often a span with a caret, so anything that announces a popup, or
  // sits in a slot named like a nav tab, counts too.
  const ITEM = [
    'a[href]', 'button', '[role="menuitem"]', '[role="tab"]', '[role="link"]',
    '[aria-haspopup]', '[class*="nav-tab" i]', '[class*="menu-item" i]', '[class*="navitem" i]',
  ].join(',');

  const nameOf = (el) => {
    const aria = el.getAttribute('aria-label');
    if (aria) return clean(aria);
    return clean(el.innerText || el.textContent || el.getAttribute('title'));
  };

  const describe = ({ el, popupSource }, index) => ({
    index,
    name: nameOf(el),
    href: el.tagName === 'A' ? el.getAttribute('href') : null,
    // The popup marker belongs to the wrapper, which may not be the element chosen.
    hasPopup: [el, popupSource].some((node) => node.getAttribute('aria-haspopup') === 'true'
      || node.getAttribute('aria-expanded') !== null
      || !!node.querySelector('svg,i,[class*="caret" i],[class*="chevron" i],[class*="arrow" i]')),
    box: (() => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y) }; })(),
  });

  // Candidate containers, with how strongly each announces itself as navigation.
  // Size alone is the wrong test: Conduit's tag cloud has five times the links of
  // its navbar and is not a menu, so a real landmark outranks a bigger group.
  const WEIGHTS = [
    ['nav', 100], ['[role="navigation"]', 100], ['[role="menubar"]', 100], ['[role="tablist"]', 80],
    ['aside', 60], ['[class*="sidepanel" i]', 60], ['[class*="sidebar" i]', 60],
    ['[class*="topbar" i]', 50], ['[class*="navbar" i]', 50], ['[class*="menu" i]', 40],
  ];
  const containers = new Map();
  for (const [selector, weight] of WEIGHTS) {
    for (const el of document.querySelectorAll(selector)) {
      if (!visible(el)) continue;
      containers.set(el, Math.max(containers.get(el) || 0, weight));
    }
  }

  const groups = [];
  for (const [container, weight] of containers) {
    const candidates = Array.from(container.querySelectorAll(ITEM)).filter(visible)
      .filter((el) => { const n = nameOf(el); return n && n.length <= 40; });
    // The broader selector matches a wrapper and the link inside it. Keep one per
    // name, and prefer the element that carries a real href: the wrapper owns the
    // popup, but the link is the only thing that says where the entry goes.
    const grouped = new Map();
    for (const el of candidates) {
      const key = nameOf(el).toLowerCase();
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(el);
    }
    const chosen = new Map();
    for (const [key, group] of grouped) {
      const linked = group.find((el) => el.tagName === 'A'
        && el.getAttribute('href') && !/^#?$/.test(el.getAttribute('href')));
      const outermost = group.reduce((a, b) => (a.contains(b) ? a : b));
      chosen.set(key, { el: linked || outermost, popupSource: outermost });
    }
    const items = candidates
      .filter((el) => chosen.get(nameOf(el).toLowerCase()).el === el)
      .map((el) => ({ el, popupSource: chosen.get(nameOf(el).toLowerCase()).popupSource }));
    if (items.length < 2) continue;
    // A container that merely wraps another candidate contributes nothing new.
    if (groups.some((g) => g.container !== container && g.container.contains(container))) continue;
    const boxes = items.map(({ el }) => el.getBoundingClientRect());
    const vertical = new Set(boxes.map((b) => Math.round(b.x / 20))).size <= 2;
    groups.push({
      container,
      items,
      vertical,
      top: Math.min(...boxes.map((b) => b.y)),
      left: Math.min(...boxes.map((b) => b.x)),
      count: items.length,
      weight,
    });
  }
  // Drop a group entirely contained in a larger one.
  const kept = groups.filter((g) => !groups.some((other) => other !== g && other.container.contains(g.container) && other.count >= g.count));
  // Landmark first, size second: a <nav> of three entries is the menu, and a list of
  // twenty links that is not a landmark is content.
  kept.sort((a, b) => (b.weight - a.weight) || (b.count - a.count));

  const exclude = new Set((options && options.excludeNames || []).map((n) => n.toLowerCase()));
  const asMenu = (group) => ({
    vertical: group.vertical,
    items: group.items.map(describe).filter((item) => item.name && !exclude.has(item.name.toLowerCase())),
  });

  const primary = kept[0] ? asMenu(kept[0]) : { vertical: true, items: [] };
  const others = kept.slice(1, 4).map(asMenu).filter((m) => m.items.length >= 2);
  return { primary, secondary: others };
}
