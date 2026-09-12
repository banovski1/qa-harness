// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class TransferOrderPageGenerated extends BasePage {
  readonly path = '/#TransferOrder';
  readonly heading = 'Transfer Orders';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in TransferOrderPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly transferOrders = new RecordTable(this.page, 'transferOrders', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","From Warehouse","To Warehouse","Date Ordered"], keyColumn: 'Name', screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly createTransferOrder = new Link(this.page, { label: 'Create Transfer Order' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly control144 = new Button(this.page, { label: '1–4 / 4' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
