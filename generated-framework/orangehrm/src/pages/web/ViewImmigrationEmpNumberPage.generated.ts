// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/analysis.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Tab } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewImmigrationEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewImmigration/empNumber/{empNumber}';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewImmigrationEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigrationEmpNumber = new RecordTable(this.page, 'immigrationEmpNumber', { shape: TABLE_SHAPE, columns: ["Document","Number","Issued By","Issued Date","Expiry Date","Actions"], keyColumn: 'Document', screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigrationEmpNumber2 = new RecordTable(this.page, 'immigrationEmpNumber2', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewImmigrationEmpNumberPage', expectedUrl: '/web/index.php/pim/viewImmigration/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
