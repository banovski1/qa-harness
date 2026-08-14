import { BaseComponent } from './base/BaseComponent';

/** Read-only text: headings, labels, static copy. Deliberately has no click(). */
export class TextComponent extends BaseComponent {
  async contains(fragment: string): Promise<boolean> {
    return (await this.text()).includes(fragment);
  }
}
