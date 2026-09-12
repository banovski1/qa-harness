// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class PaymentRequestPageGenerated extends BasePage {
  readonly path = '/#PaymentRequest';
  readonly heading = 'Payment Requests';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in PaymentRequestPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly paymentRequests = new RecordTable(this.page, 'paymentRequests', { shape: TABLE_SHAPE, columns: ["Select All Results","Number","Status","Account","Method","Amount"], keyColumn: 'Number', screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly createPaymentRequest = new Link(this.page, { label: 'Create Payment Request' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly control111 = new Button(this.page, { label: '1–1 / 1' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'PaymentRequestPage', expectedUrl: '/#PaymentRequest', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
