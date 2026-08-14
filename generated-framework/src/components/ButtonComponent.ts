import { BaseComponent } from './base/BaseComponent';

export class ButtonComponent extends BaseComponent {
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
