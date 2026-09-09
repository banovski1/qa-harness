// Label catalogues, one detector row per convention.
//
// A template that says `:label="$t('leave.leave_type')"` names its field indirectly. Without
// the catalogue that key is dead text and the element drops off the ladder entirely; with it
// the element reaches rung 4. So this module is what decides whether a whole class of apps
// yields locators or nothing at all.
//
// Structured like registry-frontend.ts: `{ id, match, load }` rows, first match wins. No
// match is a normal outcome — an app with literal labels needs no catalogue — and yields an
// empty map rather than an error.

import path from 'node:path';
import {findFiles, readJson, readText, tryImport} from './util.js';
import type {Catalogue, CatalogueEntries} from './types.js';

/** Files worth opening when hunting for a catalogue. Keeps the scan off a whole repo of YAML. */
const YAML_FILE = /\.ya?ml$/;

export const I18N_REGISTRY: {id: string; label: string; match: (appPath: string) => boolean; load: (appPath: string) => Promise<CatalogueEntries>}[] = [
  {
    id: 'symfony-lang-string',
    label: 'Symfony lang-string YAML (langStrings: [{ value, unitId }])',
    match: (appPath) => findLangStringFiles(appPath).length > 0,
    load: async (appPath) => {
      const yaml = await tryImport('js-yaml');
      if (!yaml) return {};
      const catalogue: CatalogueEntries = {};
      for (const file of findLangStringFiles(appPath)) {
        // The filename stem is the namespace: admin.yaml holds the `admin.*` keys.
        const namespace = path.basename(file).replace(YAML_FILE, '');
        let parsed;
        try {
          parsed = yaml.load(readText(file) ?? '');
        } catch {
          continue;
        }
        for (const row of parsed?.langStrings ?? []) {
          if (row?.unitId && typeof row.value === 'string') {
            catalogue[`${namespace}.${row.unitId}`] = row.value;
          }
        }
      }
      return catalogue;
    },
  },
  // A Java/Spring app can ship both this and the nested-JSON row below (a login sub-app's
  // own translations, say). The properties file is the one carrying the main app's labels,
  // so it is listed first — `loadCatalogue` is first-match-wins and never merges rows.
  {
    id: 'java-properties',
    label: 'Java properties resource bundle (messages.properties)',
    match: (appPath) => findPropertiesCatalogueFiles(appPath).length > 0,
    load: async (appPath) => {
      const file = largestFile(findPropertiesCatalogueFiles(appPath));
      return file ? parseProperties(readText(file) ?? '') : {};
    },
  },
  {
    id: 'angular-nested-json',
    label: 'nested-JSON i18n catalogue (assets/i18n/*.json)',
    match: (appPath) => findNestedJsonCatalogueFiles(appPath).length > 0,
    load: async (appPath) => {
      // A per-locale sibling (fr.json, say) matches the same convention; the English
      // default is reliably the fullest one, same reasoning as the properties row above.
      const file = largestFile(findNestedJsonCatalogueFiles(appPath));
      if (!file) return {};
      const entries: CatalogueEntries = {};
      flattenJsonCatalogue(readJson(file), '', entries);
      return entries;
    },
  },
];

/**
 * A lang-string file is identified by its content, not its path, so an app that keeps the
 * same convention somewhere else still resolves. The `langStrings:` line has to appear near
 * the top of the file, which is what keeps this from reading every YAML file in the repo.
 */
function findLangStringFiles(appPath: string) {
  return findFiles(appPath, (file) => {
    if (!YAML_FILE.test(file)) return false;
    const head = readText(file)?.slice(0, 200) ?? '';
    return /^langStrings:/m.test(head);
  }, {maxDepth: 8});
}

/**
 * `messages.properties` is Spring/Java's default ResourceBundle basename for translatable
 * text. A locale sibling such as `messages_de.properties` has a different basename, so the
 * English default is matched by filename alone with no extra locale-filtering logic.
 */
function findPropertiesCatalogueFiles(appPath: string) {
  return findFiles(appPath, (_file, base) => base === 'messages.properties', {maxDepth: 8});
}

