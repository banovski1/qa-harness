import { BaseComponent } from './base/BaseComponent';

/**
 * A single option inside an opened dropdown or listbox. It only exists while
 * its dropdown is open, so tests must open the trigger before touching it.
 */
export class OptionComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }

  async isSelected(): Promise<boolean> {
    return (await this.locator.getAttribute('aria-selected')) === 'true';
  }
}
