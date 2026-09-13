// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewLeaveListPageGenerated extends BasePage {
  readonly path = '/web/index.php/leave/viewLeaveList';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewLeaveListPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly leaveList = new RecordTable(this.page, 'leaveList', { shape: TABLE_SHAPE, columns: ["Date","Employee Name","Leave Type","Leave Balance (Days)","Number of Days","Status","Comments","Actions"], keyColumn: 'Date', screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly apply = new Link(this.page, { label: 'Apply' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly myLeave = new Link(this.page, { label: 'My Leave' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly leaveList2 = new Link(this.page, { label: 'Leave List' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly assignLeave = new Link(this.page, { label: 'Assign Leave' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly fromDate = new TextField(this.page, { label: 'From Date', via: 'proximity' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly toDate = new TextField(this.page, { label: 'To Date', via: 'proximity' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly showLeaveWithStatus = new Select(this.page, { label: 'Show Leave with Status', via: 'proximity' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly leaveType = new Select(this.page, { label: 'Leave Type', via: 'proximity' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly subUnit = new Select(this.page, { label: 'Sub Unit', via: 'proximity' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });
  readonly control = new Button(this.page, { label: '×' }, { screen: 'ViewLeaveListPage', expectedUrl: '/web/index.php/leave/viewLeaveList', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