/**
 * A monorepo can carry several `messages.properties` — a backend module's own validation
 * messages, say — alongside the one backing the UI's labels. That one is, by a wide margin,
 * the biggest resource bundle in the repo, so size (not path depth or alphabetical order) is
 * the tie-breaker among matches.
 */
function largestFile(files: string[]): string | null {
  let best: string | null = null;
  let bestLength = -1;
  for (const file of files) {
    const length = readText(file)?.length ?? -1;
    if (length > bestLength) {
      bestLength = length;
      best = file;
    }
  }
  return best;
}

/**
 * Java Properties.load() semantics, the subset a real catalogue exercises: `#`/`!` comment
 * lines, `=`/`:`/whitespace as the key-value separator, a trailing-backslash line
 * continuation (leading whitespace of the joined line is stripped), and `\uXXXX` escapes.
 */
function parseProperties(text: string): CatalogueEntries {
  const entries: CatalogueEntries = {};
  for (const line of toPropertyLines(text)) {
    const split = splitPropertyLine(line);
    if (!split) continue;
    entries[unescapePropertyText(split[0])] = unescapePropertyText(split[1]);
  }
  return entries;
}

/** Joins continuation lines and drops comment/blank lines, leaving one physical line per entry. */
function toPropertyLines(text: string): string[] {
  const lines: string[] = [];
  let buffer = '';
  let buffering = false;
  for (const raw of text.split(/\r\n|\r|\n/)) {
    const stripped = raw.replace(/^[ \t\f]+/, '');
    if (!buffering && (stripped === '' || stripped[0] === '#' || stripped[0] === '!')) continue;
    const line = buffering ? buffer + stripped : stripped;
    const trailingBackslashes = /\\+$/.exec(line);
    if (trailingBackslashes && trailingBackslashes[0].length % 2 === 1) {
      buffer = line.slice(0, -1);
      buffering = true;
      continue;
    }
    lines.push(line);
    buffer = '';
    buffering = false;
  }
  if (buffering) lines.push(buffer);
  return lines;
}

/** Key ends at the first unescaped separator; `=`/`:` are optional once whitespace is seen. */
function splitPropertyLine(line: string): [string, string] | null {
  let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '\\') { i += 2; continue; }
    if (ch === '=' || ch === ':' || ch === ' ' || ch === '\t' || ch === '\f') break;
    i++;
  }
  const key = line.slice(0, i);
  if (!key) return null;
  while (i < line.length && /[ \t\f]/.test(line[i])) i++;
  if (i < line.length && (line[i] === '=' || line[i] === ':')) {
    i++;
    while (i < line.length && /[ \t\f]/.test(line[i])) i++;
  }
  return [key, line.slice(i)];
}

const PROPERTY_ESCAPES: Record<string, string> = {n: '\n', t: '\t', r: '\r', f: '\f'};

function unescapePropertyText(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== '\\') { out += ch; continue; }
    const next = text[i + 1];
    if (next === 'u') {
      out += String.fromCharCode(parseInt(text.slice(i + 2, i + 6), 16));
      i += 5;
    } else if (next === undefined) {
      out += '\\';
    } else {
      // Any other escaped character, known (\n, \t...) or not, loses just the backslash.
      out += PROPERTY_ESCAPES[next] ?? next;
      i++;
    }
  }
  return out;
}

/** An `i18n/` directory is the convention; the shape check keeps a `{id, value}[]` sibling out. */
const I18N_JSON_DIR = /[\\/]i18n[\\/]/;

function findNestedJsonCatalogueFiles(appPath: string) {
  return findFiles(appPath, (file, base) => {
    if (!base.endsWith('.json') || !I18N_JSON_DIR.test(file)) return false;
    const parsed = readJson(file);
    return !!parsed && typeof parsed === 'object' && !Array.isArray(parsed);
  }, {maxDepth: 8});
}

