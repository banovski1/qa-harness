// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class DocumentPageGenerated extends BasePage {
  readonly path = '/#Document';
  readonly heading = 'Documents';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in DocumentPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly documents = new RecordTable(this.page, 'documents', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","File","Status","Created At"], keyColumn: 'Name', screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly createDocument = new Button(this.page, { label: 'Create Document' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly topLevel = new Link(this.page, { label: 'Top Level' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly collapsed = new Button(this.page, { label: 'Collapsed' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly quotes = new Link(this.page, { label: 'Quotes' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly quotes2 = new Link(this.page, { label: 'Quotes' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly control111 = new Button(this.page, { label: '1–1 / 1' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'DocumentPage', expectedUrl: '/#Document', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to QuotePage. */
  async goToQuotes(): Promise<void> {
    await this.quotes2.click();
    await this.page.waitForURL(url => url.href.includes('/#Quote'));
  }

  constructor(page: Page) {
    super(page);
  }
}
