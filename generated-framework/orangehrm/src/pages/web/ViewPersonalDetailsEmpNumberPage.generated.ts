// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/analysis.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, Tab, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewPersonalDetailsEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewPersonalDetailsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetailsEmpNumber = new RecordTable(this.page, 'personalDetailsEmpNumber', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
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
  readonly employeeId = new TextField(this.page, { label: 'Employee Id', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly otherId = new TextField(this.page, { label: 'Other Id', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly driverSLicenseNumber = new TextField(this.page, { label: 'Driver\'s License Number', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly licenseExpiryDate = new TextField(this.page, { label: 'License Expiry Date', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly nationality = new Select(this.page, { label: 'Nationality', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly maritalStatus = new Select(this.page, { label: 'Marital Status', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dateOfBirth = new TextField(this.page, { label: 'Date of Birth', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly bloodType = new Select(this.page, { label: 'Blood Type', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly testField = new TextField(this.page, { label: 'Test_Field', via: 'proximity' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewPersonalDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
