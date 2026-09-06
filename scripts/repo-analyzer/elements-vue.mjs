// Element extraction from a Vue template AST.
//
// The parsers in parsers.mjs answer "what components exist"; this answers "what does a page
// put on screen, and how would a test find it". It is deliberately conservative: an element
// whose label cannot be resolved is dropped rather than guessed at, because a guessed label
// produces a locator that matches nothing and fails far from its cause.
//
// Nothing here picks a locator strategy. Signals are gathered and handed to the ladder, which
// is what keeps this extractor and the codegen shaping step ranking locators the same way.

import {bestLocatorFor} from '../framework-generator/locator-ladder.mjs';
import {toCamel} from '../framework-generator/naming.mjs';
import {isTestIdAttr} from './util.mjs';
import {resolveLabelExpression} from './i18n.mjs';

/**
 * Tag → the generator's closed `component:` vocabulary. A tag that is not here yields no
 * element: an unmapped tag is an unknown, and an unknown must not become a guess.
 */
export const TAG_KINDS = {
  'oxd-input-field': 'input',
  'oxd-input': 'input',
  input: 'input',
  textarea: 'longInput',
  'oxd-button': 'button',
  'oxd-icon-button': 'button',
  button: 'button',
  'oxd-switch-input': 'switch',
  'oxd-checkbox-input': 'checkbox',
  'oxd-radio-input': 'radio',
  'oxd-select': 'dropdown',
  'oxd-select-input': 'dropdown',
  select: 'dropdown',
  'oxd-card-table': 'table',
  'oxd-table': 'table',
  table: 'table',
  'router-link': 'link',
  a: 'link',
};

/**
 * The locatorTemplates id that fits each kind — the rung-4 fallback for unassociated labels.
 *
 * These are *proposals*. An id only becomes a locator if the generator config defines a pattern
 * for it, which `templatesFrom` below enforces.
 */
export const KIND_TEMPLATES = {
  input: 'labelledInput',
  longInput: 'labelledTextarea',
  dropdown: 'labelledSelect',
  radio: 'labelledRadio',
  table: 'tableByColumn',
  menuItem: 'topNavTab',
};

/**
 * Narrow the kind→template table to the ids a config actually defines.
 *
 * The extractor must not propose a template the generator cannot expand: `fromMap` throws on an
 * unknown id, so an app configured with no `locatorTemplates:` would fail on the first element
 * carrying an unassociated label — over half of them, on a typical app. Filtering here lets the
 * ladder fall through to the next rung instead, so the element is either found by a weaker signal
 * or counted in `skipped`. Configuring templates is then an improvement, not a precondition.
 */
export function templatesFrom(configured, table = KIND_TEMPLATES) {
  const available = new Set(Object.keys(configured ?? {}));
  return Object.fromEntries(Object.entries(table).filter(([, id]) => available.has(id)));
}

/** Only these kinds carry their label as an accessible name, so only these reach rung 2. */
const ROLE_KINDS = {button: 'button', link: 'link'};

const KIND_SUFFIX = {
  input: 'Input', longInput: 'LongInput', button: 'Button', link: 'Link',
  dropdown: 'Dropdown', table: 'Table', switch: 'Switch', checkbox: 'Checkbox',
  radio: 'Radio', menuItem: 'MenuItem', text: 'Text', tab: 'Tab', image: 'Image',
};

// Vue's compiler tags nodes numerically: 1 is an element, 6 a static attribute, 7 a directive.
const NODE_ELEMENT = 1;
const ATTR_STATIC = 6;
const ATTR_DIRECTIVE = 7;

/** A tag that is not a known kind but looks like a component worth following one hop into. */
function looksLikeComponent(tag) {
  return /-/.test(tag) || /^[A-Z]/.test(tag);
}

/** Read every attribute into `{ static: {}, bound: {} }`, keeping the two kinds apart. */
function attributesOf(node) {
  const statics = {};
  const bound = {};
  for (const prop of node.props ?? []) {
    if (prop.type === ATTR_STATIC && prop.value?.content != null) {
      statics[prop.name] = prop.value.content;
      continue;
    }
    if (prop.type === ATTR_DIRECTIVE && prop.name === 'bind' && prop.arg?.content && prop.exp?.content) {
      bound[prop.arg.content] = prop.exp.content;
    }
  }
  return {statics, bound};
}

