// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class AccountPageGenerated extends BasePage {
  readonly path = '/#Account';
  readonly heading = 'Accounts';

  // 9 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in AccountPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'AccountPage', expectedUrl: '/#Account', modelPath: MODEL_PATH });
  readonly accounts = new RecordTable(this.page, 'accounts', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Industry","Type","Country"], keyColumn: 'Name', screen: 'AccountPage', expectedUrl: '/#Account', modelPath: MODEL_PATH });
  readonly createAccount = new Link(this.page, { label: 'Create Account' }, { screen: 'AccountPage', expectedUrl: '/#Account', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'AccountPage', expectedUrl: '/#Account', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'AccountPage', expectedUrl: '/#Account', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'AccountPage', expectedUrl: '/#Account', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to AccountCreatePage. */
  async goToCreateAccount(): Promise<void> {
    await this.createAccount.click();
    await this.page.waitForURL(url => url.href.includes('/#Account/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
