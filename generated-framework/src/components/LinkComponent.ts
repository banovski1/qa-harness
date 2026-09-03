import { BaseComponent, type RoleRoot } from './base/BaseComponent';

export class LinkComponent extends BaseComponent {
  /** The link whose accessible name is this label. */
  static byLabel(root: RoleRoot, label: string): LinkComponent {
    return new LinkComponent(root.getByRole('link', { name: label, exact: true }), `${label} (link)`);
  }

  async click(): Promise<void> {
    await this.locator.click();
  }

  /** The raw href attribute, or null when the link is JS-driven. */
  async href(): Promise<string | null> {
    return this.locator.getAttribute('href');
  }
}