/** A label is either written literally or bound to a resolvable `$t()` key. Nothing else counts. */
function labelOf({statics, bound}, catalogue) {
  // On a radio or checkbox, `label` belongs to the group and `option-label` to this option.
  // Reading the group's label would give every option in the group the same name.
  if (typeof statics['option-label'] === 'string' && statics['option-label'].trim()) return statics['option-label'].trim();
  if (bound['option-label']) return resolveLabelExpression(bound['option-label'], catalogue);
  if (typeof statics.label === 'string' && statics.label.trim()) return statics.label.trim();
  if (bound.label) return resolveLabelExpression(bound.label, catalogue);
  if (typeof statics['aria-label'] === 'string' && statics['aria-label'].trim()) return statics['aria-label'].trim();
  if (typeof statics.title === 'string' && statics.title.trim()) return statics.title.trim();
  return null;
}

// Vue tags a plain text node 2 and an interpolation 5.
const NODE_TEXT = 2;
const NODE_INTERPOLATION = 5;

/**
 * The visible text a node renders, if it is only text.
 *
 * Some controls carry no label attribute at all and are labelled by the copy sitting next to
 * them — `<oxd-text>Create Login Details</oxd-text><oxd-switch-input />`. Reading that text is
 * the only way such a control gets a name, so it is offered to the next unlabelled control in
 * the same parent and to nothing else.
 */
function innerText(node, catalogue) {
  let found = null;
  const visit = (current) => {
    if (found || !current) return;
    if (current.type === NODE_TEXT && current.content?.trim()) {
      found = current.content.trim();
      return;
    }
    if (current.type === NODE_INTERPOLATION) {
      found = resolveLabelExpression(current.content?.content, catalogue);
      return;
    }
    for (const child of current.children ?? []) visit(child);
  };
  visit(node);
  return found;
}

function placeholderOf({statics, bound}, catalogue) {
  if (typeof statics.placeholder === 'string' && statics.placeholder.trim()) return statics.placeholder.trim();
  if (bound.placeholder) return resolveLabelExpression(bound.placeholder, catalogue);
  return null;
}

function testIdOf({statics}) {
  for (const [name, value] of Object.entries(statics)) {
    if (isTestIdAttr(name) && value) return value;
  }
  return null;
}

/** `type="textarea"` on a generic field widens the kind; `type="submit"` does not change it. */
function refineKind(kind, statics) {
  if (kind !== 'input') return kind;
  if (statics.type === 'textarea') return 'longInput';
  if (statics.type === 'checkbox') return 'checkbox';
  if (statics.type === 'radio') return 'radio';
  // A `type="select"` field renders the app's own dropdown, not a native <select>, so it
  // needs the select template rather than the input one.
  if (statics.type === 'select') return 'dropdown';
  return kind;
}

/**
 * Walk a template AST and gather every element the ladder can place, plus a reference for
 * every child component tag so the caller can follow it one hop.
 *
 * @returns {{elements: object[], childRefs: {tag: string, label: string|null}[], skipped: number}}
 */
