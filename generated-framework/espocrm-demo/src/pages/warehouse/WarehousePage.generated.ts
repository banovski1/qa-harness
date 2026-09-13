// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class WarehousePageGenerated extends BasePage {
  readonly path = '/#Warehouse';
  readonly heading = 'Warehouses';

  // 9 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in WarehousePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'WarehousePage', expectedUrl: '/#Warehouse', modelPath: MODEL_PATH });
  readonly warehouses = new RecordTable(this.page, 'warehouses', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","City","Status","Stock"], keyColumn: 'Name', screen: 'WarehousePage', expectedUrl: '/#Warehouse', modelPath: MODEL_PATH });
  readonly createWarehouse = new Link(this.page, { label: 'Create Warehouse' }, { screen: 'WarehousePage', expectedUrl: '/#Warehouse', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'WarehousePage', expectedUrl: '/#Warehouse', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'WarehousePage', expectedUrl: '/#Warehouse', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'WarehousePage', expectedUrl: '/#Warehouse', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
