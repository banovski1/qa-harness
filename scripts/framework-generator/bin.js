#!/usr/bin/env node
// @ts-check
import { tsImport } from 'tsx/esm/api';

try {
  // Resolve the runner from this package, even when npm invokes a .bin symlink.
  /** @type {typeof import('./generate.js')} */
  const generator = await tsImport('./generate.ts', import.meta.url);
  await generator.main();
} catch (error) {
  console.error('[framework-gen] ERROR', error instanceof Error ? error.message : String(error));
  process.exit(1);
}
