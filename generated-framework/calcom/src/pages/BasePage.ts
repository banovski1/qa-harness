// What every page object shares: how to get there, and how to prove you did.
import { expect, type Page } from '@playwright/test';

export abstract class BasePage {
  abstract readonly path: string;
  abstract readonly heading: string | null;

  constructor(readonly page: Page) {}

  /**
   * The URL this screen occupies, as a pattern: a record slot matches any value, and a
   * query string is allowed. Anchored at the end on purpose — without that, "/#Contact"
   * would also match "/#Contact/view/123", and a test that never left the detail screen
   * would report itself as being on the list.
   */
  get urlPattern(): RegExp {
    const escaped = this.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped.replace(/\\\{\w+\\\}/g, '[^/]+') + '(\\?.*)?$');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    // A hash-router app does not reload when only the fragment changes, so the router
    // may not have swapped the screen by the time goto() returns.
    await this.page.waitForURL(this.urlPattern, { timeout: 30_000 });
    await this.expectLoaded();
  }

  /**
   * The screen's identity. Only the URL is asserted: it comes from the app's own route
   * declaration, so it is a contract. The heading comes from one crawl of one moment —
   * evidence, not a promise — so assert it explicitly with expectHeading() where you
   * have confirmed it, rather than having every goto() depend on it.
   */
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(this.urlPattern);
  }

  /** The heading the crawl saw on this screen, asserted loosely. */
  async expectHeading(): Promise<void> {
    if (!this.heading) throw new Error(`${this.constructor.name} records no heading in the analysis.`);
    await expect(
      this.page.getByRole('heading', { name: this.heading, exact: false }).first(),
    ).toBeVisible();
  }
}
