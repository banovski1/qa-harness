// In-page fragment. Runs in the page, returns the whole screen as one object so
// nothing about the inventory depends on how much of a snapshot fitted in an
// agent's context.

var INTERACTIVE_SELECTOR = [
  'a[href]', 'button', 'input', 'select', 'textarea',
  '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="radio"]',
  '[role="tab"]', '[role="menuitem"]', '[role="combobox"]', '[role="switch"]',
  '[role="option"]', '[role="searchbox"]', '[role="textbox"]',
  '[contenteditable="true"]', '[tabindex]:not([tabindex="-1"])',
].join(',');

var DESTRUCTIVE = /\b(save|delete|remove|submit|send|apply|confirm|deactivate|merge|convert|import|export|reset password)\b/i;

// An id minted per render (`contact-edit-3598`, a hash, a bare counter) is worse
// than no id at all: it looks stable in one crawl and differs in the next. It is
// rejected wherever a locator could anchor to it.
function looksGenerated(value) {
  return !value
    || /\d{3,}/.test(value)
    || /[0-9a-f]{12,}/i.test(value)
    || /^[a-z]?\d+$/i.test(value);
}

function esc(value) {
  return String(value).replace(/(["\\])/g, '\\$1');
}

function isVisible(el) {
  if (!el.isConnected) return false;
  var style = getComputedStyle(el);
  if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
  var box = el.getBoundingClientRect();
  return box.width > 0 && box.height > 0;
}

function textOf(el) {
  return (el.textContent || '').replace(/\s+/g, ' ').trim();
}

// A pragmatic subset of the ARIA role mapping: enough to name what a test would
// address, without pulling a full accessibility implementation into the page.
function roleOf(el) {
  var explicit = el.getAttribute('role');
  if (explicit) return explicit.trim().split(/\s+/)[0];
  var tag = el.tagName.toLowerCase();
  if (tag === 'a') return el.hasAttribute('href') ? 'link' : null;
  if (tag === 'button') return 'button';
  if (tag === 'select') return el.multiple || el.size > 1 ? 'listbox' : 'combobox';
  if (tag === 'textarea') return 'textbox';
  if (tag === 'input') {
    var type = (el.getAttribute('type') || 'text').toLowerCase();
    if (type === 'checkbox') return 'checkbox';
    if (type === 'radio') return 'radio';
    if (type === 'search') return 'searchbox';
    if (type === 'submit' || type === 'button' || type === 'reset') return 'button';
    if (type === 'range') return 'slider';
    if (type === 'number') return 'spinbutton';
    if (type === 'hidden') return null;
    return 'textbox';
  }
  return null;
}

function labelTextFor(el) {
  var byAttr = el.getAttribute('aria-labelledby');
  if (byAttr) {
    var parts = byAttr.split(/\s+/).map(function (id) {
      var node = document.getElementById(id);
      return node ? textOf(node) : '';
    }).filter(Boolean);
    if (parts.length) return parts.join(' ');
  }
  if (el.id) {
    var explicit = document.querySelector('label[for="' + esc(el.id) + '"]');
    if (explicit) return textOf(explicit);
  }
  var wrapping = el.closest('label');
  if (wrapping) return textOf(wrapping);
  return '';
}

function accessibleName(el) {
  var aria = el.getAttribute('aria-label');
  if (aria && aria.trim()) return aria.trim();
  var label = labelTextFor(el);
  if (label) return label;
  var own = textOf(el);
  if (own) return own;
  var placeholder = el.getAttribute('placeholder');
  if (placeholder && placeholder.trim()) return placeholder.trim();
  var title = el.getAttribute('title');
  if (title && title.trim()) return title.trim();
  var alt = el.querySelector && el.querySelector('img[alt]');
  if (alt) return alt.getAttribute('alt').trim();
  return '';
}

function dataAttributes(el) {
  var out = {};
  for (var i = 0; i < el.attributes.length; i++) {
    var attr = el.attributes[i];
    if (attr.name.indexOf('data-') === 0) out[attr.name] = attr.value;
  }
  return out;
}

function testIdOf(el, testIdAttribute) {
  var raw = el.getAttribute(testIdAttribute);
  return raw && raw.trim() ? raw.trim() : null;
}

// A path scoped to the nearest stable ancestor, so it survives sibling churn
// better than a root-anchored chain of :nth-child.
function cssPath(el) {
  var parts = [];
  var node = el;
  while (node && node.nodeType === 1 && parts.length < 6) {
    var tag = node.tagName.toLowerCase();
    if (node.id && !looksGenerated(node.id) && document.querySelectorAll('#' + CSS.escape(node.id)).length === 1) {
      parts.unshift('#' + CSS.escape(node.id));
      break;
    }
    var selector = tag;
    var classes = (node.getAttribute('class') || '').trim().split(/\s+/)
      .filter(function (c) { return c && !/\d/.test(c); }).slice(0, 2);
    if (classes.length) selector += '.' + classes.map(function (c) { return CSS.escape(c); }).join('.');
    var parent = node.parentElement;
    if (parent) {
      var sameKind = Array.prototype.filter.call(parent.children, function (sib) {
        return sib.tagName === node.tagName;
      });
      if (sameKind.length > 1) selector += ':nth-of-type(' + (sameKind.indexOf(node) + 1) + ')';
    }
    parts.unshift(selector);
    node = node.parentElement;
  }
  return parts.join(' > ');
}

// The region an element sits in, taken from the nearest landmark or semantic
// container. This is what turns a flat element list into a component analysis.
function regionOf(el) {
  var node = el;
  while (node && node !== document.body) {
    var role = node.getAttribute && node.getAttribute('role');
    var tag = node.tagName.toLowerCase();
    if (role === 'dialog' || role === 'alertdialog' || tag === 'dialog') return 'dialog';
    if (role === 'navigation' || tag === 'nav') return 'navigation';
    if (role === 'banner' || tag === 'header') return 'header';
    if (role === 'contentinfo' || tag === 'footer') return 'footer';
    if (tag === 'form' || role === 'form') return 'form';
    if (tag === 'table' || role === 'table' || role === 'grid') return 'table';
    if (role === 'search') return 'search';
    if (role === 'toolbar') return 'toolbar';
    if (role === 'main' || tag === 'main') return 'main';
    node = node.parentElement;
  }
  return 'body';
}

// Attributes an application uses to name a region or a field on purpose. An
// ancestor carrying one is a far better anchor than the markup path to it.
var ANCHOR_ATTRIBUTES = ['data-name', 'data-field', 'data-view', 'data-panel', 'data-role', 'data-id'];

function anchorSelectorFor(el) {
  var node = el.parentElement;
  var hops = 0;
  while (node && node !== document.body && hops < 5) {
    for (var i = 0; i < ANCHOR_ATTRIBUTES.length; i++) {
      var attr = ANCHOR_ATTRIBUTES[i];
      var value = node.getAttribute(attr);
      if (value && value.trim() && !looksGenerated(value)) {
        return '[' + attr + '="' + esc(value.trim()) + '"]';
      }
    }
    node = node.parentElement;
    hops++;
  }
  return null;
}

function countRoleName(role, name, index) {
  var key = role + '\u0000' + name;
  return index[key] || 0;
}

function buildCandidates(el, meta, index, testIdAttribute) {
  var out = [];
  function push(strategy, expression, matchCount, args) {
    out.push({ strategy: strategy, expression: expression, matchCount: matchCount, args: args });
  }
  if (meta.testId) {
    push('testId',
      "getByTestId('" + esc(meta.testId) + "')",
      document.querySelectorAll('[' + testIdAttribute + '="' + esc(meta.testId) + '"]').length,
      [meta.testId]);
  }
  if (meta.role && meta.name) {
    push('role',
      "getByRole('" + meta.role + "', { name: '" + esc(meta.name) + "', exact: true })",
      countRoleName(meta.role, meta.name, index.roleName),
      [meta.role, meta.name]);
  }
  if (meta.label) {
    push('label',
      "getByLabel('" + esc(meta.label) + "', { exact: true })",
      index.label[meta.label] || 0,
      [meta.label]);
  }
  if (meta.placeholder) {
    push('placeholder',
      "getByPlaceholder('" + esc(meta.placeholder) + "', { exact: true })",
      document.querySelectorAll('[placeholder="' + esc(meta.placeholder) + '"]').length,
      [meta.placeholder]);
  }
  // An element's own naming attribute beats an ancestor's, so try it first.
  var ownAnchor = null;
  for (var a = 0; a < ANCHOR_ATTRIBUTES.length; a++) {
    var ownValue = el.getAttribute(ANCHOR_ATTRIBUTES[a]);
    if (ownValue && ownValue.trim()) {
      ownAnchor = '[' + ANCHOR_ATTRIBUTES[a] + '="' + esc(ownValue.trim()) + '"]';
      break;
    }
  }
  var scopedSelectors = [];
  if (ownAnchor) scopedSelectors.push(meta.tag + ownAnchor);
  var anchor = anchorSelectorFor(el);
  if (anchor) {
    scopedSelectors.push(anchor + ' ' + meta.tag + (meta.type && meta.tag === 'input' ? '[type="' + esc(meta.type) + '"]' : ''));
    scopedSelectors.push(anchor + ' ' + meta.tag);
  }
  for (var s = 0; s < scopedSelectors.length; s++) {
    var selector = scopedSelectors[s];
    var count = 0;
    try { count = document.querySelectorAll(selector).length; } catch (e) { continue; }
    if (count) push('scoped', "locator('" + esc(selector) + "')", count, [selector]);
  }
  if (meta.id && !looksGenerated(meta.id)) {
    push('attribute', "locator('#" + esc(meta.id) + "')",
      document.querySelectorAll('#' + CSS.escape(meta.id)).length, ['#' + meta.id]);
  }
  if (meta.nameAttr) {
    var sel = meta.tag + '[name="' + esc(meta.nameAttr) + '"]';
    push('attribute', "locator('" + esc(sel) + "')", document.querySelectorAll(sel).length, [sel]);
  }
  if (meta.text && meta.text.length <= 60) {
    push('text', "getByText('" + esc(meta.text) + "', { exact: true })",
      index.text[meta.text] || 0, [meta.text]);
  }
  var path = cssPath(el);
  if (path) {
    var pathMatches = 0;
    try { pathMatches = document.querySelectorAll(path).length; } catch (e) { pathMatches = 0; }
    push('css', "locator('" + esc(path) + "')", pathMatches, [path]);
  }
  return out;
}

function __extractScreen(options) {
  var opts = options || {};
  var testIdAttribute = opts.testIdAttribute || 'data-testid';
  var elements = Array.prototype.slice.call(document.querySelectorAll(INTERACTIVE_SELECTOR));

  var metas = elements.map(function (el) {
    var role = roleOf(el);
    var name = accessibleName(el);
    return {
      el: el,
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type') || null,
      role: role,
      name: name,
      text: textOf(el),
      label: labelTextFor(el),
      placeholder: el.getAttribute('placeholder') || '',
      id: el.getAttribute('id') || '',
      nameAttr: el.getAttribute('name') || '',
      testId: testIdOf(el, testIdAttribute),
      data: dataAttributes(el),
      region: regionOf(el),
      visible: isVisible(el),
      disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true',
      href: el.getAttribute('href') || null,
      box: (function () {
        var b = el.getBoundingClientRect();
        return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
      })(),
    };
  });

  // Match counts are computed against the live document, which is the whole
  // point of running here rather than over source: uniqueness is proved.
  var index = { roleName: {}, label: {}, text: {} };
  metas.forEach(function (m) {
    if (m.role && m.name) {
      var key = m.role + '\u0000' + m.name;
      index.roleName[key] = (index.roleName[key] || 0) + 1;
    }
    if (m.label) index.label[m.label] = (index.label[m.label] || 0) + 1;
    if (m.text) index.text[m.text] = (index.text[m.text] || 0) + 1;
  });

  var out = metas.map(function (m, i) {
    var candidates = buildCandidates(m.el, m, index, testIdAttribute);
    var decision = chooseLocator(candidates);
    return {
      index: i,
      tag: m.tag,
      type: m.type,
      role: m.role,
      name: m.name,
      label: m.label || null,
      placeholder: m.placeholder || null,
      id: m.id || null,
      nameAttr: m.nameAttr || null,
      testId: m.testId,
      data: m.data,
      region: m.region,
      visible: m.visible,
      disabled: m.disabled,
      destructive: DESTRUCTIVE.test(m.name || ''),
      href: m.href,
      box: m.box,
      locator: decision.chosen,
      unique: decision.unique,
      fragile: !!decision.fragile,
      ambiguityReason: decision.reason || null,
      // The chosen locator plus its three best alternatives. Keeping every
      // candidate for every element multiplied the inventory's size several times
      // over to record expressions nothing would ever choose.
      // Alternatives are kept for visible controls only — those are the ones a
      // human will re-pick a locator for. A hidden control keeps its chosen
      // locator and nothing else.
      candidates: m.visible
        ? candidates
          .slice()
          .sort(function (a, b) { return rankOf(a.strategy) - rankOf(b.strategy); })
          .slice(0, 4)
        : [],
    };
  });

  // In-app links are the crawl's fuel; absolute externals are recorded but never
  // enqueued by the driver.
  var links = Array.prototype.slice.call(document.querySelectorAll('a[href]')).map(function (a) {
    return { href: a.getAttribute('href'), resolved: a.href, text: textOf(a).slice(0, 80) };
  });

  var headings = Array.prototype.slice.call(document.querySelectorAll('h1,h2,h3')).map(function (h) {
    return { level: Number(h.tagName.slice(1)), text: textOf(h).slice(0, 120) };
  }).filter(function (h) { return h.text; });

  var tables = Array.prototype.slice.call(document.querySelectorAll('table')).map(function (t) {
    return {
      columns: Array.prototype.slice.call(t.querySelectorAll('thead th, tr:first-child th')).map(function (th) {
        return textOf(th);
      }).filter(Boolean),
      rowCount: t.querySelectorAll('tbody tr').length || Math.max(0, t.querySelectorAll('tr').length - 1),
    };
  });

  var regionCounts = {};
  out.forEach(function (e) { regionCounts[e.region] = (regionCounts[e.region] || 0) + 1; });

  return {
    url: location.href,
    path: location.pathname + location.search + location.hash,
    title: document.title,
    headings: headings,
    tables: tables,
    regions: regionCounts,
    elements: out,
    links: links,
    // Counted over visible controls, because a locator for something the user
    // cannot see is not a result a test can use.
    stats: (function () {
      var visible = out.filter(function (e) { return e.visible; });
      return {
        elements: out.length,
        visible: visible.length,
        hidden: out.length - visible.length,
        semantic: visible.filter(function (e) { return e.unique && !e.fragile; }).length,
        fragile: visible.filter(function (e) { return e.unique && e.fragile; }).length,
        ambiguous: visible.filter(function (e) { return !e.unique; }).length,
        withTestId: visible.filter(function (e) { return !!e.testId; }).length,
      };
    })(),
  };
}
