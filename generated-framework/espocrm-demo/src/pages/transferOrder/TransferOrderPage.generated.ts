// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class TransferOrderPageGenerated extends BasePage {
  readonly path = '/#TransferOrder';
  readonly heading = 'Transfer Orders';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in TransferOrderPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly transferOrders = new RecordTable(this.page, 'transferOrders', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","From Warehouse","To Warehouse","Date Ordered"], keyColumn: 'Name', screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'TransferOrderPage', expectedUrl: '/#TransferOrder', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
