// The interaction surface every control shares. Split from BaseComponent so a
// read-only component (a label, a heading) cannot accidentally offer a click.
import type { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent.ts';

export abstract class InteractiveComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.act('click', async target => {
      await target.click();
    });
  }

  async hover(): Promise<void> {
    await this.act('hover', async target => {
      await target.hover();
    });
  }

  async focus(): Promise<void> {
    await this.act('focus', async target => {
      await target.focus();
    });
  }

  async isDisabled(): Promise<boolean> {
    return this.locator().isDisabled();
  }

  /** The validation message the app shows for this control, if any. */
  async errorMessage(): Promise<string | null> {
    const holder: Locator = this.locator().locator(
      'xpath=ancestor-or-self::*[1]/following-sibling::*[contains(@class,"error") or @role="alert"][1]',
    );
    return (await holder.count()) ? (await holder.first().innerText()).trim() : null;
  }
}
