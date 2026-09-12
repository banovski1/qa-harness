// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewEmployeeListPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';
  readonly heading = null;

  // 8 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewEmployeeListPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly employeeList = new Link(this.page, { label: 'Employee List' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly addEmployee = new Link(this.page, { label: 'Add Employee' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly reports = new Link(this.page, { label: 'Reports' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly typeForHints = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly typeForHints2 = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control1 = new Button(this.page, { label: '1' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control2 = new Button(this.page, { label: '2' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control3 = new Button(this.page, { label: '3' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
