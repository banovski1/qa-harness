// Adapter registry. Adding a language means adding one module and one entry
// here — generate.mjs never branches on language and does not change.
//
// The contract every adapter satisfies:
//
//   id          string                                 — matches `language:` in the config
//   extension   string
//   emptyDirs   (context) => string[]                  — dirs to create even when empty
//   staticFiles (context) => EmittedFile[]             — map-independent code + project files
//   renderPage  (page, context) => EmittedFile[]|null  — null = not implemented for this language
//   renderTest  (page, context) => EmittedFile|null
//
// Optional — an app with no api-map generates exactly as before if these are absent:
//   renderApiClient (resource, context) => EmittedFile[]|null
//   renderApiTest   (resource, context) => EmittedFile[]|null
//
// EmittedFile = { path, contents, kind: 'generated' | 'protected' }
// context     = { config, model, apiModel }

import { typescript } from './typescript.mjs';
import { javascript } from './javascript.mjs';
import { java } from './java.mjs';
import { python } from './python.mjs';
import { csharp } from './csharp.mjs';

const ADAPTERS = new Map([
  [typescript.id, typescript],
  [javascript.id, javascript],
  [java.id, java],
  [python.id, python],
  [csharp.id, csharp],
]);

export const SUPPORTED_LANGUAGES = [...ADAPTERS.keys()];

/** @returns {object} the adapter for `id`, or throws listing what is supported. */
export function adapterFor(id) {
  const adapter = ADAPTERS.get(id);
  if (!adapter) {
    throw new Error(`Unknown language: '${id}'. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
  return adapter;
}
