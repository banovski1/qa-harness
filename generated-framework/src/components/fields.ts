// One class per kind of control. Each is addressed by an English identity and owns the
// assertions that make sense for it — so a spec never writes a locator to assert either.
import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { InteractiveComponent } from './base/interactive.ts';
import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';
import { resolve, type Identity } from './base/resolve.ts';

abstract class Addressed extends InteractiveComponent {
  protected readonly identity: Identity;
  protected readonly host: Page | Locator;
  protected abstract role: string;

  constructor(host: Page | Locator, identity: Identity | string, context: ComponentContext = {}) {
    const id: Identity = typeof identity === 'string' ? { label: identity } : identity;
    super(host, id.label ?? id.field ?? '(unnamed)', context);
    this.identity = id;
    this.host = host;
  }

  locator(): Locator {
    return resolve(this.host, this.identity.role ?? this.role, this.identity);
  }
}

export class TextField extends Addressed {
  protected role = 'textbox';

  async fill(value: string): Promise<void> {
    await this.act(`fill with "${value}"`, async target => {
      await target.fill(value);
    });
  }

  async value(): Promise<string> {
    return this.locator().inputValue();
  }

  async expectValue(expected: string): Promise<void> {
    await this.act(`expect value "${expected}"`, async target => {
      await expect(target).toHaveValue(expected);
    });
  }
}

export class Select extends Addressed {
  protected role = 'combobox';

  /** Works for a native select and for a listbox-and-options widget alike. */
  async choose(option: string): Promise<void> {
    await this.act(`choose "${option}"`, async target => {
      if ((await target.evaluate(el => el.tagName)) === 'SELECT') {
        await target.selectOption({ label: option });
        return;
      }
      await target.click();
      await this.page.getByRole('option', { name: option, exact: true }).click();
    });
  }

  async selected(): Promise<string> {
    return (await this.locator().innerText()).trim();
  }
}

export class Checkbox extends Addressed {
  protected role = 'checkbox';

  async check(): Promise<void> {
    await this.act('check', async target => { await target.check(); });
  }

  async uncheck(): Promise<void> {
    await this.act('uncheck', async target => { await target.uncheck(); });
  }

  async isChecked(): Promise<boolean> {
    return this.locator().isChecked();
  }
}

export class RadioButton extends Checkbox {
  protected role = 'radio';
}

export class Button extends Addressed {
  protected role = 'button';
}

export class Link extends Addressed {
  protected role = 'link';
}

export class Tab extends Addressed {
  protected role = 'tab';
}

export class MenuItem extends Addressed {
  protected role = 'menuitem';
}

/** A flash message. Its text is the confirmation half of every create assertion. */
export class Toast extends BaseComponent {
  private readonly selector: string;

  constructor(page: Page, selector: string, context: ComponentContext = {}) {
    super(page, 'toast', context);
    this.selector = selector;
  }

  locator(): Locator {
    return this.page.locator(this.selector);
  }

  async expectText(expected: string | RegExp): Promise<void> {
    await this.act(`expect text ${expected}`, async target => {
      await expect(target.first()).toContainText(expected);
    });
  }
}
