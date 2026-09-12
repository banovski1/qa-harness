// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Tab, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewPersonalDetailsEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}';
  readonly heading = null;

  // 8 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewPersonalDetailsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly firstName = new TextField(this.page, { label: 'First Name' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly middleName = new TextField(this.page, { label: 'Middle Name' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly lastName = new TextField(this.page, { label: 'Last Name' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly yyyyDdMm = new TextField(this.page, { label: 'yyyy-dd-mm' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly yyyyDdMm2 = new TextField(this.page, { label: 'yyyy-dd-mm' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly save2 = new Button(this.page, { label: 'Save' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
