// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, TextField } from '../../components/index.ts';
import { NavigationBar } from '../../components/NavigationBar.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.ts';

export class ViewAssignClaimPage extends BasePage {
  readonly path = '/web/index.php/claim/viewAssignClaim';
  readonly heading = null;

  // 2 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewAssignClaimPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly assignClaim = new RecordTable(this.page, 'assignClaim', { shape: TABLE_SHAPE, columns: ["Reference IdAscendingDescending","Employee NameAscendingDescending","Event NameAscendingDescending","Description","Currency","Submitted DateAscendingDescending","StatusAscendingDescending","Amount","Actions"], keyColumn: 'Reference IdAscendingDescending', screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly submitClaim = new Link(this.page, { label: 'Submit Claim' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly myClaims = new Link(this.page, { label: 'My Claims' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly employeeClaims = new Link(this.page, { label: 'Employee Claims' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly assignClaim2 = new Link(this.page, { label: 'Assign Claim' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly referenceId = new TextField(this.page, { label: 'Reference Id', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly eventName = new Select(this.page, { label: 'Event Name', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly status = new Select(this.page, { label: 'Status', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly fromDate = new TextField(this.page, { label: 'From Date', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly toDate = new TextField(this.page, { label: 'To Date', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly include = new Select(this.page, { label: 'Include', via: 'proximity' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly assignClaim3 = new Button(this.page, { label: 'Assign Claim' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
