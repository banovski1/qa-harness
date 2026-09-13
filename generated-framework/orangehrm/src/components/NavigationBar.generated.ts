// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/analysis.json (56e23b3b09)

import type { Locator, Page } from '@playwright/test';
import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';

/** navigation region — 15 controls shared across 21 screens. This class owns the only selector for this region. */
export class NavigationBar extends BaseComponent {
  constructor(page: Page, context: ComponentContext = {}) {
    super(page, 'NavigationBar', context);
  }

  locator(): Locator {
    return this.page.locator('.oxd-sidepanel');
  }

  get clientBrandLogo(): Locator {
    return this.locator().getByRole('link', { name: 'client brand logo', exact: true });
  }

  get search(): Locator {
    return this.locator().getByRole('textbox', { name: 'Search', exact: true });
  }

  get admin(): Locator {
    return this.locator().getByRole('link', { name: 'Admin', exact: true });
  }

  get pIM(): Locator {
    return this.locator().getByRole('link', { name: 'PIM', exact: true });
  }

  get leave(): Locator {
    return this.locator().getByRole('link', { name: 'Leave', exact: true });
  }

  get time(): Locator {
    return this.locator().getByRole('link', { name: 'Time', exact: true });
  }

  get recruitment(): Locator {
    return this.locator().getByRole('link', { name: 'Recruitment', exact: true });
  }

  get myInfo(): Locator {
    return this.locator().getByRole('link', { name: 'My Info', exact: true });
  }

  get performance(): Locator {
    return this.locator().getByRole('link', { name: 'Performance', exact: true });
  }

  get dashboard(): Locator {
    return this.locator().getByRole('link', { name: 'Dashboard', exact: true });
  }

  get directory(): Locator {
    return this.locator().getByRole('link', { name: 'Directory', exact: true });
  }

  get maintenance(): Locator {
    return this.locator().getByRole('link', { name: 'Maintenance', exact: true });
  }

  get claim(): Locator {
    return this.locator().getByRole('link', { name: 'Claim', exact: true });
  }

  get buzz(): Locator {
    return this.locator().getByRole('link', { name: 'Buzz', exact: true });
  }

  get help(): Locator {
    return this.locator().getByRole('button', { name: 'Help', exact: true });
  }

  /** Click one of this region's controls by name, with the shared diagnostics. */
  async click(control: 'clientBrandLogo' | 'search' | 'admin' | 'pIM' | 'leave' | 'time' | 'recruitment' | 'myInfo' | 'performance' | 'dashboard' | 'directory' | 'maintenance' | 'claim' | 'buzz' | 'help'): Promise<void> {
    await this.act(`click ${control}`, async () => {
      await (this as unknown as Record<string, Locator>)[control].click();
    });
  }

}
