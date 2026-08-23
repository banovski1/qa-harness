import { BaseComponent, type RoleRoot } from './base/BaseComponent';

export class ButtonComponent extends BaseComponent {
  /** The button whose accessible name is this label. */
  static byLabel(root: RoleRoot, label: string): ButtonComponent {
    return new ButtonComponent(root.getByRole('button', { name: label, exact: true }), `${label} (button)`);
  }

  async click(): Promise<void> {
    await this.locator.click();
  }

  async doubleClick(): Promise<void> {
    await this.locator.dblclick();
  }

  /** The button's accessible label, which is often an icon-only empty string. */
  async label(): Promise<string> {
    return (await this.locator.innerText()).trim();
  }
}
