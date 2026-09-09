// Framework-neutral element helpers shared by every extractor — Vue's, Handlebars' (through
// `parseBackboneHandlebars` in parsers.ts), and any future one.
//
// Nothing here reads a template AST: that stays in the framework-specific module, one per
// dialect. What belongs here is what every extractor needs once it already has a kind and a
// label — mapping a kind to its locator template, turning a label into a unique identifier,
// resolving a child component tag to a file, and re-labelling an inlined element. An extractor
// that needs to walk its own AST does not belong in this file.

import {toCamel} from '../framework-generator/naming.js';
import type {ComponentIndex, ExtractedElement, LocatorRecord, TemplateMap} from './types.js';

/** A reference to a child component tag, resolved one hop by the caller. */
export interface ChildReference {tag: string; label: string | null}

type NamedElement = {name: string; locator: Pick<LocatorRecord, 'strategy' | 'args'> & Partial<LocatorRecord>};

/**
 * The locatorTemplates id that fits each kind — the rung-4 fallback for unassociated labels.
 *
 * These are *proposals*. An id only becomes a locator if the generator config defines a pattern
 * for it, which `templatesFrom` below enforces.
 */
export const KIND_TEMPLATES: TemplateMap = {
  input: 'labelledInput',
  longInput: 'labelledTextarea',
  dropdown: 'labelledSelect',
  radio: 'labelledRadio',
  checkbox: 'labelledCheckbox',
  switch: 'labelledSwitch',
  button: 'labelledButton',
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
export function templatesFrom(configured: Record<string, unknown> | null, table: TemplateMap = KIND_TEMPLATES): TemplateMap {
  const available = new Set(Object.keys(configured ?? {}));
  return Object.fromEntries(Object.entries(table).filter(([, id]) => available.has(id)));
}

/** Only these kinds carry their label as an accessible name, so only these reach rung 2. */
export const ROLE_KINDS: Record<string, string> = {button: 'button', link: 'link'};

export const KIND_SUFFIX: Record<string, string> = {
  input: 'Input', longInput: 'LongInput', button: 'Button', link: 'Link',
  dropdown: 'Dropdown', table: 'Table', switch: 'Switch', checkbox: 'Checkbox',
  radio: 'Radio', menuItem: 'MenuItem', text: 'Text', tab: 'Tab', image: 'Image',
};

/** `type="textarea"` on a generic field widens the kind; `type="submit"` does not change it. */
export function refineKind(kind: string, statics: Record<string, string>) {
  if (kind !== 'input') return kind;
  if (statics.type === 'textarea') return 'longInput';
  if (statics.type === 'checkbox') return 'checkbox';
  if (statics.type === 'radio') return 'radio';
  // A `type="select"` field renders the app's own dropdown, not a native <select>, so it
  // needs the select template rather than the input one.
  if (statics.type === 'select') return 'dropdown';
  return kind;
}

export function identifierFor(label: string | null | undefined, kind: string) {
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
export function dedupeNames<T extends NamedElement>(elements: T[]): (T & {locator: T['locator'] & Partial<LocatorRecord>})[] {
  const locatorCounts = new Map<string, number>();
  for (const element of elements) {
    const key = locatorKey(element.locator);
    locatorCounts.set(key, (locatorCounts.get(key) ?? 0) + 1);
  }

  // Suffixes are assigned against the names already taken, not against a per-base counter:
  // elements inlined from a child arrive already deduped, so `amountInput2` can exist before
  // this page's own second `amountInput` needs that name.
  const used = new Set<string>();
  return elements.map((element) => {
    let name = element.name;
    for (let n = 2; used.has(name); n += 1) name = `${element.name}${n}`;
    used.add(name);
    const named = name === element.name ? element : {...element, name};

    const shared = locatorCounts.get(locatorKey(element.locator))!;
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

function locatorKey(locator: NamedElement['locator']) {
  return `${locator.strategy}|${(locator.args ?? []).join('\u0000')}|${locator.name ?? ''}`;
}

/**
 * Re-label an element inlined from a child component.
 *
 * A wrapper carries a default — `SubmitButton` labels itself "Save" — that the call site
 * overrides: `<submit-button :label="$t('general.apply')" />` renders an "Apply" button. The
 * call site wins, so the inlined element is rebuilt around the parent's label.
 */
export function relabel(element: ExtractedElement, label: string | null): ExtractedElement {
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
export function buildComponentIndex(files: string[], basename: (file: string) => string): ComponentIndex & {size: number} {
  const byKebab = new Map<string, string>();
  const byClass = new Map<string, string>();
  for (const file of files) {
    const stem = basename(file);
    byClass.set(stem, file);
    byKebab.set(kebab(stem), file);
  }
  return {
    size: byClass.size,
    resolve(tag, alias) {
      if (alias && byClass.has(alias)) return byClass.get(alias)!;
      if (byKebab.has(tag)) return byKebab.get(tag)!;
      return byClass.get(tag) ?? null;
    },
  };
}

function kebab(name: string) {
  return String(name).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
