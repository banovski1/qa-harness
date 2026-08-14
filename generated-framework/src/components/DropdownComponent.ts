import { BaseComponent } from './base/BaseComponent';
import { OptionComponent } from './OptionComponent';

/**
 * A dropdown trigger. Application dropdowns are usually not a native <select>,
 * so the options only exist in the DOM once the trigger is open — open() first,
 * then read or pick an option.
 */
export class DropdownComponent extends BaseComponent {
  async open(): Promise<void> {
    await this.locator.click();
  }

  /** The currently displayed value. */
  async selectedText(): Promise<string> {
    return (await this.locator.innerText()).trim();
  }

  /** Open the dropdown and click the option with this exact label. */
  async selectByLabel(label: string): Promise<void> {
    await this.open();
    await this.option(label).click();
  }

  option(label: string): OptionComponent {
    const page = this.locator.page();
    return new OptionComponent(page.getByRole('option', { name: label, exact: true }), label);
  }

  /** Open the dropdown and return every visible option label. */
  async optionLabels(): Promise<string[]> {
    await this.open();
    const page = this.locator.page();
    return page.getByRole('option').allInnerTexts();
  }
}
