/**
 * Locators belong to the component layer. A spec names behaviour; a page object
 * names elements; a component owns the Playwright locator. These rules keep
 * those three layers from bleeding into each other, and keep the locators
 * themselves semantic rather than positional.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { isPageObject, isSpec, lines, scan, stripComment } from '../lib.mjs';

const QUERY = 'getByRole|getByLabel|getByPlaceholder|getByText|getByAltText|getByTitle|getByTestId';

const SPEC_LOCATOR = new RegExp(String.raw`\b(page|this\.page)\s*\.\s*(locator|frameLocator|${QUERY})\s*\(`);
const BARE_SELECTOR = /(['"`])\s*(?:\/\/|[.#[][\w-]|[a-z]+\s*[>[])/;
const POSITIONAL = /nth-child|nth-of-type|nth-last-child|\.nth\s*\(|\btext=|\.(first|last)\s*\(\s*\)/;
const CLASSY = /(['"`])[^'"`]*\.(btn|oxd|col|row|form)-[\w-]/;
const RAW_LOCATOR_GETTER = /\bget\s+\w+\s*\(\s*\)\s*:\s*Locator\b/;
const LOW_PRIORITY = /\.(getByTestId|locator)\s*\(/;
const PROVENANCE = /\/\/\s*(UNVERIFIED|UNSTABLE|map:)/;
const UNNAMED_ROLE = /\.getByRole\s*\(\s*(['"`])[^'"`]+\1\s*\)/;
const UNSCOPED_TEXT = /\.getByText\s*\(/;

const FIX_SPEC =
  'Locators live in src/pages/** wrapped in a component. Add a getter to the protected page object and call it from the spec.';
const FIX_POSITIONAL =
  'Positional selectors break on any layout change. Use a named role or label locator; if the element is not in the map, walk the screen with the smart-map skill.';

function unstableGetters(root) {
  const found = new Map();
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.endsWith('.generated.ts')) continue;
      const src = readFileSync(full, 'utf8').split(/\r?\n/);
      for (let i = 0; i < src.length; i += 1) {
        if (!/\/\/\s*UNSTABLE/.test(src[i])) continue;
        for (let j = i + 1; j < Math.min(i + 5, src.length); j += 1) {
          const name = /\bget\s+(\w+)\s*\(/.exec(src[j]);
          if (name) {
            found.set(name[1], entry.replace('.generated.ts', ''));
            break;
          }
        }
      }
    }
  };
  walk(root);
  return found;
}

export function locatorRules(ctx) {
  const out = [];

  if (isSpec(ctx.path)) {
    out.push(...scan(ctx, 'locator-in-spec', SPEC_LOCATOR, FIX_SPEC));
    out.push(
      ...scan(
        ctx,
        'locator-in-spec',
        BARE_SELECTOR,
        'A raw CSS/XPath selector in a spec. Move it into a page-object getter, or better, use a semantic locator there.',
      ),
    );

    const unstable = unstableGetters(join(ctx.root, 'generated-framework/src/pages'));
    if (unstable.size) {
      for (const { no, text } of lines(ctx, 'unstable-getter')) {
        for (const [getter, owner] of unstable) {
          if (new RegExp(String.raw`\.${getter}\b`).test(stripComment(text))) {
            out.push({
              rule: 'unstable-getter',
              line: no,
              found: `${getter} (${owner}) is marked // UNSTABLE`,
              fix: 'This getter is a positional leftover and will break. Re-walk the screen with the smart-map skill so it gets a semantic locator, then use it.',
            });
          }
        }
      }
    }
  }

  if (isPageObject(ctx.path)) {
    const rows = ctx.text.split(/\r?\n/);
    /**
     * Provenance counts on the line itself or in the few lines above it, which is
     * where a getter's marker naturally sits - above the getter, not buried on the
     * locator expression three lines into the body.
     */
    const hasProvenance = (no) => {
      for (let back = 1; back <= 4; back += 1) {
        if (PROVENANCE.test(rows[no - back] ?? '')) return true;
      }
      return false;
    };

    out.push(
      ...scan(
        ctx,
        'wrap-in-component',
        RAW_LOCATOR_GETTER,
        'A page-object getter must return a component (InputComponent, ButtonComponent, ...), not a bare Locator, so behaviour stays in the component layer.',
      ),
    );
    for (const { no, text } of lines(ctx, 'locator-priority')) {
      const code = stripComment(text);
      if (LOW_PRIORITY.test(code) && !hasProvenance(no)) {
        out.push({
          rule: 'locator-priority',
          line: no,
          found: code.trim(),
          fix: 'Prefer getByRole > getByLabel > getByPlaceholder > getByText > getByTestId. If no semantic locator exists, mark the line // UNVERIFIED and say so in your report.',
        });
      }
      if (UNNAMED_ROLE.test(code)) {
        out.push({
          rule: 'scoped-locator',
          line: no,
          found: code.trim(),
          fix: 'getByRole without a name matches every element of that role. Pass { name, exact: true } or scope it with a within locator.',
        });
      }
      if (UNSCOPED_TEXT.test(code) && !/within|\.filter\(|dialog|row/.test(code)) {
        out.push({
          rule: 'scoped-locator',
          line: no,
          found: code.trim(),
          fix: 'getByText is ambiguous on a page that repeats the string. Use getByRole with a name, or scope it to the dialog/row it lives in.',
        });
      }
    }
  }

  out.push(...scan(ctx, 'positional-locator', POSITIONAL, FIX_POSITIONAL));
  out.push(...scan(ctx, 'positional-locator', CLASSY, FIX_POSITIONAL));
  return out;
}
