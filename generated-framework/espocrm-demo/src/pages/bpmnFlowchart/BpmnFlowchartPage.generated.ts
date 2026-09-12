// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class BpmnFlowchartPageGenerated extends BasePage {
  readonly path = '/#BpmnFlowchart';
  readonly heading = 'Flowcharts';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in BpmnFlowchartPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'BpmnFlowchartPage', expectedUrl: '/#BpmnFlowchart', modelPath: MODEL_PATH });
  readonly createFlowchart = new Link(this.page, { label: 'Create Flowchart' }, { screen: 'BpmnFlowchartPage', expectedUrl: '/#BpmnFlowchart', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'BpmnFlowchartPage', expectedUrl: '/#BpmnFlowchart', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'BpmnFlowchartPage', expectedUrl: '/#BpmnFlowchart', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'BpmnFlowchartPage', expectedUrl: '/#BpmnFlowchart', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'BpmnFlowchartPage', expectedUrl: '/#BpmnFlowchart', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
