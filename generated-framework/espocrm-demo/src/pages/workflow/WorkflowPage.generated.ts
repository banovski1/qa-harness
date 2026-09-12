// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class WorkflowPageGenerated extends BasePage {
  readonly path = '/#Workflow';
  readonly heading = 'Workflows';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in WorkflowPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'WorkflowPage', expectedUrl: '/#Workflow', modelPath: MODEL_PATH });
  readonly createRule = new Link(this.page, { label: 'Create Rule' }, { screen: 'WorkflowPage', expectedUrl: '/#Workflow', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'WorkflowPage', expectedUrl: '/#Workflow', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'WorkflowPage', expectedUrl: '/#Workflow', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'WorkflowPage', expectedUrl: '/#Workflow', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'WorkflowPage', expectedUrl: '/#Workflow', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
