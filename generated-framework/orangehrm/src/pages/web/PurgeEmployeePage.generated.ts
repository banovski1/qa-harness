// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';

export class PurgeEmployeePageGenerated extends BasePage {
  readonly path = '/web/index.php/maintenance/purgeEmployee';
  readonly heading = null;

  readonly username = new TextField(this.page, { field: 'username' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly password = new TextField(this.page, { field: 'password' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly confirm = new Button(this.page, { label: 'Confirm' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
