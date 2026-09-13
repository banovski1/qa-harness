// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class EmailPageGenerated extends BasePage {
  readonly path = '/#Email';
  readonly heading = 'Emails';

  // 10 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in EmailPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly compose = new Button(this.page, { label: 'Compose' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly all = new Link(this.page, { label: 'All' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly inbox = new Link(this.page, { label: 'Inbox' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly important = new Link(this.page, { label: 'Important' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly sent = new Link(this.page, { label: 'Sent' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly myPersonal = new Link(this.page, { label: 'My Personal' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly sales = new Link(this.page, { label: 'Sales' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly archive = new Link(this.page, { label: 'Archive' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly control2 = new Link(this.page, { label: '2' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly drafts = new Link(this.page, { label: 'Drafts' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly trash = new Link(this.page, { label: 'Trash' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'EmailPage', expectedUrl: '/#Email', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
