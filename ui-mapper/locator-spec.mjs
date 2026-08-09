// The closed locator vocabulary shared by the login spec (input) and the emitted
// application map (output). Each spec resolves to a real Playwright Locator so a
// candidate's uniqueness can be verified with .count().

export const STRATEGIES = [
  'getByRole', 'getByLabel', 'getByPlaceholder', 'getByText',
  'getByAltText', 'getByTitle', 'getByTestId', 'css',
];

/** Build a spec object from a parsed YAML map: { strategy, args, name, unstable }. */
export function fromMap(m) {
  if (!m || !STRATEGIES.includes(m.strategy)) {
    throw new Error(`Invalid locator strategy: ${JSON.stringify(m)}`);
  }
  return {
    strategy: m.strategy,
    args: Array.isArray(m.args) ? m.args.map(String) : [],
    name: m.name != null ? String(m.name) : null,
    unstable: Boolean(m.unstable),
  };
}

/** Resolve a spec against a Page (or any Locator root) into a Playwright Locator. */
export function resolve(root, spec) {
  const a0 = spec.args[0] ?? '';
  switch (spec.strategy) {
    case 'getByRole':
      return spec.name
        ? root.getByRole(a0, { name: spec.name, exact: true })
        : root.getByRole(a0);
    case 'getByLabel':       return root.getByLabel(a0);
    case 'getByPlaceholder': return root.getByPlaceholder(a0);
    case 'getByText':        return root.getByText(a0, { exact: true });
    case 'getByAltText':     return root.getByAltText(a0);
    case 'getByTitle':       return root.getByTitle(a0);
    case 'getByTestId':      return root.getByTestId(a0);
    case 'css':              return root.locator(a0);
    default: throw new Error(`Unknown strategy: ${spec.strategy}`);
  }
}

/** Emit the inline-YAML shape used across app-map.yaml and application-map/*.yaml. */
export function toYamlInline(spec) {
  const args = spec.args.map(yamlString).join(', ');
  let out = `{ strategy: ${spec.strategy}, args: [${args}]`;
  if (spec.name) out += `, name: ${yamlString(spec.name)}`;
  out += ' }';
  return out;
}

/** Double-quote and escape a YAML scalar. */
export function yamlString(v) {
  return `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
