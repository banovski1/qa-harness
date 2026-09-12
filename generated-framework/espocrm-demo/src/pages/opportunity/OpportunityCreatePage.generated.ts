// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class OpportunityCreatePageGenerated extends BasePage {
  readonly path = '/#Opportunity/create';
  readonly heading = 'Opportunitiescreate';

  // 12 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in OpportunityCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly opportunities = new Link(this.page, { label: 'Opportunities' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { field: 'name' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly select = new TextField(this.page, { label: 'Select' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly amount = new TextField(this.page, { field: 'amount' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly probability = new TextField(this.page, { field: 'probability' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly closeDate = new TextField(this.page, { field: 'closeDate' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly select2 = new TextField(this.page, { label: 'Select' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly select3 = new Button(this.page, { label: 'Select' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { field: 'description' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly addItem = new Button(this.page, { label: 'Add Item' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly select4 = new TextField(this.page, { label: 'Select' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly select5 = new TextField(this.page, { label: 'Select' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly select6 = new Button(this.page, { label: 'Select' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'OpportunityCreatePage', expectedUrl: '/#Opportunity/create', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to OpportunityPage. */
  async goToOpportunities(): Promise<void> {
    await this.opportunities.click();
    await this.page.waitForURL(url => url.href.includes('/#Opportunity'));
  }

  constructor(page: Page) {
    super(page);
  }
}
