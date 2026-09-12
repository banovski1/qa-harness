// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import type { Locator, Page } from '@playwright/test';
import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';

/** navigation region — 4 controls shared across 15 screens. This class owns the only selector for this region. */
export class NavigationBar extends BaseComponent {
  constructor(page: Page, context: ComponentContext = {}) {
    super(page, 'NavigationBar', context);
  }

  locator(): Locator {
    return this.page.locator('nav.navbar');
  }

  get conduit(): Locator {
    return this.locator().locator('body > app-root > app-layout-header > nav.navbar.navbar-light > div.container > a.navbar-brand');
  }

  get home(): Locator {
    return this.locator().getByRole('link', { name: 'Home', exact: true });
  }

  get signIn(): Locator {
    return this.locator().locator('app-layout-header > nav.navbar.navbar-light > div.container > ul.nav.navbar-nav > li.nav-item:nth-of-type(2) > a.nav-link');
  }

  get signUp(): Locator {
    return this.locator().getByRole('link', { name: 'Sign up', exact: true });
  }

  /** Click one of this region's controls by name, with the shared diagnostics. */
  async click(control: 'conduit' | 'home' | 'signIn' | 'signUp'): Promise<void> {
    await this.act(`click ${control}`, async () => {
      await (this as unknown as Record<string, Locator>)[control].click();
    });
  }

  async goToSignIn(): Promise<void> {
    await this.click('signIn');
  }

  async goToSignUp(): Promise<void> {
    await this.click('signUp');
  }
}
