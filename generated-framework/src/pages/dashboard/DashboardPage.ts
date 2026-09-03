import type { Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { NavigationBar } from '../../components/navigation/NavigationBar';
import { TextComponent } from '../../components/TextComponent';

export class DashboardPage extends BasePage {
  static readonly path = '/web/index.php/dashboard/index';

  constructor(page: Page) {
    super(page, DashboardPage.path);
  }

  readonly navigation = new NavigationBar(this.page);

  get dashboardHeading(): TextComponent {
    return new TextComponent(this.page.getByRole('heading', { name: 'Dashboard', exact: true }), 'Dashboard (text)');
  }
}
