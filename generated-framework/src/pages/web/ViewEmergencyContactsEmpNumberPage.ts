// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Tab } from '../../components/index.ts';
import { NavigationBar } from '../../components/NavigationBar.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.ts';

export class ViewEmergencyContactsEmpNumberPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewEmergencyContactsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContactsEmpNumber = new RecordTable(this.page, 'emergencyContactsEmpNumber', { shape: TABLE_SHAPE, columns: ["Name","Relationship","Home Telephone","Mobile","Work Telephone","Actions"], keyColumn: 'Name', screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContactsEmpNumber2 = new RecordTable(this.page, 'emergencyContactsEmpNumber2', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewEmergencyContactsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
