import type { Locator } from '@playwright/test';

/**
 * Everything a UI component shares: a Playwright Locator and a human-readable
 * description used in error messages and traces.
 *
 * A component never receives the Page. It only knows its own Locator, so any
 * component can be re-scoped inside another one without changing its code.
 */
export abstract class BaseComponent {
  constructor(
    readonly locator: Locator,
    readonly description: string,
  ) {}

  /** Wait until the component is attached and visible. */
  async waitForVisible(timeout?: number): Promise<void> {
    await this.locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(timeout?: number): Promise<void> {
    await this.locator.waitFor({ state: 'hidden', timeout });
  }

  async isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  async isEnabled(): Promise<boolean> {
    return this.locator.isEnabled();
  }

  async count(): Promise<number> {
    return this.locator.count();
  }

  async scrollIntoView(): Promise<void> {
    await this.locator.scrollIntoViewIfNeeded();
  }

  /** Trimmed inner text, or an empty string when the element has none. */
  async text(): Promise<string> {
    return (await this.locator.innerText()).trim();
  }

  /** Re-scope this component to the nth match, for intentionally repeated widgets. */
  nth(index: number): this {
    const Ctor = this.constructor as new (locator: Locator, description: string) => this;
    return new Ctor(this.locator.nth(index), `${this.description}[${index}]`);
  }
}
