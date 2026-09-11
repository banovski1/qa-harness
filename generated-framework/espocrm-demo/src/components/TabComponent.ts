import { BaseComponent, type RoleRoot } from './base/BaseComponent';

export class TabComponent extends BaseComponent {
  /**
   * The tab whose accessible name is this label. Apps that render their tabs as
   * plain anchors expose role `link` instead, and those keep their mapped locator.
   */
  static byLabel(root: RoleRoot, label: string): TabComponent {
    return new TabComponent(root.getByRole('tab', { name: label, exact: true }), `${label} (tab)`);
  }

  async select(): Promise<void> {
    await this.locator.click();
  }

  async isSelected(): Promise<boolean> {
    return (await this.locator.getAttribute('aria-selected')) === 'true';
  }
}
