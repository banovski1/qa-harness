// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ProjectPageGenerated extends BasePage {
  readonly path = '/#Project';
  readonly heading = 'Projects';

  // 11 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ProjectPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });
  readonly projects = new RecordTable(this.page, 'projects', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","Date Start","Date End"], keyColumn: 'Name', screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });
  readonly createProject = new Link(this.page, { label: 'Create Project' }, { screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });
  readonly marketing = new Link(this.page, { label: 'Marketing' }, { screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ProjectPage', expectedUrl: '/#Project', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
