// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class SupplierCreditPageGenerated extends BasePage {
  readonly path = '/#SupplierCredit';
  readonly heading = 'Bill Credits';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in SupplierCreditPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly createBillCredit = new Link(this.page, { label: 'Create Bill Credit' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly control00 = new Button(this.page, { label: '0 / 0' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'SupplierCreditPage', expectedUrl: '/#SupplierCredit', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
