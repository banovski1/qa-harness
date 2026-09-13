// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

// The only file in this project that names an app-specific selector. Everything
// else addresses controls by label, role or field name.

/** How this app associates a label with its input, where it uses no <label for>. */
export const FIELD_TEMPLATE = '.cell[data-name="{fieldName}"] .field';

export const TABLE_SHAPE = {
  root: '.list-container table.table',
  row: 'tr.list-row[data-id]',
  cell: 'td[data-name]',
  headerCell: 'thead th[data-name]',
  rowKeyAttribute: 'data-id',
};
