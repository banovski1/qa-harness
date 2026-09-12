// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

// The only file in this project that names an app-specific selector. Everything
// else addresses controls by label, role or field name.

/** How this app associates a label with its input, where it uses no <label for>. */
export const FIELD_TEMPLATE = '[data-testid="{fieldName}"]';

export const TABLE_SHAPE = {
  root: '[role=\'table\'], table',
  row: '[role=\'row\'], tbody tr',
  cell: '[role=\'cell\'], td',
  headerCell: 'thead th',
  rowKeyAttribute: undefined,
};
