/** Read and write the root analysis.json, one section at a time. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SECTIONS, type Analysis, type Section } from './analysis-types.ts';

export const ROOT = resolve(import.meta.dirname, '../..');

// One app per checkout, one artifact beside the .env that describes it. Testing a
// second app is a second worktree, not a second directory here.
export const analysisPath = () => join(ROOT, 'analysis.json');

const EMPTY: Analysis = {
  app: { name: '', baseUrl: '', repoPath: '', repoCommit: null, generatedAt: '' },
  source: { stack: {}, routes: [], entities: [], existingTests: [], docs: {}, dependencies: {} },
  conventions: { regions: [], labelAssociation: {} },
  api: { apiPrefix: null, tiers: {}, spec: {}, auth: null, endpoints: [] },
  map: { modules: [] },
  components: {},
  screens: [],
  testability: { summary: { write: 0, recordFirst: 0, unknown: 0, total: 0 }, recordings: [] },
  stats: {},
};

export function readAnalysis(): Analysis {
  const path = analysisPath();
  if (!existsSync(path)) return structuredClone(EMPTY);
  return { ...structuredClone(EMPTY), ...JSON.parse(readFileSync(path, 'utf8')) };
}

/**
 * Replace one section and leave every other byte alone.
 *
 * Sections are written in a fixed order so a re-run of one skill produces a diff
 * confined to its own work — a file whose key order depends on who wrote last would
 * make every run look like a change.
 */
export function writeSection(section: Section, value: unknown): string {
  const current = readAnalysis() as unknown as Record<string, unknown>;
  current[section] = value;
  // Ordered first, then anything this file does not know about. A writer that dropped an
  // unrecognised key would delete another skill's section the moment the contract grew —
  // which is exactly what two stale copies of this list did before they were fixed.
  const ordered: Record<string, unknown> = {};
  for (const key of SECTIONS) if (key in current) ordered[key] = current[key];
  for (const key of Object.keys(current)) if (!(key in ordered)) ordered[key] = current[key];
  const path = analysisPath();
  writeFileSync(path, `${JSON.stringify(ordered, null, 2)}\n`);
  return path;
}
