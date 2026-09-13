// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewEmployeeTimesheetPageGenerated extends BasePage {
  readonly path = '/web/index.php/time/viewEmployeeTimesheet';
  readonly heading = null;

  // 2 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewEmployeeTimesheetPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewEmployeeTimesheetPage', expectedUrl: '/web/index.php/time/viewEmployeeTimesheet', modelPath: MODEL_PATH });
  readonly employeeTimesheet = new RecordTable(this.page, 'employeeTimesheet', { shape: TABLE_SHAPE, columns: ["Employee Name","Timesheet Period","Actions"], keyColumn: 'Employee Name', screen: 'ViewEmployeeTimesheetPage', expectedUrl: '/web/index.php/time/viewEmployeeTimesheet', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewEmployeeTimesheetPage', expectedUrl: '/web/index.php/time/viewEmployeeTimesheet', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewEmployeeTimesheetPage', expectedUrl: '/web/index.php/time/viewEmployeeTimesheet', modelPath: MODEL_PATH });
  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, { screen: 'ViewEmployeeTimesheetPage', expectedUrl: '/web/index.php/time/viewEmployeeTimesheet', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewEmployeeTimesheetPage', expectedUrl: '/web/index.php/time/viewEmployeeTimesheet', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