function flattenJsonCatalogue(value: unknown, prefix: string, entries: CatalogueEntries) {
  if (typeof value === 'string') {
    entries[prefix] = value;
  } else if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      flattenJsonCatalogue(child, prefix ? `${prefix}.${key}` : key, entries);
    }
  }
}

/**
 * Resolve the app's label catalogue.
 *
 * @returns {Promise<{id: string|null, label: string, entries: Record<string, string>, size: number}>}
 */
export async function loadCatalogue(appPath: string): Promise<Catalogue> {
  for (const row of I18N_REGISTRY) {
    if (!row.match(appPath)) continue;
    const entries = await row.load(appPath);
    return {id: row.id, label: row.label, entries, size: Object.keys(entries).length};
  }
  return {id: null, label: 'none found — `$t()` labels cannot be resolved', entries: {}, size: 0};
}

/** `$t('ns.key')` / `$t("ns.key")` with no interpolation argument. A key taking `{count}` is not resolvable. */
const T_CALL = /^\s*\$t\(\s*(['"])([^'"]+)\1\s*\)\s*$/;

/**
 * Read a label out of a bound attribute expression.
 *
 * Returns null for anything dynamic — `:label="someComputed"`, or a `$t` call carrying
 * interpolation — because a guessed label produces a locator that silently matches nothing.
 */
export function resolveLabelExpression(expression: string | null | undefined, catalogue: CatalogueEntries = {}) {
  const match = T_CALL.exec(String(expression ?? ''));
  if (!match) return null;
  return catalogue[match[2]] ?? null;
}

// A quoted literal piped through `i18` (this app's own pipe) or `translate` (ngx-translate).
// Anything carrying a pipe argument (`| i18:{count}`) or one of the interpolating pipe names
// (`i18Conjunction`, `i18SimpleObject`, `i18SimpleObjectArray`, `i18ConditionOperator`) fails
// this on purpose: the anchor `\s*$` after the pipe name only matches an exact, argument-free
// pipe, never a longer name or a trailing `:`.
const ANGULAR_PIPE_LABEL = /^\s*(['"])([^'"]+)\1\s*\|\s*(?:i18|translate)\s*$/;
/** A bare quoted literal with no pipe at all, e.g. `[componentLabel]="'ns.key'"`. */
const ANGULAR_BARE_LITERAL = /^\s*(['"])([^'"]+)\1\s*$/;
/** Angular's built-in `i18n="@@ns.key"` custom id; the description text after a `|` is metadata, not a key. */
const ANGULAR_CUSTOM_ID = /^\s*@@([^|]+)/;
/** A dotted identifier chain — the shape a catalogue key and a bare JS property-access share. */
const CATALOGUE_KEY_SHAPE = /^[A-Za-z][\w-]*(?:\.[A-Za-z][\w-]*)+$/;

/**
 * Read a label out of an Angular template expression.
 *
 * A quoted literal (piped through `i18`/`translate`, or bare) resolves through the catalogue
 * or returns null — the binding named a key, so an absent key must not fall back to showing
 * the key text itself. A *static* (unbound) attribute that merely looks like a key is
 * different: `componentLabel="ns.key"` is real page text whether or not it is in the
 * catalogue, so the unresolved case returns that text rather than null. String concatenation,
 * ternaries and bare identifiers (`someComputed`) are dynamic and always return null.
 */
export function resolveAngularLabelExpression(expression: string | null | undefined, catalogue: CatalogueEntries = {}): string | null {
  const raw = String(expression ?? '');

  const piped = ANGULAR_PIPE_LABEL.exec(raw);
  if (piped) return catalogue[piped[2]] ?? null;

  const bare = ANGULAR_BARE_LITERAL.exec(raw);
  if (bare) return catalogue[bare[2]] ?? null;

  const customId = ANGULAR_CUSTOM_ID.exec(raw);
  if (customId) return catalogue[customId[1].trim()] ?? null;

  const trimmed = raw.trim();
  if (CATALOGUE_KEY_SHAPE.test(trimmed)) return catalogue[trimmed] ?? trimmed;

  return null;
}
