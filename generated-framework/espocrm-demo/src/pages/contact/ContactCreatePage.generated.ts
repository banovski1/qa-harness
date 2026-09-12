// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ContactCreatePageGenerated extends BasePage {
  readonly path = '/#Contact/create';
  readonly heading = 'Contactscreate';

  // 13 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ContactCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly contacts = new Link(this.page, { label: 'Contacts' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly firstName = new TextField(this.page, { label: 'First Name' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly lastName = new TextField(this.page, { label: 'Last Name' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly select = new TextField(this.page, { label: 'Select' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly select2 = new Button(this.page, { label: 'Select' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly optedOut = new Button(this.page, { label: 'Opted Out' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly invalid = new Button(this.page, { label: 'Invalid' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly optedOut2 = new Button(this.page, { label: 'Opted Out' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly invalid2 = new Button(this.page, { label: 'Invalid' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly street = new TextField(this.page, { label: 'Street' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly city = new TextField(this.page, { label: 'City' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly county = new TextField(this.page, { label: 'County' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly postalCode = new TextField(this.page, { label: 'Postal Code' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly country = new TextField(this.page, { label: 'Country' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly birthday = new TextField(this.page, { field: 'birthday' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly select3 = new TextField(this.page, { label: 'Select' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly select4 = new TextField(this.page, { label: 'Select' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly select5 = new Button(this.page, { label: 'Select' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to ContactPage. */
  async goToContacts(): Promise<void> {
    await this.contacts.click();
    await this.page.waitForURL(url => url.href.includes('/#Contact'));
  }

  constructor(page: Page) {
    super(page);
  }
}
