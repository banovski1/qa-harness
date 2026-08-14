import { BaseComponent } from './base/BaseComponent';

export class CheckboxComponent extends BaseComponent {
  async check(): Promise<void> {
    await this.locator.check();
  }

  async uncheck(): Promise<void> {
    await this.locator.uncheck();
  }

  /** Set the box to an explicit state rather than flipping it. */
  async setChecked(checked: boolean): Promise<void> {
    await this.locator.setChecked(checked);
  }

  async isChecked(): Promise<boolean> {
    return this.locator.isChecked();
  }
}
