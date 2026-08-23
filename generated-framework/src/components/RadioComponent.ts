import { BaseComponent, type RoleRoot } from './base/BaseComponent';

export class RadioComponent extends BaseComponent {
  /** The radio whose accessible name is this label. */
  static byLabel(root: RoleRoot, label: string): RadioComponent {
    return new RadioComponent(root.getByRole('radio', { name: label, exact: true }), `${label} (radio)`);
  }

  async select(): Promise<void> {
    await this.locator.check();
  }

  async isSelected(): Promise<boolean> {
    return this.locator.isChecked();
  }
}
