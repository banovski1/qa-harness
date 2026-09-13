// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, Tab, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ContactDetailsEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/contactDetails/empNumber/{empNumber}';
  readonly heading = null;

  // 1 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ContactDetailsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetailsEmpNumber = new RecordTable(this.page, 'contactDetailsEmpNumber', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly street1 = new TextField(this.page, { label: 'Street 1', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly street2 = new TextField(this.page, { label: 'Street 2', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly city = new TextField(this.page, { label: 'City', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly stateProvince = new TextField(this.page, { label: 'State/Province', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly zipPostalCode = new TextField(this.page, { label: 'Zip/Postal Code', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly country = new Select(this.page, { label: 'Country', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly home = new TextField(this.page, { label: 'Home', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly mobile = new TextField(this.page, { label: 'Mobile', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly work = new TextField(this.page, { label: 'Work', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly workEmail = new TextField(this.page, { label: 'Work Email', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly otherEmail = new TextField(this.page, { label: 'Other Email', via: 'proximity' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ContactDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/contactDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
