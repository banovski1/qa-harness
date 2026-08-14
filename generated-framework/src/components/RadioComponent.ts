import { BaseComponent } from './base/BaseComponent';

export class RadioComponent extends BaseComponent {
  async select(): Promise<void> {
    await this.locator.check();
  }

  async isSelected(): Promise<boolean> {
    return this.locator.isChecked();
  }
}
