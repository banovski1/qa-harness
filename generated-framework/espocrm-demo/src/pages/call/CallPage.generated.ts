// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class CallPageGenerated extends BasePage {
  readonly path = '/#Call';
  readonly heading = 'Calls';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CallPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly calls = new RecordTable(this.page, 'calls', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","Parent","Date Start","Assigned User"], keyColumn: 'Name', screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly createCall = new Link(this.page, { label: 'Create Call' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly control12036 = new Button(this.page, { label: '1–20 / 36' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly control16ShowMore = new Button(this.page, { label: '16 Show more' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CallPage', expectedUrl: '/#Call', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to CallCreatePage. */
  async goToCreateCall(): Promise<void> {
    await this.createCall.click();
    await this.page.waitForURL(url => url.href.includes('/#Call/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
