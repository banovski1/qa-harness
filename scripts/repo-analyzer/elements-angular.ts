// Element extraction from an Angular template AST — the analogue of elements-vue.ts, for the
// dialect `@angular/compiler` hands back.
//
// Nothing here picks a locator strategy. Signals are gathered and handed to the ladder, which
// is what keeps this extractor, the Vue one and the codegen shaping step ranking locators the
// same way. A control whose label cannot be resolved is counted in `skipped` rather than
// guessed at, because a guessed label produces a locator that silently matches nothing.
//
// Angular's nodes are class instances with no `type` field and minified constructor names
// (`Element$1`, `Text$3`), so every discrimination here is by field shape. The one that matters
// most is `Template` — the host a `*ngIf`/`*ngFor` creates, which duplicates the host's
// attributes onto itself *and* onto the element it wraps, so it has to stay transparent.

import {bestLocatorFor} from '../framework-generator/locator-ladder.js';
import {resolveAngularLabelExpression} from './i18n.js';
import {astNode, astNodes, astString} from './ast.js';
import {identifierFor, KIND_TEMPLATES, refineKind, ROLE_KINDS, testIdOf} from './elements.js';
import type {Attributes, ChildReference} from './elements.js';
import type {AstNode, CatalogueEntries, ExtractedElement, ParserContext, TemplateMap} from './types.js';

/** `<label for="x">` → its text, for every label written directly in the template being walked. */
type LabelTargets = Record<string, string>;

/**
 * Tag → the generator's closed `component:` vocabulary. A tag that is not here yields no
 * element: an unmapped tag is an unknown, and an unknown must not become a guess.
 *
 * The app-specific half is the design-system wrapper set — the components that stamp a
 * `data-e2e-id`/`data-e2e-label` pair onto the control they render. Each is keyed by the
 * `selector:` its own `@Component` declares, which is not its directory name
 * (`components/toggle` declares `mco-toggle`, `components/searchinput` declares `search-input`).
 */
export const TAG_KINDS: Record<string, string> = {
  textinput: 'input',
  datepicker: 'input',
  'date-time-picker': 'input',
  'search-input': 'input',
  'mco-input-spinner': 'input',
  'mco-file-upload': 'input',
  dropdown: 'dropdown',
  checkbox: 'checkbox',
  radio: 'radio',
  'mco-radio': 'radio',
  'mco-toggle': 'switch',
  // Both name themselves after buttons and are neither: each renders `role="radiogroup"` filled
  // with `role="radio"` children (`two-option-button.component.html:29`,
  // `button-group.component.html:14,36`), and their `componentLabel` names the *group*. Kind
  // `button` would put them in ROLE_KINDS, and the ladder would then anchor 568 controls to
  // `getByRole('button', {name: <group label>})` — a name no button in the group has. `radio`
  // carries no role, so the group label anchors the rung-4 template instead.
  'two-option-button': 'radio',
  'button-group': 'radio',
  'mco-table': 'table',
  input: 'input',
  textarea: 'longInput',
  select: 'dropdown',
  button: 'button',
  a: 'link',
  table: 'table',
};

/**
 * The label attributes, in precedence order, with whether a wrapper translates the value or it
 * reaches the DOM as written. Measured: `componentLabel` 6187, `aria-label` 230, `label` 171.
 *
 * An allowlist rather than a `/label/i` match, which would also catch `gaLabel` (analytics),
 * `hideLabel` and `haveOptionalInLabel` (booleans) and `tableEmptyLabel` (empty-state copy).
 * `labelValue` (170) is excluded for the opposite reason: it is label text on `<field-label>`,
 * which is not a locatable kind, but on `<dropdown>` — the one mapped tag taking it — it names
 * the item *property* to display (`labelValue = 'value'`), so reading it would label 116
 * dropdowns with a field name.
 */
const LABEL_ATTRS: {name: string; wrapped: boolean}[] = [
  {name: 'componentLabel', wrapped: true},
  {name: 'aria-label', wrapped: false},
  {name: 'label', wrapped: false},
];

/** An Angular tag is hyphenated by convention; `ng-*` is the compiler's own, not a component. */
function looksLikeComponent(tag: string) {
  return tag.includes('-') && !tag.startsWith('ng-');
}

