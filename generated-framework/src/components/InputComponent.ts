import { BaseComponent } from './base/BaseComponent';

export class InputComponent extends BaseComponent {
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
