// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Checkbox, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class CaseCreatePageGenerated extends BasePage {
  readonly path = '/#Case/create';
  readonly heading = 'Casescreate';

  // 10 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CaseCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly cases = new Link(this.page, { label: 'Cases' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { field: 'name' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select = new TextField(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select2 = new Button(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select3 = new TextField(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select4 = new Button(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select5 = new TextField(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select6 = new Button(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select7 = new TextField(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select8 = new Button(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select9 = new TextField(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly select10 = new Button(this.page, { label: 'Select' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly isInternal = new Checkbox(this.page, { field: 'isInternal' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CaseCreatePage', expectedUrl: '/#Case/create', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to CasePage. */
  async goToCases(): Promise<void> {
    await this.cases.click();
    await this.page.waitForURL(url => url.href.includes('/#Case'));
  }

  constructor(page: Page) {
    super(page);
  }
}
