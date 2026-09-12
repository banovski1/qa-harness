// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class AccountCreatePageGenerated extends BasePage {
  readonly path = '/#Account/create';
  readonly heading = 'Accountscreate';

  // 12 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in AccountCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly accounts = new Link(this.page, { label: 'Accounts' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { field: 'name' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly website = new TextField(this.page, { field: 'website' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly optedOut = new Button(this.page, { label: 'Opted Out' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly invalid = new Button(this.page, { label: 'Invalid' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly optedOut2 = new Button(this.page, { label: 'Opted Out' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly invalid2 = new Button(this.page, { label: 'Invalid' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly street = new TextField(this.page, { label: 'Street' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly city = new TextField(this.page, { label: 'City' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly county = new TextField(this.page, { label: 'County' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly postalCode = new TextField(this.page, { label: 'Postal Code' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly country = new TextField(this.page, { label: 'Country' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly street2 = new TextField(this.page, { label: 'Street' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly city2 = new TextField(this.page, { label: 'City' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly county2 = new TextField(this.page, { label: 'County' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly postalCode2 = new TextField(this.page, { label: 'Postal Code' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly country2 = new TextField(this.page, { label: 'Country' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly select = new TextField(this.page, { label: 'Select' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly select2 = new Button(this.page, { label: 'Select' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly select3 = new TextField(this.page, { label: 'Select' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly select4 = new Button(this.page, { label: 'Select' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'AccountCreatePage', expectedUrl: '/#Account/create', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to AccountPage. */
  async goToAccounts(): Promise<void> {
    await this.accounts.click();
    await this.page.waitForURL(url => url.href.includes('/#Account'));
  }

  constructor(page: Page) {
    super(page);
  }
}
