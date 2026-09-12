// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class TaskPageGenerated extends BasePage {
  readonly path = '/#Task';
  readonly heading = 'Tasks';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in TaskPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly tasks = new RecordTable(this.page, 'tasks', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","Priority","Date Due","Assigned User"], keyColumn: 'Name', screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly createTask = new Link(this.page, { label: 'Create Task' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly list = new Button(this.page, { label: 'List' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly kanban = new Button(this.page, { label: 'Kanban' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly control11919 = new Button(this.page, { label: '1–19 / 19' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'TaskPage', expectedUrl: '/#Task', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to TaskCreatePage. */
  async goToCreateTask(): Promise<void> {
    await this.createTask.click();
    await this.page.waitForURL(url => url.href.includes('/#Task/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
