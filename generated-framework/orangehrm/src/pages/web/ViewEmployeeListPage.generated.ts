// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewEmployeeListPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewEmployeeListPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly employeeList = new RecordTable(this.page, 'employeeList', { shape: TABLE_SHAPE, columns: ["IdAscendingDescending","First (& Middle) NameAscendingDescending","Last NameAscendingDescending","Job TitleAscendingDescending","Employment StatusAscendingDescending","Sub UnitAscendingDescending","SupervisorAscendingDescending","Actions"], keyColumn: 'IdAscendingDescending', screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly employeeList2 = new Link(this.page, { label: 'Employee List' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly addEmployee = new Link(this.page, { label: 'Add Employee' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly reports = new Link(this.page, { label: 'Reports' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly employeeId = new TextField(this.page, { label: 'Employee Id', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly employmentStatus = new Select(this.page, { label: 'Employment Status', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly include = new Select(this.page, { label: 'Include', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly supervisorName = new TextField(this.page, { label: 'Supervisor Name', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly jobTitle = new Select(this.page, { label: 'Job Title', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly subUnit = new Select(this.page, { label: 'Sub Unit', via: 'proximity' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control1 = new Button(this.page, { label: '1' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control2 = new Button(this.page, { label: '2' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control3 = new Button(this.page, { label: '3' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly control4 = new Button(this.page, { label: '4' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewEmployeeListPage', expectedUrl: '/web/index.php/pim/viewEmployeeList', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
