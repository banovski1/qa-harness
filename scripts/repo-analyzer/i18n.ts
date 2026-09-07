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
import {findFiles, readText, tryImport} from './util.js';
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