export function collectVueElements(root, {catalogue = {}, templateFor = KIND_TEMPLATES, headers = {}, inheritedLabel = null} = {}) {
  const elements = [];
  const childRefs = [];
  let skipped = 0;
  // `<date-input :label="From Date" />` labels a wrapper whose own template carries no label at
  // all, and `<submit-button :label="Apply" />` overrides one that does. The label refers to the
  // control the wrapper renders — but only when it renders exactly one. A wrapper like
  // `<file-upload-input :label="Client Logo">` renders a radio group *and* a file field, and
  // there the label names the group, not any single control; applying it would put "Client Logo"
  // on whichever element happened to come first. Resolved after the walk, once the count is known.
  let pending = inheritedLabel;

  const visit = (node, adjacentText = null) => {
    let nearby = adjacentText;
    if (node?.type === NODE_ELEMENT && typeof node.tag === 'string') {
      const attrs = attributesOf(node);
      const baseKind = TAG_KINDS[node.tag];

      if (baseKind) {
        const kind = refineKind(baseKind, attrs.statics);
        const ownText = ROLE_KINDS[kind] ? innerText(node, catalogue) : null;
        // Order matters: the call site's label beats the control's own, which beats the copy
        // sitting beside it. Adjacent text is the weakest signal and is used only as a last resort.
        const inherited = pending ?? (labelOf(attrs, catalogue) ? null : ownText ?? nearby);
        const built = buildElement({kind, attrs, catalogue, templateFor, headers, inherited});
        if (built) {
          if (pending) pending = null;
          elements.push(built);
        } else {
          skipped += 1;
        }
      } else if (looksLikeComponent(node.tag)) {
        childRefs.push({tag: node.tag, label: labelOf(attrs, catalogue) ?? nearby});
      }
    }

    // Text seen among these children labels a later sibling, never an earlier one.
    let siblingText = null;
    for (const child of node?.children ?? []) {
      const text = child?.type === NODE_ELEMENT && !TAG_KINDS[child.tag] ? innerText(child, catalogue) : null;
      visit(child, siblingText);
      if (text) siblingText = text;
      else if (child?.type === NODE_INTERPOLATION || child?.type === NODE_TEXT) {
        siblingText = innerText(child, catalogue) ?? siblingText;
      }
    }
    // A `v-if` chain hides its arms under `branches`, and each arm can hold real fields.
    for (const branch of node?.branches ?? []) visit(branch, nearby);
  };
  visit(root);

  return {elements, childRefs, skipped};
}

function buildElement({kind, attrs, catalogue, templateFor, headers, inherited = null}) {
  const label = inherited ?? labelOf(attrs, catalogue);
  const columns = kind === 'table' ? columnsFor(attrs, headers) : null;
  const testId = testIdOf(attrs);
  const placeholder = placeholderOf(attrs, catalogue);

  // A table is found by one of its column headings, so its "label" is that heading.
  const anchor = kind === 'table' ? columns?.[0]?.name ?? null : label;

  const locator = bestLocatorFor({
    testId,
    role: ROLE_KINDS[kind],
    name: ROLE_KINDS[kind] ? label : null,
    label: anchor,
    labelFor: false,
    templateId: templateFor[kind],
    placeholder,
    // `<oxd-icon-button name="question-circle">` names the glyph, not the control, so it is
    // not an identity worth locating by.
    nameAttr: ROLE_KINDS[kind] ? null : attrs.statics.name,
    idAttr: attrs.statics.id,
  });
  if (!locator) return null;

  // What to call the element in code. It follows the same order the ladder just used, so the
  // identifier names whatever the locator actually anchors to — an element found by its test
  // id reads as `orderIdInput`, not `inputInput`.
  const {rung, ...spec} = locator;
  const displayName = spec.strategy === 'getByTestId'
    ? testId
    : anchor ?? testId ?? placeholder ?? attrs.statics.name ?? attrs.statics.id;
  return {
    name: identifierFor(displayName, kind),
    component: kind,
    label: spec.strategy === 'getByTestId' ? null : anchor ?? null,
    rung,
    locator: spec,
    comment: displayName ? `${displayName} (${kind})` : `(${kind})`,
    ...(columns ? {columns, rowCount: null} : {}),
  };
}

/** `<oxd-card-table :headers="headers">` names a script-level array; the caller resolves it. */
function columnsFor({bound}, headers) {
  const binding = bound.headers;
  if (!binding) return null;
  const resolved = headers[binding.trim()];
  return resolved && resolved.length > 0 ? resolved : null;
}

function identifierFor(label, kind) {
  const base = toCamel(String(label ?? kind));
  const suffix = KIND_SUFFIX[kind] ?? '';
  return base.endsWith(suffix) ? base : `${base}${suffix}`;
}

/**
 * Make identifiers unique, and mark the elements that only *look* unique.
 *
 * Two fields sharing a label produce two getters with the same selector. The suffix keeps the
 * code compiling, but the locator underneath still matches both, and a silently ambiguous
 * locator is the failure this whole pipeline is meant to avoid — so it is flagged rather than
 * left to surface as a confusing strict-mode violation at run time.
 */
