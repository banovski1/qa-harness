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

  // 23 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ContactCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly firstName = new TextField(this.page, { label: 'First Name' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly lastName = new TextField(this.page, { label: 'Last Name' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly street = new TextField(this.page, { label: 'Street' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly city = new TextField(this.page, { label: 'City' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly county = new TextField(this.page, { label: 'County' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly postalCode = new TextField(this.page, { label: 'Postal Code' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly country = new TextField(this.page, { label: 'Country' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly birthday = new TextField(this.page, { field: 'birthday' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { label: 'Description', via: 'proximity' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ContactCreatePage', expectedUrl: '/#Contact/create', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
