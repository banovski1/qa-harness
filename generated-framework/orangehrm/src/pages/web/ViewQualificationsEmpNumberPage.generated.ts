// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Tab } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewQualificationsEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewQualifications/empNumber/{empNumber}';
  readonly heading = null;

  // 7 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewQualificationsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualificationsEmpNumber = new RecordTable(this.page, 'qualificationsEmpNumber', { shape: TABLE_SHAPE, columns: ["Company","Job Title","From","To","Comment","Actions"], keyColumn: 'Company', screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualificationsEmpNumber2 = new RecordTable(this.page, 'qualificationsEmpNumber2', { shape: TABLE_SHAPE, columns: ["Level","Year","GPA/Score","Actions"], keyColumn: 'Level', screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualificationsEmpNumber3 = new RecordTable(this.page, 'qualificationsEmpNumber3', { shape: TABLE_SHAPE, columns: ["Skill","Years of Experience","Actions"], keyColumn: 'Skill', screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualificationsEmpNumber4 = new RecordTable(this.page, 'qualificationsEmpNumber4', { shape: TABLE_SHAPE, columns: ["Language","Fluency","Competency","Comments","Actions"], keyColumn: 'Language', screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualificationsEmpNumber5 = new RecordTable(this.page, 'qualificationsEmpNumber5', { shape: TABLE_SHAPE, columns: ["License Type","Issued Date","Expiry Date","Actions"], keyColumn: 'License Type', screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualificationsEmpNumber6 = new RecordTable(this.page, 'qualificationsEmpNumber6', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewQualificationsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewQualifications/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
