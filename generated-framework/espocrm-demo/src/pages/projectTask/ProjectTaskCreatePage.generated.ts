// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ProjectTaskCreatePageGenerated extends BasePage {
  readonly path = '/#ProjectTask/create';
  readonly heading = 'Project Taskscreate';

  // 17 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ProjectTaskCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { label: 'Name *', via: 'proximity' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly dateStart = new TextField(this.page, { field: 'dateStart' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly dateEnd = new TextField(this.page, { field: 'dateEnd' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ProjectTaskCreatePage', expectedUrl: '/#ProjectTask/create', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
