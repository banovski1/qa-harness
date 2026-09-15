// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, TextField } from '../../components/index.ts';
import { NavigationBar } from '../../components/NavigationBar.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.ts';

export class ViewSystemUsersPage extends BasePage {
  readonly path = '/web/index.php/admin/viewSystemUsers';
  readonly heading = null;

  // 2 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewSystemUsersPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly systemUsers = new RecordTable(this.page, 'systemUsers', { shape: TABLE_SHAPE, columns: ["UsernameAscendingDescending","User RoleAscendingDescending","Employee NameAscendingDescending","StatusAscendingDescending","Actions"], keyColumn: 'UsernameAscendingDescending', screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly nationalities = new Link(this.page, { label: 'Nationalities' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly corporateBranding = new Link(this.page, { label: 'Corporate Branding' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly username = new TextField(this.page, { label: 'Username', via: 'proximity' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly userRole = new Select(this.page, { label: 'User Role', via: 'proximity' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly status = new Select(this.page, { label: 'Status', via: 'proximity' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewSystemUsersPage', expectedUrl: '/web/index.php/admin/viewSystemUsers', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
