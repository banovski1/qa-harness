// Element extraction from a Vue template AST.
//
// The parsers in parsers.ts answer "what components exist"; this answers "what does a page
// put on screen, and how would a test find it". It is deliberately conservative: an element
// whose label cannot be resolved is dropped rather than guessed at, because a guessed label
// produces a locator that matches nothing and fails far from its cause.
//
// Nothing here picks a locator strategy. Signals are gathered and handed to the ladder, which
// is what keeps this extractor and the codegen shaping step ranking locators the same way.

import {bestLocatorFor} from '../framework-generator/locator-ladder.js';
import {isTestIdAttr} from './util.js';
import {resolveLabelExpression} from './i18n.js';
import {astNode, astNodes, astString} from './ast.js';
import {identifierFor, KIND_TEMPLATES, refineKind, ROLE_KINDS} from './elements.js';
import type {ChildReference} from './elements.js';
import type {AstNode, AstVisitor, CatalogueEntries, ExtractedElement, ParserContext, TemplateMap} from './types.js';

// Framework-neutral element helpers used here live in elements.ts; re-exported so nothing
// importing them from this module has to know they moved.
export {buildComponentIndex, dedupeNames, KIND_TEMPLATES, relabel, templatesFrom} from './elements.js';
export type {ChildReference} from './elements.js';

interface Attributes {statics: Record<string, string>; bound: Record<string, string>}
type Headers = Record<string, {name: string}[]>;

/**
 * Tag → the generator's closed `component:` vocabulary. A tag that is not here yields no
 * element: an unmapped tag is an unknown, and an unknown must not become a guess.
 */
