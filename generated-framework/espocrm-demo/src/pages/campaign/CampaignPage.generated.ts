// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class CampaignPageGenerated extends BasePage {
  readonly path = '/#Campaign';
  readonly heading = 'Campaigns';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CampaignPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly campaigns = new RecordTable(this.page, 'campaigns', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Type","Status","Start Date"], keyColumn: 'Name', screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly createCampaign = new Link(this.page, { label: 'Create Campaign' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly targetLists = new Link(this.page, { label: 'Target Lists' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly control122 = new Button(this.page, { label: '1–2 / 2' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CampaignPage', expectedUrl: '/#Campaign', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to TargetListPage. */
  async goToTargetLists(): Promise<void> {
    await this.targetLists.click();
    await this.page.waitForURL(url => url.href.includes('/#TargetList'));
  }

  constructor(page: Page) {
    super(page);
  }
}
