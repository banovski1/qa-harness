// The list of files the generator intends to write. The draft shows it; emit walks it.
// Keeping it in one place is what makes the draft a promise rather than a description.
import type { AppModel } from '../../model-compiler/model-types.ts';
import { moduleOf } from './naming.ts';

export interface PlannedPath {
  path: string;
  what: string;
}

export function plannedPaths(model: AppModel): PlannedPath[] {
  const out: PlannedPath[] = [];
  for (const [name, def] of Object.entries(model.components)) {
    if (def.kind !== 'region') continue;
    out.push({ path: `src/components/${name}.ts`, what: `${def.description} (region)` });
  }
  for (const screen of model.screens) {
    out.push({
      path: `src/pages/${moduleOf(screen.path)}/${screen.name}.ts`,
      what: `${screen.path}${screen.crawled ? '' : ' (declared, never crawled)'}`,
    });
  }
  for (const name of Object.keys((model.api.resources ?? {}) as Record<string, unknown>)) {
    out.push({ path: `src/api/${name}Api.ts`, what: `the ${name} endpoints` });
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}
