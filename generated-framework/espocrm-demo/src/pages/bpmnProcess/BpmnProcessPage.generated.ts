// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class BpmnProcessPageGenerated extends BasePage {
  readonly path = '/#BpmnProcess';
  readonly heading = 'Processes';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in BpmnProcessPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'BpmnProcessPage', expectedUrl: '/#BpmnProcess', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
