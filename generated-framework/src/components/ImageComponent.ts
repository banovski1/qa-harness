import { BaseComponent } from './base/BaseComponent';

export class ImageComponent extends BaseComponent {
  async src(): Promise<string | null> {
    return this.locator.getAttribute('src');
  }

  async alt(): Promise<string | null> {
    return this.locator.getAttribute('alt');
  }
}
