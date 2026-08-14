import type { Locator } from '@playwright/test';
import { BaseComponent } from '../base/BaseComponent';

/**
 * A data table addressed by column name.
 *
 * The column list comes from the application map, so cell('Username') works
 * without the test knowing the column order. Row and column indexes are
 * zero-based and exclude the header row.
 */
export class TableComponent extends BaseComponent {
  constructor(
    locator: Locator,
    readonly columns: readonly string[],
    description: string,
  ) {
    super(locator, description);
  }

  /** Header labels as rendered right now, which may differ from the mapped list. */
  async headers(): Promise<string[]> {
    const texts = await this.locator.getByRole('columnheader').allInnerTexts();
    return texts.map((t) => t.trim());
  }

  rows(): Locator {
    return this.locator.getByRole('row').filter({ hasNot: this.locator.getByRole('columnheader') });
  }

  async rowCount(): Promise<number> {
    return this.rows().count();
  }

  row(index: number): Locator {
    return this.rows().nth(index);
  }

  /** The cell at (row, column), where column is a mapped column name or an index. */
  cell(rowIndex: number, column: string | number): Locator {
    return this.row(rowIndex).getByRole('cell').nth(this.columnIndex(column));
  }

  async cellText(rowIndex: number, column: string | number): Promise<string> {
    return (await this.cell(rowIndex, column).innerText()).trim();
  }

  /** The first row containing this exact cell text — the usual way to find a record. */
  rowByCellText(text: string): Locator {
    return this.rows().filter({ has: this.locator.page().getByRole('cell', { name: text, exact: true }) }).first();
  }

  /** Every value in one column, top to bottom. */
  async columnValues(column: string | number): Promise<string[]> {
    const index = this.columnIndex(column);
    const count = await this.rowCount();
    const values: string[] = [];
    for (let i = 0; i < count; i += 1) {
      values.push((await this.row(i).getByRole('cell').nth(index).innerText()).trim());
    }
    return values;
  }

  private columnIndex(column: string | number): number {
    if (typeof column === 'number') return column;
    const index = this.columns.indexOf(column);
    if (index === -1) {
      throw new Error(
        `Unknown column '${column}' in ${this.description}. Known columns: ${this.columns.join(', ') || '(none mapped)'}`,
      );
    }
    return index;
  }
}
