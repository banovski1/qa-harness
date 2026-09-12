// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewLeaveListPageGenerated extends BasePage {
  readonly path = '/web/index.php/leave/viewLeaveList';
  readonly heading = null;

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewLeaveListPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly apply = new Link(this.page, { label: 'Apply' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly myLeave = new Link(this.page, { label: 'My Leave' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly leaveList = new Link(this.page, { label: 'Leave List' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly assignLeave = new Link(this.page, { label: 'Assign Leave' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly yyyyDdMm = new TextField(this.page, { label: 'yyyy-dd-mm' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly yyyyDdMm2 = new TextField(this.page, { label: 'yyyy-dd-mm' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly typeForHints = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
