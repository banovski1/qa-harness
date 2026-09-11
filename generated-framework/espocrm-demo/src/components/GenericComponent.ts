import { BaseComponent } from './base/BaseComponent';

/**
 * Fallback for a mapped component type this framework has no dedicated class
 * for yet (alerts, modals, progress bars). It exposes only what is safe for any
 * element; add a proper class when you need richer behaviour.
 */
export class GenericComponent extends BaseComponent {
  async click(): Promise<void> {
    await this.locator.click();
  }
}
