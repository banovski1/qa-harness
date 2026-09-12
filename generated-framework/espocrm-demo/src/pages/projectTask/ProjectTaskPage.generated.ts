// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ProjectTaskPageGenerated extends BasePage {
  readonly path = '/#ProjectTask';
  readonly heading = 'Project Tasks';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ProjectTaskPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly projectTasks = new RecordTable(this.page, 'projectTasks', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Project","Stage","Timeline","Priority"], keyColumn: 'Name', screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly createTask = new Link(this.page, { label: 'Create Task' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly control12023 = new Button(this.page, { label: '1–20 / 23' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly control3ShowMore = new Button(this.page, { label: '3 Show more' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ProjectTaskPage', expectedUrl: '/#ProjectTask', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to ProjectTaskCreatePage. */
  async goToCreateTask(): Promise<void> {
    await this.createTask.click();
    await this.page.waitForURL(url => url.href.includes('/#ProjectTask/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
