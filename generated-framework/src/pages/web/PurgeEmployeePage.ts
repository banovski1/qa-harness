// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/index.ts';

export class PurgeEmployeePage extends BasePage {
  readonly path = '/web/index.php/maintenance/purgeEmployee';
  readonly heading = null;

  readonly username = new TextField(this.page, { label: 'Username', via: 'proximity' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly password = new TextField(this.page, { label: 'Password', via: 'proximity' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly confirm = new Button(this.page, { label: 'Confirm' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'PurgeEmployeePage', expectedUrl: '/web/index.php/maintenance/purgeEmployee', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
