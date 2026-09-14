// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/index.ts';
import { NavigationBar } from '../../components/NavigationBar.ts';

export class IndexPage extends BasePage {
  readonly path = '/web/index.php/dashboard/index';
  readonly heading = null;

  // 4 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in IndexPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly assignLeave = new Button(this.page, { label: 'Assign Leave' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly leaveList = new Button(this.page, { label: 'Leave List' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly timesheets = new Button(this.page, { label: 'Timesheets' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly applyLeave = new Button(this.page, { label: 'Apply Leave' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly myLeave = new Button(this.page, { label: 'My Leave' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly myTimesheet = new Button(this.page, { label: 'My Timesheet' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'IndexPage', expectedUrl: '/web/index.php/dashboard/index', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
