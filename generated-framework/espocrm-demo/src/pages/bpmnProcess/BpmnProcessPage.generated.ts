// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class BpmnProcessPageGenerated extends BasePage {
  readonly path = '/#BpmnProcess';
  readonly heading = 'Processes';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in BpmnProcessPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly startProcess = new Link(this.page, { label: 'Start Process' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly control00 = new Button(this.page, { label: '0 / 0' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
