// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class TaskCreatePageGenerated extends BasePage {
  readonly path = '/#Task/create';
  readonly heading = 'Taskscreate';

  // 12 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in TaskCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly tasks = new Link(this.page, { label: 'Tasks' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { field: 'name' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select = new TextField(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select2 = new Button(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly dateStart = new TextField(this.page, { field: 'dateStart' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly dateStartTime = new TextField(this.page, { field: 'dateStart-time' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly dateEnd = new TextField(this.page, { field: 'dateEnd' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly dateEndTime = new TextField(this.page, { field: 'dateEnd-time' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select3 = new TextField(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select4 = new Button(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select5 = new TextField(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select6 = new Button(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select7 = new TextField(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly select8 = new Button(this.page, { label: 'Select' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'TaskCreatePage', expectedUrl: '/#Task/create', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to TaskPage. */
  async goToTasks(): Promise<void> {
    await this.tasks.click();
    await this.page.waitForURL(url => url.href.includes('/#Task'));
  }

  constructor(page: Page) {
    super(page);
  }
}
