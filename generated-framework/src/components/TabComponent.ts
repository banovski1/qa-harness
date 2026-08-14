import { BaseComponent } from './base/BaseComponent';

export class TabComponent extends BaseComponent {
  async select(): Promise<void> {
    await this.locator.click();
  }

  async isSelected(): Promise<boolean> {
    return (await this.locator.getAttribute('aria-selected')) === 'true';
  }
}
