import { Addressed } from './base/Addressed.ts';

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
