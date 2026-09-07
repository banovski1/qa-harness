/**
 * The locator ladder: one ranking of locator strategies, best to worst, shared by every
 * part of the repo that has to choose or judge a locator.
 *
 * There were three separate opinions about what makes a good locator before this module
 * existed — the analyzer's test-id suggestion, the codegen skill's UNSTABLE heuristic, and
 * the write-hook's positional-selector rule. They agreed by accident and drifted by default.
 * Now they import the same table, so a change to the ranking reaches all of them at once.
 *
 * Every rung resolves to a strategy already in `locator-spec.mjs`'s closed vocabulary: the
 * ladder ranks the vocabulary, it does not extend it.
 */
import {STRATEGIES} from './locator-spec.js';
import type { LocatorSpec, LocatorSignals } from './types.js';

/**
 * Best to worst. `rung` is the sort key and the number reported in tallies; `id` is the
 * stable name to cite in a message.
 *
 * Rung 4 is the one that needs explaining. A `template` locator expands to CSS, so
 * mechanically it looks like rung 8 — but it is anchored to a *label*
 * (`.oxd-input-group:has(label:text-is("{label}")) input`), so it breaks only when the
 * label changes, exactly like `getByLabel`. It is the fallback for an app whose labels are
 * rendered without a `for` association, which is why it sits directly below rung 3 and is
 * never tagged unstable.
 */
export const RUNGS = [
  {rung: 1, id: 'testId', strategy: 'getByTestId', signal: 'data-testid', stable: true},
  {rung: 2, id: 'role', strategy: 'getByRole', signal: 'ARIA role + accessible name', stable: true},
  {rung: 3, id: 'label', strategy: 'getByLabel', signal: '<label for> association', stable: true},
  {rung: 4, id: 'template', strategy: 'template', signal: 'label, not associated', stable: true},
  {rung: 5, id: 'placeholder', strategy: 'getByPlaceholder', signal: 'placeholder text', stable: true},
  {rung: 6, id: 'attribute', strategy: 'css', signal: 'id / name attribute', stable: true},
  {rung: 7, id: 'text', strategy: 'getByText', signal: 'visible text', stable: false},
  {rung: 8, id: 'cssPath', strategy: 'css', signal: 'CSS path', stable: false},
];

const BY_ID = new Map(RUNGS.map((r) => [r.id, r]));

for (const {id, strategy} of RUNGS) {
  if (!STRATEGIES.includes(strategy)) {
    throw new Error(`ladder rung '${id}' names strategy '${strategy}', which is not in the locator vocabulary: ${STRATEGIES.join(', ')}`);
  }
}

export function rungById(id: string) {
  const found = BY_ID.get(id);
  if (!found) throw new Error(`unknown ladder rung '${id}' (have: ${[...BY_ID.keys()].join(', ')})`);
  return found;
}

/** The lowest rung that is still worth emitting without an `// UNSTABLE` annotation. */
export const LAST_STABLE_RUNG = 6;

/**
 * Build the best locator the given signals support.
 *
 * Callers gather signals and let the ladder choose; nobody picks a strategy at the call
 * site, which is what stops one extractor from quietly preferring CSS over a role.
 *
 * @param {object} signals
 * @param {string} [signals.testId]      a data-testid value
 * @param {string} [signals.role]        an ARIA role
 * @param {string} [signals.name]        the accessible name that goes with `role`
 * @param {boolean} [signals.labelFor]   true when the label is properly associated
 * @param {string} [signals.label]       the visible label text
 * @param {string} [signals.templateId]  the locatorTemplates id fitting this element's kind
 * @param {string} [signals.placeholder]
 * @param {string} [signals.idAttr]
 * @param {string} [signals.nameAttr]
 * @param {string} [signals.text]        visible text content
 * @param {string} [signals.cssPath]     a last-resort selector
 * @returns {{strategy, args, name, unstable, unstableReason, rung}|null}
 */
