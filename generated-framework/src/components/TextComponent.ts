import { BaseComponent, type RoleRoot } from './base/BaseComponent';

/** Read-only text: headings, labels, static copy. Deliberately has no click(). */
export class TextComponent extends BaseComponent {
  /** The heading whose accessible name is this label. */
  static byHeading(root: RoleRoot, label: string): TextComponent {
    return new TextComponent(root.getByRole('heading', { name: label, exact: true }), `${label} (text)`);
  }

  async contains(fragment: string): Promise<boolean> {
    return (await this.text()).includes(fragment);
  }
}
