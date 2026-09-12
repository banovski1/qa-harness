// A table addressed by what is in it, never by where a row sits.
//
// `.nth(0)` and "the last row" are the two assertions that break as soon as sorting,
// paging or a parallel worker changes — which is exactly when a create test needs to
// find the row it just made. So every accessor here takes a value.
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';

export interface TableShape {
  root: string;
  row: string;
  cell: string;
  headerCell?: string;
  rowKeyAttribute?: string;
}

export class RecordTable extends BaseComponent {
  readonly shape: TableShape;
  readonly columns: string[];
  readonly keyColumn: string | null;

  constructor(
    page: Page | Locator,
    label: string,
    options: { shape: TableShape; columns?: string[]; keyColumn?: string | null } & ComponentContext,
  ) {
    super(page, label, options);
    this.shape = options.shape;
    this.columns = options.columns ?? [];
    this.keyColumn = options.keyColumn ?? null;
  }

  locator(): Locator {
    return this.root.locator(this.shape.root).first();
  }

  rows(): Locator {
    return this.locator().locator(this.shape.row);
  }

  /** The row whose key cell holds this value. The only supported way to reach a row. */
  row(key: string): Locator {
    return this.rows().filter({ hasText: key });
  }

  cell(key: string, column: string): Locator {
    const index = this.columns.indexOf(column);
    if (index < 0) {
      throw new Error(
        `${this.label}: no column "${column}". Columns observed by the crawl: ` +
        `${this.columns.join(', ') || '(none)'}. If the app gained a column, re-crawl the screen.`,
      );
    }
    return this.row(key).locator(this.shape.cell).nth(index);
  }

  async hasRow(key: string): Promise<boolean> {
    return (await this.row(key).count()) > 0;
  }

  async count(): Promise<number> {
    return this.rows().count();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.count()) === 0;
  }

  async keys(): Promise<string[]> {
    const index = this.keyColumn ? this.columns.indexOf(this.keyColumn) : 0;
    return (await this.rows().locator(this.shape.cell).nth(Math.max(index, 0)).allTextContents())
      .map(t => t.trim());
  }

  /** Assert a record is present, and say what WAS present when it is not. */
  async expectRow(key: string): Promise<void> {
    await this.act(`expect row "${key}"`, async () => {
      await expect(this.row(key)).toHaveCount(1);
    }).catch(async error => {
      const keys = await this.keys().catch(() => []);
      throw new Error(
        `${(error as Error).message}\n  rows present: ${keys.slice(0, 10).join(' | ') || '(table is empty)'}`,
      );
    });
  }

  async expectNoRow(key: string): Promise<void> {
    await this.act(`expect no row "${key}"`, async () => {
      await expect(this.row(key)).toHaveCount(0);
    });
  }

  /**
   * Wait for the table to stop growing. A list that pages in its rows is the difference
   * between "the row is missing" and "the row has not arrived", and the failure says which.
   */
  async settled(): Promise<void> {
    // Rendered first: a table that has not arrived yet reports zero rows, which reads
    // identically to a table that is genuinely empty. These are different failures.
    await this.waitFor(
      `${this.label} to render`,
      async () => (await this.locator().count()) > 0,
      async () => `no element matches the table root ${this.shape.root}`,
    );
    let previous = -1;
    await this.waitFor(
      `${this.label} to stop loading rows`,
      async () => {
        const now = await this.count();
        const stable = now === previous;
        previous = now;
        return stable;
      },
      async () => `rowCount ${await this.count()}`,
    );
  }
}
