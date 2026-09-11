import type { Page } from '@playwright/test';

/**
 * Common page-object behaviour: navigation and readiness. Element access lives
 * in the generated subclass, so this file stays small and stable.
 */
export abstract class BasePage {
  protected constructor(
    readonly page: Page,
    readonly path: string,
  ) {}

  /**
   * Navigate to this page's own path, relative to the configured baseURL.
   *
   * A parameterized path (`/orders/view/{id}`) needs its record ids:
   * `await ordersViewPage.goto({ id: 7 })`. Navigating without them fails
   * here, by name, instead of as a 404 three seconds later.
   */
  async goto(params: Record<string, string | number> = {}): Promise<void> {
    const target = this.path.replace(/\{(\w+)\}/g, (_, name: string) => {
      const value = params[name];
      if (value === undefined) {
        throw new Error(`${this.constructor.name}: path '${this.path}' needs a value for {${name}}`);
      }
      return encodeURIComponent(String(value));
    });
    await this.page.goto(target, { waitUntil: 'domcontentloaded' });
    await this.waitUntilReady();
  }

  /**
   * Wait for the document, not for the network.
   *
   * 'networkidle' never arrives in an app that polls or holds a socket open, and
   * even 'load' waits on every last font and tracking pixel — on a slow single-
   * page app that is routinely longer than the navigation timeout, so the test
   * fails before the page it is looking at has even been examined. The elements
   * a test actually touches are auto-waited by their own locators, which is the
   * check that matters.
   */
  async waitUntilReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  get url(): string {
    return this.page.url();
  }
}
