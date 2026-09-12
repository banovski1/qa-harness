// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewAssignClaimPageGenerated extends BasePage {
  readonly path = '/web/index.php/claim/viewAssignClaim';
  readonly heading = null;

  // 4 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewAssignClaimPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly submitClaim = new Link(this.page, { label: 'Submit Claim' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly myClaims = new Link(this.page, { label: 'My Claims' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly employeeClaims = new Link(this.page, { label: 'Employee Claims' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly assignClaim = new Link(this.page, { label: 'Assign Claim' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly typeForHints = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly typeForHints2 = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly yyyyDdMm = new TextField(this.page, { label: 'yyyy-dd-mm' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly yyyyDdMm2 = new TextField(this.page, { label: 'yyyy-dd-mm' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly assignClaim2 = new Button(this.page, { label: 'Assign Claim' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewAssignClaimPage', expectedUrl: '/web/index.php/claim/viewAssignClaim', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
