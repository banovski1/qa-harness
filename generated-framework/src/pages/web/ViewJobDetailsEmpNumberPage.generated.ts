// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, Tab, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewJobDetailsEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}';
  readonly heading = null;

  // 2 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewJobDetailsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly jobDetailsEmpNumber = new RecordTable(this.page, 'jobDetailsEmpNumber', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly joinedDate = new TextField(this.page, { label: 'Joined Date', via: 'proximity' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly jobTitle = new Select(this.page, { label: 'Job Title', via: 'proximity' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly jobCategory = new Select(this.page, { label: 'Job Category', via: 'proximity' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly subUnit = new Select(this.page, { label: 'Sub Unit', via: 'proximity' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly location = new Select(this.page, { label: 'Location', via: 'proximity' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly employmentStatus = new Select(this.page, { label: 'Employment Status', via: 'proximity' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewJobDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewJobDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
