// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class InventoryNumberPageGenerated extends BasePage {
  readonly path = '/#InventoryNumber';
  readonly heading = 'Inventory Numbers';

  // 9 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in InventoryNumberPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });
  readonly inventoryNumbers = new RecordTable(this.page, 'inventoryNumbers', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Product","Type","On Hand"], keyColumn: 'Name', screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });
  readonly createNumber = new Link(this.page, { label: 'Create Number' }, { screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });
  readonly control20ShowMore = new Button(this.page, { label: '20 Show more' }, { screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'InventoryNumberPage', expectedUrl: '/#InventoryNumber', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
