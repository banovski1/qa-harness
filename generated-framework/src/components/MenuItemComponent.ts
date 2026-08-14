import { BaseComponent } from './base/BaseComponent';

/** An entry inside an opened menu. Open the menu's trigger before using it. */
export class MenuItemComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }
}
