// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Checkbox, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class CaseCreatePageGenerated extends BasePage {
  readonly path = '/#Case/create';
  readonly heading = 'Casescreate';

  // 21 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CaseCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { label: 'Name *', via: 'proximity' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly hiddenFromPortal = new Checkbox(this.page, { label: 'Hidden from Portal', via: 'proximity' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
