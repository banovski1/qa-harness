// Adapter registry. Adding a language means adding one module and one entry
// here — generate.ts never branches on language and does not change.
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

import { typescript } from './typescript.js';
import { javascript } from './javascript.js';
import { java } from './java.js';
import { python } from './python.js';
import { csharp } from './csharp.js';
import type { LanguageAdapter } from '../types.js';

const ADAPTERS = new Map<string, LanguageAdapter>([
  [typescript.id, typescript],
  [javascript.id, javascript],
  [java.id, java],
  [python.id, python],
  [csharp.id, csharp],
]);

export const SUPPORTED_LANGUAGES = [...ADAPTERS.keys()];

/** Return the adapter for `id`, or throw listing what is supported. */
export function adapterFor(id: string): LanguageAdapter {
  const adapter = ADAPTERS.get(id);
  if (!adapter) {
    throw new Error(`Unknown language: '${id}'. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }
  return adapter;
}
