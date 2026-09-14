// The one place an identity becomes a locator.
//
// A page object says `{ label: 'First Name' }` or `{ field: 'emailAddress' }`. Which
// selector that turns into is this file's business and nowhere else's, which is what
// lets the whole page layer stay free of CSS.
import type { Locator, Page } from '@playwright/test';
import { FIELD_TEMPLATE } from '../locator-templates.ts';

export interface Identity {
  label?: string;
  field?: string;
  within?: string;
  role?: string;
  /**
   * How the crawl arrived at `label`. `accessible` means the browser computes it, so
   * `getByRole` can ask for it. `proximity` means the app renders the label next to the
   * control without ever associating the two — no `for`, no `aria-labelledby` — so the
   * accessibility tree does not contain it and only the same DOM walk finds it again.
   */
  via?: 'accessible' | 'proximity';
}

/**
 * The accessible name, allowing for a decorative glyph in front of it.
 *
 * `exact: true` looks like the strict choice and is the brittle one. A button built as
 * `<i class="icon"/><span>Create Contact</span>` computes its name as "+ Create Contact"
 * once the icon font loads, and as "Create Contact" before it does — so an exact match
 * passes or fails depending on font timing, which is not a property any test should
 * depend on. Anchoring the END of the name and requiring a boundary at the start keeps
 * what exactness was for: "Save" still does not match "Save and Close", and "Create
 * Contact" does not match "Recreate Contact".
 */
export function wholeName(label: string): RegExp {
  return new RegExp(`(^|[^\\w])\\s*${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`);
}

export function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

/** Scope first (a repeated label under a different heading), then address. */
export function scopeOf(pageOrRoot: Page | Locator, identity: Identity): Locator {
  const base: Locator = 'page' in pageOrRoot
    ? (pageOrRoot as Locator)
    : (pageOrRoot as Page).locator('body');
  if (!identity.within) return base;
  return base.locator(
    `xpath=.//*[self::section or self::div or self::form][.//*[self::h1 or self::h2 or self::h3][normalize-space()=${quote(identity.within)}]]`,
  ).first();
}

function quote(value: string): string {
  return value.includes('"') ? `concat("${value.split('"').join('",\'"\',"')}")` : `"${value}"`;
}

/**
 * Address a control by role and accessible name where the app gives one, and by the
 * app's own field identifier where it does not. The second path is the app-specific
 * one, and it exists in exactly one file: locator-templates.ts.
 */
/**
 * The control a rendered label belongs to, for an app that never said so.
 *
 * This is the run-time half of the crawl's proximity walk, and it has to agree with it
 * or the page object is a list of names that resolve to nothing. Find the element whose
 * own text is the label, climb to the nearest ancestor that also contains a control,
 * and take the control inside it. `ancestor::*[...][1]` is that climb: nearest first,
 * so the match is the tightest wrapper holding both, exactly as the crawl chose it.
 */
function byProximity(scope: Locator, label: string): Locator {
  const text = quote(label);
  const control = '*[self::input or self::textarea or self::select or self::button or ' +
    '@role="combobox" or @role="textbox" or @role="button" or @contenteditable="true" or ' +
    'contains(@class,"select-text") or contains(@class,"dropdown-toggle")]';
  return scope.locator(
    `xpath=.//*[normalize-space(text())=${text}]/ancestor::*[.//${control}][1]//${control}`,
  ).first();
}

export function resolve(pageOrRoot: Page | Locator, role: string, identity: Identity): Locator {
  const scope = scopeOf(pageOrRoot, identity);
  if (identity.label) {
    if (identity.via === 'proximity') return byProximity(scope, identity.label);
    return scope.getByRole(role as Parameters<Locator['getByRole']>[0], { name: wholeName(identity.label) });
  }
  if (identity.field) {
    if (!FIELD_TEMPLATE) {
      throw new Error(
        `Cannot address field "${identity.field}": this app declares no field template. ` +
        `Set conventions.labelAssociation.preferredTemplate in analysis.json and regenerate.`,
      );
    }
    return scope.locator(renderTemplate(FIELD_TEMPLATE, { fieldName: identity.field, label: identity.field }));
  }
  throw new Error('An identity must carry a label or a field.');
}

/**
 * The same decision `resolve` makes, reported rather than executed. It is a second
 * expression of one rule, which is a real cost — the alternative was for resolve() to
 * return a locator *and* a description, and every caller to unpack a pair it does not
 * want. The test below keeps the two in step.
 */
export function describeStrategy(identity: Identity, role: string): { strategy: string; selector: string } {
  if (identity.label) {
    if (identity.via === 'proximity') {
      return { strategy: 'proximity', selector: `label "${identity.label}" → nearest control` };
    }
    return { strategy: 'role+name', selector: `${role}[name ~= "${identity.label}"]` };
  }
  if (identity.field) {
    return {
      strategy: 'field-template',
      selector: FIELD_TEMPLATE ? renderTemplate(FIELD_TEMPLATE, { fieldName: identity.field, label: identity.field }) : '(no field template)',
    };
  }
  return { strategy: 'none', selector: '(an identity must carry a label or a field)' };
}
