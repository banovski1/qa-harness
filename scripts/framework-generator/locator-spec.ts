// The closed locator vocabulary shared by the login spec (input) and the emitted
// application map (output). Each spec resolves to a real Playwright Locator so a
// candidate's uniqueness can be verified with .count().

import { isRecord } from './types.js';
import type { LocatorSpec, LocatorTemplates, LocatorRoot } from './types.js';

export const STRATEGIES = [
  'getByRole', 'getByLabel', 'getByPlaceholder', 'getByText',
  'getByAltText', 'getByTitle', 'getByTestId', 'css', 'template',
];

/**
 * Build a spec object from a parsed YAML map: { strategy, args, name, unstable, within, nth }.
 *
 * `template` is expanded here, at read time, into the plain `css` spec it stands for:
 * `{ strategy: template, args: ["labelledInput"], name: "City" }` becomes the app's
 * configured pattern with the label substituted in. Expanding this early is what keeps
 * everything downstream ignorant of templates — resolve(), the other language adapters
 * and every consumer only ever see a selector they already understand. The template id
 * and label ride along so toYamlInline can write the short form back out.
 */
export function fromMap(m: unknown, templates: LocatorTemplates = {}): LocatorSpec {
  if (!isRecord(m) || typeof m.strategy !== 'string' || !STRATEGIES.includes(m.strategy)) {
    throw new Error(`Invalid locator strategy: ${JSON.stringify(m)}`);
  }
  const spec: LocatorSpec = {
    strategy: m.strategy,
    args: Array.isArray(m.args) ? m.args.map(String) : [],
    name: m.name != null ? String(m.name) : null,
    unstable: Boolean(m.unstable),
    unstableReason: m.unstableReason != null ? String(m.unstableReason) : null,
    within: m.within ? fromMap(m.within, templates) : null,
    nth: typeof m.nth === 'number' && Number.isInteger(m.nth) ? m.nth : null,
    template: null,
  };
  return spec.strategy === 'template' ? expandTemplate(spec, templates) : spec;
}

/**
 * Substitute a label into a template pattern.
 *
 * The label lands inside a quoted selector argument, so a double quote in it has to be
 * escaped — and escaped exactly the way the emitted LOCATOR_TEMPLATES table does it, or
 * the generator and the runtime would disagree about the same element. Both the map
 * expansion and the emitter's equivalence check call this, so there is one rule.
 */
export function renderTemplate(pattern: string, label: unknown): string {
  return pattern.replaceAll('{label}', String(label).replaceAll('"', '\\"'));
}

/** Substitute the label into the configured pattern, yielding an ordinary css spec. */
function expandTemplate(spec: LocatorSpec, templates: LocatorTemplates): LocatorSpec {
  const id = spec.args[0];
  const pattern = templates[id];
  if (!pattern) {
    const known = Object.keys(templates).join(', ') || 'none configured';
    throw new Error(`unknown template '${id}' (locatorTemplates: has ${known})`);
  }
  if (!spec.name) {
    throw new Error(`template '${id}' needs name: <label> to substitute for {label}`);
  }
  return { ...spec, strategy: 'css', args: [renderTemplate(pattern, spec.name)], template: id };
}

/** Convenience constructor with the same defaults as fromMap. */
export function make(strategy: string, args: string[], name: string | null = null, extra: Partial<LocatorSpec> = {}): LocatorSpec {
  return { strategy, args, name, unstable: false, unstableReason: null, within: null, nth: null, template: null, ...extra };
}

/**
 * Resolve a spec against a Page (or any Locator root) into a Playwright Locator.
 * If `within` is set, the ancestor is resolved first and the spec is chained off it —
 * this is how ambiguous elements (e.g. a table-header checkbox with no name) get scoped
 * to a unique locator instead of being dropped.
 */
export function resolve(root: LocatorRoot, spec: LocatorSpec): LocatorRoot {
  const scope = spec.within ? resolve(root, spec.within) : root;
  const a0 = spec.args[0] ?? '';
  let locator;
  switch (spec.strategy) {
    case 'getByRole':
      locator = spec.name
        ? scope.getByRole(a0, { name: spec.name, exact: true })
        : scope.getByRole(a0);
      break;
    case 'getByLabel':       locator = scope.getByLabel(a0); break;
    case 'getByPlaceholder': locator = scope.getByPlaceholder(a0); break;
    case 'getByText':        locator = scope.getByText(a0, { exact: true }); break;
    case 'getByAltText':     locator = scope.getByAltText(a0); break;
    case 'getByTitle':       locator = scope.getByTitle(a0); break;
    case 'getByTestId':      locator = scope.getByTestId(a0); break;
    case 'css':               locator = scope.locator(a0); break;
    default: throw new Error(`Unknown strategy: ${spec.strategy}`);
  }
  return spec.nth != null ? locator.nth(spec.nth) : locator;
}

/** Emit the inline-YAML shape used across app-config.yaml and application-map/*.yaml. */
export function toYamlInline(spec: LocatorSpec): string {
  // An expanded template writes back as the template it came from, not as the
  // selector it expanded to — otherwise a round-trip would silently inline the app's
  // CSS back into the map and undo the reason for having templates.
  const args = (spec.template ? [spec.template] : spec.args).map(yamlString).join(', ');
  let out = `{ strategy: ${spec.template ? 'template' : spec.strategy}, args: [${args}]`;
  if (spec.name) out += `, name: ${yamlString(spec.name)}`;
  if (spec.nth != null) out += `, nth: ${spec.nth}`;
  if (spec.within) out += `, within: ${toYamlInline(spec.within)}`;
  if (spec.unstable) {
    out += ', unstable: true';
    if (spec.unstableReason) out += `, unstableReason: ${yamlString(spec.unstableReason)}`;
  }
  out += ' }';
  return out;
}

/** Double-quote and escape a YAML scalar. */
export function yamlString(v: unknown): string {
  return `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