export function bestLocatorFor(signals: LocatorSignals = {}): (LocatorSpec & { rung: number }) | null {
  const {
    testId, role, name, labelFor, label, templateId,
    placeholder, idAttr, nameAttr, text, cssPath,
  } = signals;

  if (testId) return spec('testId', {args: [testId]});
  // A bare role matches every button on the page, so it only counts as rung 2 when named.
  if (role && name) return spec('role', {args: [role], name});
  if (label && labelFor) return spec('label', {args: [label]});
  if (label && templateId) return spec('template', {args: [templateId], name: label});
  if (placeholder) return spec('placeholder', {args: [placeholder]});
  if (idAttr) return spec('attribute', {args: [`[id="${cssEscape(idAttr)}"]`]});
  if (nameAttr) return spec('attribute', {args: [`[name="${cssEscape(nameAttr)}"]`]});
  if (text) return spec('text', {args: [text]});
  if (cssPath) {
    return spec('cssPath', {
      args: [cssPath],
      unstableReason: 'raw CSS path — no test id, role, label, placeholder or named attribute to anchor to',
    });
  }
  return null;
}

function spec(id: string, {args, name = null, unstableReason = null}: { args: string[]; name?: string | null; unstableReason?: string | null }): LocatorSpec & { rung: number } {
  const rung = rungById(id);
  return {
    strategy: rung.strategy,
    args,
    name,
    unstable: !rung.stable,
    unstableReason: rung.stable ? null : (unstableReason ?? `${rung.signal} is not a stable anchor`),
    rung: rung.rung,
  };
}

/** A double quote inside an attribute selector would close the selector early. */
function cssEscape(value: unknown): string {
  return String(value).replaceAll('"', '\\"');
}

/**
 * Rank a locator spec that already exists — one read out of a config block, or built by
 * something that did not go through `bestLocatorFor`.
 *
 * `template` is checked before `css` because `fromMap` rewrites an expanded template into a
 * css spec and leaves the template id behind on `.template`; without that check every
 * expanded template would be misreported as a rung-8 CSS path.
 */
export function rankOf(spec: Partial<LocatorSpec> | null | undefined): number | null {
  if (!spec || !spec.strategy) return null;
  if (spec.strategy === 'template' || spec.template) return 4;
  if (spec.strategy === 'getByTestId') return 1;
  if (spec.strategy === 'getByRole') return spec.name ? 2 : 7;
  if (spec.strategy === 'getByLabel') return 3;
  if (spec.strategy === 'getByPlaceholder') return 5;
  if (spec.strategy === 'getByText') return 7;
  if (spec.strategy === 'css') return ATTRIBUTE_ONLY.test(spec.args?.[0] ?? '') ? 6 : 8;
  // getByAltText / getByTitle are in the vocabulary but not on the ladder; both name an
  // element by its own accessible text, so they rank with visible text rather than below it.
  return 7;
}

const ATTRIBUTE_ONLY = /^\[[\w-]+=("[^"]*"|'[^']*'|[\w-]+)\]$/;

/**
 * Classify a Playwright locator expression as recorded by `playwright codegen`, which emits
 * source text rather than a spec. Used by the codegen shaping step to flag steps, and by the
 * write-hook to judge a hand-written line.
 *
 * @returns {{rung: number, stable: boolean, reason: string|null}}
 */
export function classify(expression: unknown) {
  const source = String(expression ?? '');

  // Positional indexing is judged before the base strategy: `getByRole(...).nth(1)` is a
  // rung-2 locator that has been made positional, and the `.nth(1)` is the part that breaks.
  if (POSITIONAL.test(source)) {
    return {rung: 8, stable: false, reason: 'positional — depends on element order, not identity'};
  }
  if (/\.getByTestId\s*\(/.test(source)) return stable(1);
  if (/\.getByRole\s*\(/.test(source)) {
    return NAMED_ROLE.test(source)
      ? stable(2)
      : {rung: 7, stable: false, reason: 'unnamed role — matches every element of this role on the page'};
  }
  if (/\.getByLabel\s*\(/.test(source)) return stable(3);
  if (/\.getByPlaceholder\s*\(/.test(source)) return stable(5);
  if (/\.getByAltText\s*\(|\.getByTitle\s*\(/.test(source)) return stable(5);
  if (/\.getByText\s*\(/.test(source)) {
    return {rung: 7, stable: false, reason: 'matches on visible text alone'};
  }
  if (/\.locator\s*\(/.test(source)) {
    return {rung: 8, stable: false, reason: 'raw CSS, no label scoping'};
  }
  return {rung: 8, stable: false, reason: 'unrecognised locator expression'};
}

const POSITIONAL = /\.nth\s*\(|\.(first|last)\s*\(\s*\)|:nth-(child|of-type|last-child)/;
const NAMED_ROLE = /\.getByRole\s*\([^)]*\bname\s*:/;

function stable(rung: number) {
  return {rung, stable: true, reason: null};
}
