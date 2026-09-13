// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class SupplierPageGenerated extends BasePage {
  readonly path = '/#Supplier';
  readonly heading = 'Suppliers';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in SupplierPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'SupplierPage', expectedUrl: '/#Supplier', modelPath: MODEL_PATH });
  readonly suppliers = new RecordTable(this.page, 'suppliers', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Account","Status"], keyColumn: 'Name', screen: 'SupplierPage', expectedUrl: '/#Supplier', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'SupplierPage', expectedUrl: '/#Supplier', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
