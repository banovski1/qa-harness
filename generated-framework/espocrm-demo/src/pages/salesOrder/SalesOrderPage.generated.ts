// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class SalesOrderPageGenerated extends BasePage {
  readonly path = '/#SalesOrder';
  readonly heading = 'Sales Orders';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in SalesOrderPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly salesOrders = new RecordTable(this.page, 'salesOrders', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","Account","Date Ordered","Net Total"], keyColumn: 'Name', screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly createSalesOrder = new Link(this.page, { label: 'Create Sales Order' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly control111 = new Button(this.page, { label: '1–1 / 1' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'SalesOrderPage', expectedUrl: '/#SalesOrder', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
