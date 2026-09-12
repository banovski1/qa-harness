// What every page object shares: how to get there, and how to prove you did.
import { expect, type Page } from '@playwright/test';

export abstract class BasePage {
  abstract readonly path: string;
  abstract readonly heading: string | null;

  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.expectLoaded();
  }

  /** The screen's identity, from the analysis: its URL, and the heading it renders. */
  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(escapeRegExp(this.path).replace(/\\\{\w+\\\}/g, '[^/]+')));
    if (this.heading) {
      await expect(
        this.page.getByRole('heading', { name: this.heading, exact: false }).first(),
      ).toBeVisible();
    }
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
