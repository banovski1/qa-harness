// Identifier and class-name derivation. Pure functions, no I/O, no language
// adapters imported — the adapters call in here, never the other way round.
//
// The application map's `name:` values are camelCase-ish but were derived from
// accessible names, so they are only "identifier-shaped" by accident. Two real
// hazards in the OrangeHRM map: names that start with a digit (`1Button`,
// `2Button` from pagination) and names that could collide with a keyword in a
// target language. safeIdentifier() is the single place both are fixed.

const RESERVED: Record<string, Set<string>> = {
  typescript: new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
    'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if',
    'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw',
    'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'as', 'implements', 'interface',
    'let', 'package', 'private', 'protected', 'public', 'static', 'yield', 'any', 'boolean',
    'constructor', 'declare', 'get', 'module', 'require', 'number', 'set', 'string', 'symbol',
    'type', 'from', 'of', 'await', 'async', 'page', 'url', 'root',
  ]),
  javascript: new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
    'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
    'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var',
    'void', 'while', 'with', 'yield', 'let', 'static', 'await', 'async', 'page', 'url', 'root',
  ]),
  java: new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
    'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
    'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long',
    'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try',
    'void', 'volatile', 'while', 'var', 'record', 'yield', 'page', 'url',
  ]),
  python: new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
    'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import',
    'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
    'with', 'yield', 'match', 'case', 'self', 'page', 'url',
  ]),
  csharp: new Set([
    'abstract', 'as', 'base', 'bool', 'break', 'byte', 'case', 'catch', 'char', 'checked',
    'class', 'const', 'continue', 'decimal', 'default', 'delegate', 'do', 'double', 'else',
    'enum', 'event', 'explicit', 'extern', 'false', 'finally', 'fixed', 'float', 'for',
    'foreach', 'goto', 'if', 'implicit', 'in', 'int', 'interface', 'internal', 'is', 'lock',
    'long', 'namespace', 'new', 'null', 'object', 'operator', 'out', 'override', 'params',
    'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sbyte', 'sealed', 'short',
    'sizeof', 'stackalloc', 'static', 'string', 'struct', 'switch', 'this', 'throw', 'true',
    'try', 'typeof', 'uint', 'ulong', 'unchecked', 'unsafe', 'ushort', 'using', 'virtual',
    'void', 'volatile', 'while', 'Page', 'Url',
  ]),
};

/** Split an arbitrary string into lowercase word tokens (drops punctuation, splits camelCase). */
export function words(input: unknown): string[] {
  return String(input ?? '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
}

/** "view system users" -> "ViewSystemUsers" */
export function toPascal(input: unknown): string {
  return words(input).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
}

/** "View System Users" -> "viewSystemUsers" */
export function toCamel(input: unknown): string {
  const p = toPascal(input);
  return p ? p[0].toLowerCase() + p.slice(1) : '';
}

/** "ViewSystemUsers" -> "view_system_users" */
export function toSnake(input: unknown): string {
  return words(input).join('_');
}

/** "ViewSystemUsers" -> "view-system-users" */
export function toKebab(input: unknown): string {
  return words(input).join('-');
}

/**
 * Turn a map `name:` into an identifier that is legal in the target language.
 * A leading digit gets an alphabetic prefix (`1Button` -> `n1Button`) because no
 * supported language allows one; reserved words get a trailing underscore, which
 * is the least surprising escape in all five.
 */
export function safeIdentifier(name: unknown, language: string): string {
  let id = String(name ?? '').replace(/[^A-Za-z0-9_]/g, '');
  if (!id) id = 'element';
  if (/^[0-9]/.test(id)) id = `n${id}`;
  const reserved = RESERVED[language];
  if (reserved && reserved.has(id)) id = `${id}_`;
  return id;
}

/**
 * Derive a page-object class name from a URL path.
 *
 * `/web/index.php/admin/viewSystemUsers` -> "SystemUsersPage". A leading `view`
 * is noise on every OrangeHRM action name, and `index` carries no meaning, so
 * both fall back to the module segment. A trailing `Module` that just repeats
 * the folder it lives in ("maintenance/MaintenanceModulePage") is stripped too.
 */
export function pageClassName(moduleSegment: unknown, actionSegment: unknown): string {
  let base = toPascal(actionSegment ?? '');
  if (/^View[A-Z]/.test(base)) base = base.slice(4);
  const moduleName = toPascal(moduleSegment ?? '');
  if (!base || base === 'Index') base = moduleName;
  if (base.endsWith('Module') && base.slice(0, -6).toLowerCase() === moduleName.toLowerCase()) {
    base = base.slice(0, -6);
  }
  if (!base) base = 'App';
  return `${base}Page`;
}
