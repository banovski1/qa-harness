import { Addressed } from './base/Addressed.ts';

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