/**
 * The tag of a real element, or null for everything else — including a `Template`, which only
 * `templateAttrs` identifies. Reading a `Template` as an element would count every
 * structurally-directive'd control twice; not recursing into it would lose them all.
 */
function elementTag(node: AstNode): string | null {
  if (Array.isArray(node.templateAttrs)) return null;
  const name = astString(node, 'name');
  return name && Array.isArray(node.children) && Array.isArray(node.attributes) ? name : null;
}

// Where markup hides. `children` covers elements and `Template`; the block nodes keep theirs
// elsewhere — `@if` in `branches`, `@switch` in `cases`, `@for` in one `empty`, `@defer` in one
// node per fallback state.
const CHILD_ARRAYS = ['children', 'branches', 'cases'];
const CHILD_NODES = ['empty', 'placeholder', 'loading', 'error'];

function childrenOf(node: AstNode): AstNode[] {
  const children: AstNode[] = [];
  for (const key of CHILD_ARRAYS) children.push(...astNodes(node, key));
  for (const key of CHILD_NODES) {
    const single = astNode(node, key);
    if (single) children.push(single);
  }
  return children;
}

/** Static attributes and bound ones, kept apart: only the first is text the DOM carries verbatim. */
function attributesOf(node: AstNode): Attributes {
  const statics: Record<string, string> = {};
  const bound: Record<string, string> = {};
  for (const attr of astNodes(node, 'attributes')) {
    const name = astString(attr, 'name');
    const value = astString(attr, 'value');
    if (name && value !== undefined) statics[name] = value;
  }
  for (const input of astNodes(node, 'inputs')) {
    // `[aria-label]` and `[attr.aria-label]` both arrive named `aria-label`, differing only in
    // binding type — which changes nothing about the text they put on the page.
    const name = astString(input, 'name');
    const expression = astString(input, 'value', 'source');
    if (name && expression !== undefined) bound[name] = expression;
  }
  return {statics, bound};
}

