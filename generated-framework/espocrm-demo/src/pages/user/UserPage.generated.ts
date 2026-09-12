// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class UserPageGenerated extends BasePage {
  readonly path = '/#User';
  readonly heading = 'Users';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in UserPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly users = new RecordTable(this.page, 'users', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","User Name","Title","Email","Is Active"], keyColumn: 'Name', screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly createUser = new Link(this.page, { label: 'Create User' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly control155 = new Button(this.page, { label: '1–5 / 5' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'UserPage', expectedUrl: '/#User', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
