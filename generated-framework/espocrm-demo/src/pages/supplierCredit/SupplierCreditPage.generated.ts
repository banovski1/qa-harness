// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class SupplierCreditPageGenerated extends BasePage {
  readonly path = '/#SupplierCredit';
  readonly heading = 'Bill Credits';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in SupplierCreditPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