export const TAG_KINDS: Record<string, string> = {
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

// Vue's compiler tags nodes numerically: 1 is an element, 6 a static attribute, 7 a directive.
const NODE_ELEMENT = 1;
const ATTR_STATIC = 6;
const ATTR_DIRECTIVE = 7;

/** A tag that is not a known kind but looks like a component worth following one hop into. */
function looksLikeComponent(tag: string) {
  return /-/.test(tag) || /^[A-Z]/.test(tag);
}

/** Read every attribute into `{ static: {}, bound: {} }`, keeping the two kinds apart. */
function attributesOf(node: AstNode): Attributes {
  const statics: Record<string, string> = {};
  const bound: Record<string, string> = {};
  for (const prop of astNodes(node, 'props')) {
    const name = astString(prop, 'name');
    const content = astString(prop, 'value', 'content');
    if (prop.type === ATTR_STATIC && name !== undefined && content !== undefined) {
      statics[name] = content;
      continue;
    }
    const argument = astString(prop, 'arg', 'content');
    const expression = astString(prop, 'exp', 'content');
    if (prop.type === ATTR_DIRECTIVE && name === 'bind' && argument && expression) {
      bound[argument] = expression;
    }
  }
  return {statics, bound};
}

/** A label is either written literally or bound to a resolvable `$t()` key. Nothing else counts. */
function labelOf({statics, bound}: Attributes, catalogue: CatalogueEntries): string | null {
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
function innerText(node: AstNode, catalogue: CatalogueEntries): string | null {
  let found: string | null = null;
  const visit = (current: AstNode) => {
    if (found || !current) return;
    const content = astString(current, 'content');
    if (current.type === NODE_TEXT && content?.trim()) {
      found = content.trim();
      return;
    }
    if (current.type === NODE_INTERPOLATION) {
      found = resolveLabelExpression(astString(current, 'content', 'content'), catalogue);
      return;
    }
    for (const child of astNodes(current, 'children')) visit(child);
  };
  visit(node);
  return found;
}

function placeholderOf({statics, bound}: Attributes, catalogue: CatalogueEntries): string | null {
  if (typeof statics.placeholder === 'string' && statics.placeholder.trim()) return statics.placeholder.trim();
  if (bound.placeholder) return resolveLabelExpression(bound.placeholder, catalogue);
  return null;
}

function testIdOf({statics}: Attributes): string | null {
  for (const [name, value] of Object.entries(statics)) {
    if (isTestIdAttr(name) && value) return value;
  }
  return null;
}

/**
 * Walk a template AST and gather every element the ladder can place, plus a reference for
 * every child component tag so the caller can follow it one hop.
 *
 * @returns {{elements: object[], childRefs: {tag: string, label: string|null}[], skipped: number}}
 */
export function collectVueElements(root: AstNode, {catalogue = {}, templateFor = KIND_TEMPLATES, headers = {}, inheritedLabel = null}: ParserContext & {headers?: Headers} = {}) {
  const elements: ExtractedElement[] = [];
  const childRefs: ChildReference[] = [];
  let skipped = 0;
  // `<date-input :label="From Date" />` labels a wrapper whose own template carries no label at
  // all, and `<submit-button :label="Apply" />` overrides one that does. The label refers to the
  // control the wrapper renders — but only when it renders exactly one. A wrapper like
  // `<file-upload-input :label="Client Logo">` renders a radio group *and* a file field, and
  // there the label names the group, not any single control; applying it would put "Client Logo"
  // on whichever element happened to come first. Resolved after the walk, once the count is known.
  let pending = inheritedLabel;

  const visit = (node: AstNode, adjacentText: string | null = null) => {
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
    let siblingText: string | null = null;
    for (const child of astNodes(node, 'children')) {
      const text = child.type === NODE_ELEMENT && !TAG_KINDS[astString(child, 'tag') ?? ''] ? innerText(child, catalogue) : null;
      visit(child, siblingText);
      if (text) siblingText = text;
      else if (child?.type === NODE_INTERPOLATION || child?.type === NODE_TEXT) {
        siblingText = innerText(child, catalogue) ?? siblingText;
      }
    }
    // A `v-if` chain hides its arms under `branches`, and each arm can hold real fields.
    for (const branch of astNodes(node, 'branches')) visit(branch, nearby);
  };
  visit(root);

  return {elements, childRefs, skipped};
}

function buildElement({kind, attrs, catalogue, templateFor, headers, inherited = null}: {
  kind: string; attrs: Attributes; catalogue: CatalogueEntries; templateFor: TemplateMap; headers: Headers; inherited?: string | null;
}): ExtractedElement | null {
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
  } as Parameters<typeof bestLocatorFor>[0]);
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
function columnsFor({bound}: Attributes, headers: Headers) {
  const binding = bound.headers;
  if (!binding) return null;
  const resolved = headers[binding.trim()];
  return resolved && resolved.length > 0 ? resolved : null;
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
export function headersFromScript(ast: AstNode | null, catalogue: CatalogueEntries = {}, walk: (node: unknown, visit: AstVisitor) => void): Headers {
  const found: Headers = {};
  if (!ast) return found;
  walk(ast, (node) => {
    if (node.type !== 'ObjectProperty') return;
    const key = astString(node, 'key', 'name') ?? astString(node, 'key', 'value');
    if (!key || astNode(node, 'value')?.type !== 'ArrayExpression') return;
    const columns = [];
    for (const entry of astNodes(node, 'value', 'elements')) {
      if (entry?.type !== 'ObjectExpression') continue;
      for (const prop of astNodes(entry, 'properties')) {
        if ((astString(prop, 'key', 'name') ?? astString(prop, 'key', 'value')) !== 'title') continue;
        const title = titleOf(astNode(prop, 'value'), catalogue);
        if (title) columns.push({name: title});
      }
    }
    if (columns.length > 0) found[key] = columns;
  });
  return found;
}

/** `this.$t('ns.key')` or `$t('ns.key')`, or a plain string. */
function titleOf(node: AstNode | undefined, catalogue: CatalogueEntries): string | null {
  if (node?.type === 'StringLiteral') return astString(node, 'value') ?? null;
  if (node?.type !== 'CallExpression') return null;
  const callee = astNode(node, 'callee');
  const name = astString(callee, 'name') ?? astString(callee, 'property', 'name');
  if (name !== '$t') return null;
  const arg = astNode(node, 'arguments', 0);
  // A second argument means interpolation, and an interpolated heading is not a stable anchor.
  if (arg?.type !== 'StringLiteral' || astNodes(node, 'arguments').length > 1) return null;
  const key = astString(arg, 'value');
  return key === undefined ? null : catalogue[key] ?? null;
}
