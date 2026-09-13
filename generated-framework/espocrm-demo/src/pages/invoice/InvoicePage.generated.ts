// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class InvoicePageGenerated extends BasePage {
  readonly path = '/#Invoice';
  readonly heading = 'Invoices';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in InvoicePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'InvoicePage', expectedUrl: '/#Invoice', modelPath: MODEL_PATH });
  readonly invoices = new RecordTable(this.page, 'invoices', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","Account","Date Invoiced","Grand Total"], keyColumn: 'Name', screen: 'InvoicePage', expectedUrl: '/#Invoice', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'InvoicePage', expectedUrl: '/#Invoice', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
