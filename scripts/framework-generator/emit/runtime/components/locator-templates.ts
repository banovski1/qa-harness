// This file exists only so the runtime component library can be imported and tested
// standalone (`resolve.ts` imports FIELD_TEMPLATE at module scope). It is never copied
// into a generated project: `emit.ts` writes an app-specific `src/components/locator-
// templates.ts` from `renderTemplates()` at the same path, and `runtimeFiles()` skips
// this file for exactly that reason — see components.ts.
export const FIELD_TEMPLATE: string | null = null;

export const TABLE_SHAPE = {
  root: 'table',
  row: 'tbody tr',
  cell: 'td',
  headerCell: 'thead th',
  rowKeyAttribute: undefined as string | undefined,
};
