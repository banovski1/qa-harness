// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class CasePageGenerated extends BasePage {
  readonly path = '/#Case';
  readonly heading = 'Cases';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CasePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly cases = new RecordTable(this.page, 'cases', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Number","Status","Priority","Account","Assigned User"], keyColumn: 'Name', screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly createCase = new Link(this.page, { label: 'Create Case' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly control11111 = new Button(this.page, { label: '1–11 / 11' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CasePage', expectedUrl: '/#Case', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to CaseCreatePage. */
  async goToCreateCase(): Promise<void> {
    await this.createCase.click();
    await this.page.waitForURL(url => url.href.includes('/#Case/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
