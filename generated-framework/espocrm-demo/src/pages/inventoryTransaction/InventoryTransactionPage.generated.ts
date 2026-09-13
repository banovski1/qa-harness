// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class InventoryTransactionPageGenerated extends BasePage {
  readonly path = '/#InventoryTransaction';
  readonly heading = 'Inventory Transactions';

  // 8 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in InventoryTransactionPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });
  readonly inventoryTransactions = new RecordTable(this.page, 'inventoryTransactions', { shape: TABLE_SHAPE, columns: ["Select All Results","Number","Product","Quantity","Parent","Type","Warehouse","Created At"], keyColumn: 'Number', screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });
  readonly createTransaction = new Link(this.page, { label: 'Create Transaction' }, { screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });
  readonly control91ShowMore = new Button(this.page, { label: '91 Show more' }, { screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'InventoryTransactionPage', expectedUrl: '/#InventoryTransaction', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
