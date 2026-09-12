// The one place an identity becomes a locator.
//
// A page object says `{ label: 'First Name' }` or `{ field: 'emailAddress' }`. Which
// selector that turns into is this file's business and nowhere else's, which is what
// lets the whole page layer stay free of CSS.
import type { Locator, Page } from '@playwright/test';
import { FIELD_TEMPLATE } from '../locator-templates.generated.ts';

export interface Identity {
  label?: string;
  field?: string;
  within?: string;
  role?: string;
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
 * one, and it exists in exactly one file: locator-templates.generated.ts.
 */
export function resolve(pageOrRoot: Page | Locator, role: string, identity: Identity): Locator {
  const scope = scopeOf(pageOrRoot, identity);
  if (identity.label) {
    return scope.getByRole(role as Parameters<Locator['getByRole']>[0], { name: wholeName(identity.label) });
  }
  if (identity.field) {
    if (!FIELD_TEMPLATE) {
      throw new Error(
        `Cannot address field "${identity.field}": this app declares no field template. ` +
        `Set labelAssociation.preferredTemplate in analysis/<app>/components.json and regenerate.`,
      );
    }
    return scope.locator(renderTemplate(FIELD_TEMPLATE, { fieldName: identity.field, label: identity.field }));
  }
  throw new Error('An identity must carry a label or a field.');
}
