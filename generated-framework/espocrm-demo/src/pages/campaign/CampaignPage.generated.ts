// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class CampaignPageGenerated extends BasePage {
  readonly path = '/#Campaign';
  readonly heading = 'Campaigns';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CampaignPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly campaigns = new RecordTable(this.page, 'campaigns', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Type","Status","Start Date"], keyColumn: 'Name', screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
