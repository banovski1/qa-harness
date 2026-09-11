import { BaseComponent, type LocatorRoot } from './base/BaseComponent';
import { LOCATOR_TEMPLATES } from './locator-templates.generated';

export class InputComponent extends BaseComponent {
  /** The text field belonging to this label. */
  static byLabel(root: LocatorRoot, label: string): InputComponent {
    return new InputComponent(root.locator(LOCATOR_TEMPLATES.labelledInput(label)), `${label} (input)`);
  }

  /** The multi-line field belonging to this label. */
  static textareaByLabel(root: LocatorRoot, label: string): InputComponent {
    return new InputComponent(root.locator(LOCATOR_TEMPLATES.labelledTextarea(label)), `${label} (longInput)`);
  }

  /** Replace the field's contents. */
  async fill(value: string): Promise<void> {
    await this.locator.fill(value);
  }

  /** Type character by character, for fields with keystroke-driven autocomplete. */
  async type(value: string, delay = 50): Promise<void> {
    await this.locator.pressSequentially(value, { delay });
  }

  async clear(): Promise<void> {
    await this.locator.fill('');
  }

  async value(): Promise<string> {
    return this.locator.inputValue();
  }

  async press(key: string): Promise<void> {
    await this.locator.press(key);
  }
}
