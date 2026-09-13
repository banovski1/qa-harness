// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Tab } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewReportToDetailsEmpNumberPageGenerated extends BasePage {
  readonly path = '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}';
  readonly heading = null;

  // 1 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewReportToDetailsEmpNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportToDetailsEmpNumber = new RecordTable(this.page, 'reportToDetailsEmpNumber', { shape: TABLE_SHAPE, columns: ["Name","Reporting Method"], keyColumn: 'Name', screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportToDetailsEmpNumber2 = new RecordTable(this.page, 'reportToDetailsEmpNumber2', { shape: TABLE_SHAPE, columns: ["Name","Reporting Method"], keyColumn: 'Name', screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportToDetailsEmpNumber3 = new RecordTable(this.page, 'reportToDetailsEmpNumber3', { shape: TABLE_SHAPE, columns: ["File Name","Description","Size","Type","Date Added","Added By","Actions"], keyColumn: 'File Name', screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails = new Tab(this.page, { label: 'Personal Details' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly personalDetails2 = new Link(this.page, { label: 'Personal Details' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails = new Tab(this.page, { label: 'Contact Details' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly contactDetails2 = new Link(this.page, { label: 'Contact Details' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts = new Tab(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly emergencyContacts2 = new Link(this.page, { label: 'Emergency Contacts' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents = new Tab(this.page, { label: 'Dependents' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly dependents2 = new Link(this.page, { label: 'Dependents' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration = new Tab(this.page, { label: 'Immigration' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly immigration2 = new Link(this.page, { label: 'Immigration' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job = new Tab(this.page, { label: 'Job' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly job2 = new Link(this.page, { label: 'Job' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary = new Tab(this.page, { label: 'Salary' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly salary2 = new Link(this.page, { label: 'Salary' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo = new Tab(this.page, { label: 'Report-to' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly reportTo2 = new Link(this.page, { label: 'Report-to' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications = new Tab(this.page, { label: 'Qualifications' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly qualifications2 = new Link(this.page, { label: 'Qualifications' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships = new Tab(this.page, { label: 'Memberships' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly memberships2 = new Link(this.page, { label: 'Memberships' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewReportToDetailsEmpNumberPage', expectedUrl: '/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
