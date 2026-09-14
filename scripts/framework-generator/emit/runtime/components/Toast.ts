import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';

/** A flash message. Its text is the confirmation half of every create assertion. */
export class Toast extends BaseComponent {
  private readonly selector: string;

  constructor(page: Page, selector: string, context: ComponentContext = {}) {
    super(page, 'toast', context);
    this.selector = selector;
  }

  locator(): Locator {
    return this.page.locator(this.selector);
  }

  async expectText(expected: string | RegExp): Promise<void> {
    await this.act(`expect text ${expected}`, async target => {
      await expect(target.first()).toContainText(expected);
    });
  }
}