/** A bound expression that is exactly a quoted string: `[componentLabel]="'Total'"` → `Total`. */
const QUOTED_LITERAL = /^\s*(['"])([^'"]*)\1\s*$/;
/** Anything else opening with a quote is a literal the resolver can still judge (`'k' | i18`). */
const STARTS_QUOTED = /^\s*['"]/;

function literalOf(expression: string): string | null {
  const match = QUOTED_LITERAL.exec(expression);
  return match ? match[2].trim() || null : null;
}

/**
 * Resolve a *bound* expression, without the resolver's static-text fallback.
 *
 * `resolveAngularLabelExpression` cannot tell a catalogue key from a property access by shape, so
 * it reads a bare dotted string as page text — right for a static attribute, wrong here, where
 * `[componentLabel]="row.label"` would come back labelled "row.label". Only an expression opening
 * with a quote is passed on; everything else is a runtime value.
 */
function boundLabel(expression: string, catalogue: CatalogueEntries): string | null {
  return STARTS_QUOTED.test(expression) ? resolveAngularLabelExpression(expression, catalogue) : null;
}

/** On an unpiped attribute the written value is what renders, so a catalogue miss keeps the text. */
function staticLabel(value: string, catalogue: CatalogueEntries): string {
  return resolveAngularLabelExpression(value, catalogue) ?? value;
}

/**
 * Whether the wrapper renders its own inputs through the `i18` pipe.
 *
 * `useI18` defaults to true (`textinput.component.ts:56`) and call sites override it constantly —
 * measured 1306 `[useI18]="false"` against 81 `[useI18]="true"`. An expression (22 sites) leaves
 * which branch renders unknowable, so it yields null rather than a coin toss. Only the bound form
 * is read: the app writes no static `useI18`, and one would pass the truthy string "false" anyway.
 */
function translatesLabels(bound: Record<string, string>): boolean | null {
  const value = bound.useI18?.trim();
  if (value === undefined) return true;
  if (value === 'false') return false;
  return value === 'true' ? true : null;
}

/**
 * The text a design-system wrapper actually puts on the page for one of its own inputs.
 *
 * Because every wrapper renders `useI18 ? (value | i18) : value`, exactly one of the two written
 * forms is a catalogue key. A bare literal is one when the wrapper pipes it; a call site that
 * piped the value itself did so *because* it turned the wrapper's piping off — measured, 424 of
 * the app's 427 explicitly-piped labels also carry `[useI18]="false"`. Both at once (3 sites)
 * feeds a translation back into the pipe and renders `???text???`, which is no anchor at all.
 *
 * A static value is no exception on the translated path: `componentLabel="pension.scheme.name"`
 * is piped like any other, so an absent key renders `???pension.scheme.name???` and the resolver's
 * result stands alone — falling back to the key text would name the element something the page
 * never shows. Only where nothing pipes it is the written value the rendered one.
 */
function wrappedValue(attrs: Attributes, name: string, catalogue: CatalogueEntries): string | null {
  const translates = translatesLabels(attrs.bound);
  if (translates === null) return null;
  const value = attrs.statics[name]?.trim();
  if (value) return translates ? resolveAngularLabelExpression(value, catalogue) : value;
  const expression = attrs.bound[name]?.trim();
  if (!expression) return null;
  if (translates) return QUOTED_LITERAL.test(expression) ? boundLabel(expression, catalogue) : null;
  return literalOf(expression) ?? boundLabel(expression, catalogue);
}

/** A plain attribute nothing pipes, so `[aria-label]="'Go'"` reads "Go", not a catalogue miss. */
function directValue(attrs: Attributes, name: string, catalogue: CatalogueEntries): string | null {
  const value = attrs.statics[name]?.trim();
  if (value) return staticLabel(value, catalogue);
  const expression = attrs.bound[name]?.trim();
  if (!expression) return null;
  return literalOf(expression) ?? boundLabel(expression, catalogue);
}

/**
 * The first label attribute present decides, resolved or not. A control whose primary label is a
 * runtime expression has no static name — reaching past it to a secondary attribute would name
 * the control something the page does not call it.
 */
function labelOf(attrs: Attributes, catalogue: CatalogueEntries): string | null {
  for (const {name, wrapped} of LABEL_ATTRS) {
    if (!attrs.statics[name]?.trim() && !attrs.bound[name]?.trim()) continue;
    return wrapped ? wrappedValue(attrs, name, catalogue) : directValue(attrs, name, catalogue);
  }
  return null;
}

// A wrapper pipes its placeholder on the same `useI18` flag the label uses. A native
// `<input [placeholder]="'x'">` is read as if wrapped too: the wrappers are 98% of the mapped
// tags, and the mismatch costs a missing rung-5 signal rather than a wrong one.
const placeholderOf = (attrs: Attributes, catalogue: CatalogueEntries) => wrappedValue(attrs, 'placeholder', catalogue);

/**
 * The element's own id. `componentId` counts because the wrappers forward it to the real
 * control's `[attr.id]`; the `<label for>` it also feeds is a wrapper hop away, so the id is
 * claimed as a rung-6 anchor and the association is not.
 */
function idOf({statics, bound}: Attributes): string | undefined {
  const candidates = [statics.id, bound.id && literalOf(bound.id), statics.componentId, bound.componentId && literalOf(bound.componentId)];
  return candidates.find((value): value is string => Boolean(value?.trim()))?.trim();
}

/**
 * `<textinput [textarea]="true">` renders a textarea — 499 call sites do — so the bound flag
 * widens the kind the way `type="textarea"` does on a native field. A flag that is not the
 * literal `true` leaves the kind alone: the kind picks the locator template, and the wrong
 * template is worse than the coarser one.
 */
function kindOf(base: string, {statics, bound}: Attributes): string {
  const kind = refineKind(base, statics);
  return kind === 'input' && bound.textarea?.trim() === 'true' ? 'longInput' : kind;
}

const INTERPOLATION = /^\s*\{\{([\s\S]*)\}\}\s*$/;

/**
 * The visible text a node renders, if it renders only text.
 *
 * A button or a link carries its label as its own content — `<button>{{ 'action.cancel' | i18 }}
 * </button>` — so this is the accessible name for the two kinds that have one, and it is read
 * for nothing else. Text sitting *beside* an unlabelled control is a guess, and in this app a
 * control that is labelled at all is labelled by an attribute.
 */
function innerText(node: AstNode, catalogue: CatalogueEntries): string | null {
  let found: string | null = null;
  const visit = (current: AstNode) => {
    if (found) return;
    const text = astString(current, 'value');
    if (text !== undefined) {
      found = text.trim() || null;
      return;
    }
    // A `BoundText`'s value is an expression, not a string: `{{ … }}` around whatever it holds.
    const interpolated = astString(current, 'value', 'source');
    if (interpolated !== undefined) {
      const inner = INTERPOLATION.exec(interpolated);
      found = inner ? boundLabel(inner[1], catalogue) : null;
      return;
    }
    for (const child of astNodes(current, 'children')) visit(child);
  };
  visit(node);
  return found;
}

/**
 * Every `<label for="x">` written directly in this template, keyed by the id it points at. This
 * is the only association rung 3 may claim: the app's own fields indirect it through
 * `<field-label [formFieldId]="componentId">`, which is not reachable without a wrapper hop.
 */
function labelTargetsIn(roots: AstNode[], catalogue: CatalogueEntries): LabelTargets {
  const targets: LabelTargets = {};
  const visit = (node: AstNode) => {
    if (elementTag(node) === 'label') {
      const attrs = attributesOf(node);
      const target = attrs.statics.for?.trim() || (attrs.bound.for ? literalOf(attrs.bound.for) : null);
      const text = innerText(node, catalogue);
      if (target && text) targets[target] = text;
    }
    for (const child of childrenOf(node)) visit(child);
  };
  for (const root of roots) visit(root);
  return targets;
}

/**
 * Walk an Angular template AST and gather every element the ladder can place, plus a reference
 * for every child component tag so a caller can follow it one hop.
 *
 * @param nodes the `nodes` array from `compiler.parseTemplate(html, file)`
 * @returns {{elements: object[], childRefs: {tag: string, label: string|null}[], skipped: number}}
 */
export function collectAngularElements(nodes: unknown, {catalogue = {}, templateFor = KIND_TEMPLATES}: ParserContext = {}) {
  const roots = astNodes(nodes);
  const labelTargets = labelTargetsIn(roots, catalogue);
  const elements: ExtractedElement[] = [];
  const childRefs: ChildReference[] = [];
  let skipped = 0;

  const visit = (node: AstNode) => {
    const tag = elementTag(node);
    if (tag) {
      const attrs = attributesOf(node);
      const baseKind = TAG_KINDS[tag];
      if (baseKind) {
        const built = buildElement({kind: kindOf(baseKind, attrs), node, attrs, catalogue, templateFor, labelTargets});
        if (built) elements.push(built);
        else skipped += 1;
      } else if (looksLikeComponent(tag)) {
        childRefs.push({tag, label: labelOf(attrs, catalogue)});
      }
    }
    for (const child of childrenOf(node)) visit(child);
  };
  for (const root of roots) visit(root);

  return {elements, childRefs, skipped};
}

function buildElement({kind, node, attrs, catalogue, templateFor, labelTargets}: {
  kind: string; node: AstNode; attrs: Attributes; catalogue: CatalogueEntries; templateFor: TemplateMap; labelTargets: LabelTargets;
}): ExtractedElement | null {
  const role = ROLE_KINDS[kind];
  const idAttr = idOf(attrs);
  const associated = (idAttr ? labelTargets[idAttr] : undefined) ?? null;
  const label = labelOf(attrs, catalogue) ?? associated ?? (role ? innerText(node, catalogue) : null);
  const testId = testIdOf(attrs);
  const placeholder = placeholderOf(attrs, catalogue);

  const locator = bestLocatorFor({
    testId,
    role,
    name: role ? label : null,
    label,
    // Rung 3 is claimed only when the label reached here through the association itself: an
    // element carrying its own, different label is not the one that `<label for>` names.
    labelFor: label !== null && label === associated,
    templateId: templateFor[kind],
    placeholder,
    nameAttr: role ? null : attrs.statics.name,
    idAttr,
  } as Parameters<typeof bestLocatorFor>[0]);
  if (!locator) return null;

  // What to call the element in code follows the order the ladder just used, so the identifier
  // names whatever the locator actually anchors to.
  const {rung, ...spec} = locator;
  const displayName = spec.strategy === 'getByTestId'
    ? testId
    : label ?? testId ?? placeholder ?? attrs.statics.name ?? idAttr;
  return {
    name: identifierFor(displayName, kind),
    component: kind,
    label: spec.strategy === 'getByTestId' ? null : label ?? null,
    rung,
    locator: spec,
    comment: displayName ? `${displayName} (${kind})` : `(${kind})`,
  };
}
