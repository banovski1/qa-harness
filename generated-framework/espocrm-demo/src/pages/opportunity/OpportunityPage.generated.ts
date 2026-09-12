// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class OpportunityPageGenerated extends BasePage {
  readonly path = '/#Opportunity';
  readonly heading = 'Opportunities';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in OpportunityPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly opportunities = new RecordTable(this.page, 'opportunities', { shape: TABLE_SHAPE, columns: ["Prospecting","Qualification","Proposal","Negotiation","Closed Won"], keyColumn: 'Prospecting', screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly opportunities2 = new RecordTable(this.page, 'opportunities2', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly createOpportunity = new Link(this.page, { label: 'Create Opportunity' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly list = new Button(this.page, { label: 'List' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly kanban = new Button(this.page, { label: 'Kanban' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'OpportunityPage', expectedUrl: '/#Opportunity', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to OpportunityCreatePage. */
  async goToCreateOpportunity(): Promise<void> {
    await this.createOpportunity.click();
    await this.page.waitForURL(url => url.href.includes('/#Opportunity/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
