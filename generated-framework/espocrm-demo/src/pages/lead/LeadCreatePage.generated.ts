// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class LeadCreatePageGenerated extends BasePage {
  readonly path = '/#Lead/create';
  readonly heading = 'Leadscreate';

  // 28 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in LeadCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly firstName = new TextField(this.page, { label: 'First Name' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly lastName = new TextField(this.page, { label: 'Last Name' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly accountName = new TextField(this.page, { label: 'Account Name', via: 'proximity' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly title = new TextField(this.page, { label: 'Title', via: 'proximity' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly website = new TextField(this.page, { label: 'Website', via: 'proximity' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly street = new TextField(this.page, { label: 'Street' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly city = new TextField(this.page, { label: 'City' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly county = new TextField(this.page, { label: 'County' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly postalCode = new TextField(this.page, { label: 'Postal Code' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly country = new TextField(this.page, { label: 'Country' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly opportunityAmount = new TextField(this.page, { field: 'opportunityAmount' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { label: 'Description', via: 'proximity' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'LeadCreatePage', expectedUrl: '/#Lead/create', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
