// A text input, addressed by the English name a person reads next to it.
import { expect } from '@playwright/test';
import { Addressed } from './base/Addressed.ts';

export class TextField extends Addressed {
  protected role = 'textbox';

  async fill(value: string): Promise<void> {
    await this.act(`fill with "${value}"`, async target => {
      await target.fill(value);
    }, value);
  }

  async value(): Promise<string> {
    return this.locator().inputValue();
  }

  async expectValue(expected: string): Promise<void> {
    await this.act(`expect value "${expected}"`, async target => {
      await expect(target).toHaveValue(expected);
    }, expected);
  }
}
