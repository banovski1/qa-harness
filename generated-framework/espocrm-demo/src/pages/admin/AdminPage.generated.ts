// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class AdminPageGenerated extends BasePage {
  readonly path = '/#Admin';
  readonly heading = 'Administration';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in AdminPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration = new RecordTable(this.page, 'administration', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration2 = new RecordTable(this.page, 'administration2', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration3 = new RecordTable(this.page, 'administration3', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration4 = new RecordTable(this.page, 'administration4', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration5 = new RecordTable(this.page, 'administration5', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration6 = new RecordTable(this.page, 'administration6', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration7 = new RecordTable(this.page, 'administration7', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration8 = new RecordTable(this.page, 'administration8', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration9 = new RecordTable(this.page, 'administration9', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration10 = new RecordTable(this.page, 'administration10', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly administration11 = new RecordTable(this.page, 'administration11', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly search = new TextField(this.page, { label: 'Search' }, { screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'AdminPage', expectedUrl: '/#Admin', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
