// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/index.ts';
import { NavigationBar } from '../../components/NavigationBar.ts';

export class AddEmployeePage extends BasePage {
  readonly path = '/web/index.php/pim/addEmployee';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in AddEmployeePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly employeeList = new Link(this.page, { label: 'Employee List' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly addEmployee = new Link(this.page, { label: 'Add Employee' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly reports = new Link(this.page, { label: 'Reports' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly firstName = new TextField(this.page, { label: 'First Name' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly middleName = new TextField(this.page, { label: 'Middle Name' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly lastName = new TextField(this.page, { label: 'Last Name' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly employeeId = new TextField(this.page, { label: 'Employee Id', via: 'proximity' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'AddEmployeePage', expectedUrl: '/web/index.php/pim/addEmployee', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
