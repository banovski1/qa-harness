// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class PaymentEntryPageGenerated extends BasePage {
  readonly path = '/#PaymentEntry';
  readonly heading = 'Payments';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in PaymentEntryPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly payments = new RecordTable(this.page, 'payments', { shape: TABLE_SHAPE, columns: ["Select All Results","Number","Type","Status","Account","Date Paid","Amount"], keyColumn: 'Number', screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly createPayment = new Link(this.page, { label: 'Create Payment' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly control111 = new Button(this.page, { label: '1–1 / 1' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'PaymentEntryPage', expectedUrl: '/#PaymentEntry', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
