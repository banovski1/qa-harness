// Api-map (YAML) -> normalized domain model. Parallel to analysis-reader.mjs, but
// additive: an app with no api-map yet must generate exactly as it did before
// this feature existed, so a missing/empty apiMapDir yields an empty model
// instead of throwing.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { fromFallback } from './request-spec.js';
import { safeIdentifier, toCamel, toPascal } from './naming.js';
import { isRecord, list, record } from './types.js';
import type { ApiModel, GeneratorConfig, ResourceModel } from './types.js';

/**
 * @typedef {{ resource: string, className: string, source: string, sourceRef: string|null,
 *             operations: import('./request-spec.mjs').Operation[] }} ResourceModel
 * @returns {{ resources: ResourceModel[], stats: object }}
 */
export function readApiMap(config: Pick<GeneratorConfig, 'apiMapDir' | 'api'>): ApiModel {
  const stats = { files: 0, resources: 0, operations: 0, droppedFields: 0 };
  if (!config.api?.enabled) return { resources: [], stats };

  let files;
  try {
    files = readdirSync(config.apiMapDir).filter((f) => f.endsWith('.yaml')).sort();
  } catch {
    return { resources: [], stats };
  }
  stats.files = files.length;

  const included = config.api.include ?? {};
  const excluded = config.api.exclude ?? {};
  const resources: ResourceModel[] = [];

  for (const file of files) {
    const raw = yaml.load(readFileSync(join(config.apiMapDir, file), 'utf8'));
    if (!isRecord(raw)) throw new Error(`Empty or malformed api-map file: ${file}`);
    if (!raw.resource) throw new Error(`${file}: no 'resource:' key`);

    const resource = String(raw.resource);
    if (excluded.tags?.includes(resource)) continue;
    if (included.tags?.length && !included.tags.includes(resource)) continue;

    const operations = list(raw.operations).map(record)
      .filter((op) => !included.operationIds?.length || included.operationIds.includes(String(op.operationId)))
      .filter((op) => !excluded.operationIds?.includes(String(op.operationId)))
      .map((op) => fromFallback(op, raw.resource));

    if (operations.length === 0) continue;

    stats.resources += 1;
    stats.operations += operations.length;
    for (const op of operations) stats.droppedFields += op.droppedFields.length;

    resources.push({
      resource: String(raw.resource),
      className: toPascal(raw.resource),
      source: String(raw.source ?? 'manual'),
      sourceRef: raw.sourceRef == null ? null : String(raw.sourceRef),
      // operationIds are commonly kebab-case (OpenAPI convention) or already
      // camelCase (fallback files); toCamel handles both the same way words()
      // does for map element names, then safeIdentifier guards leading digits
      // and reserved words.
      operations: operations.map((op) => ({ ...op, safeId: safeIdentifier(toCamel(op.operationId), 'typescript') })),
    });
  }

  return { resources, stats };
}
