import type { Locator } from '@playwright/test';

/**
 * What a component's static factory can be scoped to. Structural, not `Page`, so
 * the same factory resolves against the page or inside another component's
 * locator: `InputComponent.byLabel(section.locator, 'From')`.
 */
export type LocatorRoot = { locator(selector: string): Locator };

export type RoleRoot = {
  getByRole(role: 'link' | 'button' | 'tab' | 'radio' | 'heading', options?: { name?: string; exact?: boolean }): Locator;
};

/**
 * Everything a UI component shares: a Playwright Locator and a human-readable
 * description used in error messages and traces.
 *
 * A component never receives the Page. It only knows its own Locator, so any
 * component can be re-scoped inside another one without changing its code. The
 * static factories keep that promise: they take a root, resolve it immediately,
 * and hand the instance nothing but its own Locator.
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
