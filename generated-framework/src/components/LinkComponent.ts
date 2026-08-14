import { BaseComponent } from './base/BaseComponent';

export class LinkComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }

  /** The raw href attribute, or null when the link is JS-driven. */
  async href(): Promise<string | null> {
    return this.locator.getAttribute('href');
  }
}