export function dedupeNames(elements) {
  const locatorCounts = new Map();
  for (const element of elements) {
    const key = locatorKey(element.locator);
    locatorCounts.set(key, (locatorCounts.get(key) ?? 0) + 1);
  }

  // Suffixes are assigned against the names already taken, not against a per-base counter:
  // elements inlined from a child arrive already deduped, so `amountInput2` can exist before
  // this page's own second `amountInput` needs that name.
  const used = new Set();
  return elements.map((element) => {
    let name = element.name;
    for (let n = 2; used.has(name); n += 1) name = `${element.name}${n}`;
    used.add(name);
    const named = name === element.name ? element : {...element, name};

    const shared = locatorCounts.get(locatorKey(element.locator));
    if (shared < 2) return named;
    return {
      ...named,
      locator: {
        ...named.locator,
        unstable: true,
        unstableReason: `${shared} elements on this page resolve to this same locator — it needs scoping to one of them`,
      },
    };
  });
}

function locatorKey(locator) {
  return `${locator.strategy}|${(locator.args ?? []).join('\u0000')}|${locator.name ?? ''}`;
}

/**
 * Resolve `:headers="headers"` to the column titles the table renders.
 *
 * The array is a script-level literal whose entries carry `title: this.$t('ns.key')`, so the
 * titles resolve through the same catalogue the labels do. A computed or imported array is
 * left alone — a table with unknown columns is still a table, it just has no column anchor.
 *
 * @returns {Record<string, {name: string}[]>} keyed by the identifier the template binds to
 */
export function headersFromScript(ast, catalogue = {}, walk) {
  const found = {};
  if (!ast) return found;
  walk(ast, (node) => {
    if (node.type !== 'ObjectProperty') return;
    const key = node.key?.name ?? node.key?.value;
    if (!key || node.value?.type !== 'ArrayExpression') return;
    const columns = [];
    for (const entry of node.value.elements ?? []) {
      if (entry?.type !== 'ObjectExpression') continue;
      for (const prop of entry.properties ?? []) {
        if ((prop.key?.name ?? prop.key?.value) !== 'title') continue;
        const title = titleOf(prop.value, catalogue);
        if (title) columns.push({name: title});
      }
    }
    if (columns.length > 0) found[key] = columns;
  });
  return found;
}

/** `this.$t('ns.key')` or `$t('ns.key')`, or a plain string. */
function titleOf(node, catalogue) {
  if (node?.type === 'StringLiteral') return node.value;
  if (node?.type !== 'CallExpression') return null;
  const callee = node.callee;
  const name = callee?.name ?? callee?.property?.name;
  if (name !== '$t') return null;
  const arg = node.arguments?.[0];
  // A second argument means interpolation, and an interpolated heading is not a stable anchor.
  if (arg?.type !== 'StringLiteral' || node.arguments.length > 1) return null;
  return catalogue[arg.value] ?? null;
}

/**
 * Re-label an element inlined from a child component.
 *
 * A wrapper carries a default — `SubmitButton` labels itself "Save" — that the call site
 * overrides: `<submit-button :label="$t('general.apply')" />` renders an "Apply" button. The
 * call site wins, so the inlined element is rebuilt around the parent's label.
 */
export function relabel(element, label) {
  if (!label || !element.label) return element;
  const locator = {...element.locator};
  if (locator.name != null) locator.name = label;
  else if (locator.strategy === 'getByLabel' || locator.strategy === 'getByTestId') locator.args = [label];
  return {
    ...element,
    name: identifierFor(label, element.component),
    label,
    locator,
    comment: `${label} (${element.component})`,
  };
}

/**
 * Index every component file by both names a template can use to reach it: the kebab-cased
 * filename a globally-registered tag uses, and the class name a local `components: {}` alias
 * points at. Built once per run and shared by every parse, since resolving a tag by walking
 * the tree per occurrence is what would make the hop expensive.
 */
export function buildComponentIndex(files, basename) {
  const byKebab = new Map();
  const byClass = new Map();
  for (const file of files) {
    const stem = basename(file);
    byClass.set(stem, file);
    byKebab.set(kebab(stem), file);
  }
  return {
    size: byClass.size,
    resolve(tag, alias) {
      if (alias && byClass.has(alias)) return byClass.get(alias);
      if (byKebab.has(tag)) return byKebab.get(tag);
      return byClass.get(tag) ?? null;
    },
  };
}

function kebab(name) {
  return String(name).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
