// The closed locator vocabulary shared by the login spec (input) and the emitted
// application map (output). Each spec resolves to a real Playwright Locator so a
// candidate's uniqueness can be verified with .count().

export const STRATEGIES = [
  'getByRole', 'getByLabel', 'getByPlaceholder', 'getByText',
  'getByAltText', 'getByTitle', 'getByTestId', 'css',
];

/** Build a spec object from a parsed YAML map: { strategy, args, name, unstable, within, nth }. */
export function fromMap(m) {
  if (!m || !STRATEGIES.includes(m.strategy)) {
    throw new Error(`Invalid locator strategy: ${JSON.stringify(m)}`);
  }
  return {
    strategy: m.strategy,
    args: Array.isArray(m.args) ? m.args.map(String) : [],
    name: m.name != null ? String(m.name) : null,
    unstable: Boolean(m.unstable),
    unstableReason: m.unstableReason ?? null,
    within: m.within ? fromMap(m.within) : null,
    nth: Number.isInteger(m.nth) ? m.nth : null,
  };
}

/** Convenience constructor with the same defaults as fromMap. */
export function make(strategy, args, name = null, extra = {}) {
  return { strategy, args, name, unstable: false, unstableReason: null, within: null, nth: null, ...extra };
}

/**
 * Resolve a spec against a Page (or any Locator root) into a Playwright Locator.
 * If `within` is set, the ancestor is resolved first and the spec is chained off it —
 * this is how ambiguous elements (e.g. a table-header checkbox with no name) get scoped
 * to a unique locator instead of being dropped.
 */
export function resolve(root, spec) {
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
export function toYamlInline(spec) {
  const args = spec.args.map(yamlString).join(', ');
  let out = `{ strategy: ${spec.strategy}, args: [${args}]`;
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
export function yamlString(v) {
  return `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
