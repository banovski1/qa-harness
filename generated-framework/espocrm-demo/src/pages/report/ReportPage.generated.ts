// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ReportPageGenerated extends BasePage {
  readonly path = '/#Report';
  readonly heading = 'Reports';

  // 7 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ReportPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly reports = new RecordTable(this.page, 'reports', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Entity Type","Type"], keyColumn: 'Name', screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly createReport = new Button(this.page, { label: 'Create Report' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly examples = new Link(this.page, { label: 'Examples' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly duplicates = new Link(this.page, { label: 'Duplicates' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly salesPurchase = new Link(this.page, { label: 'Sales & Purchase' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly control199 = new Button(this.page, { label: '1–9 / 9' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ReportPage', expectedUrl: '/#Report', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
