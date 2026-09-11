import { BaseComponent, type LocatorRoot } from './base/BaseComponent';
import { LOCATOR_TEMPLATES } from './locator-templates.generated';

/** An entry inside an opened menu. Open the menu's trigger before using it. */
export class MenuItemComponent extends BaseComponent {
  /** The navigation entry with this label. */
  static byLabel(root: LocatorRoot, label: string): MenuItemComponent {
    return new MenuItemComponent(root.locator(LOCATOR_TEMPLATES.topNavTab(label)), `${label} (menuItem)`);
  }

  async click(): Promise<void> {
    await this.locator.click();
  }
}
