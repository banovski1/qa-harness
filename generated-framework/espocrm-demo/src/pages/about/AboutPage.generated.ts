// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class AboutPageGenerated extends BasePage {
  readonly path = '/#About';
  readonly heading = 'About';

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in AboutPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'AboutPage', expectedUrl: '/#About', modelPath: MODEL_PATH });
  readonly wwwEspocrmCom = new Link(this.page, { label: 'www.espocrm.com' }, { screen: 'AboutPage', expectedUrl: '/#About', modelPath: MODEL_PATH });
  readonly httpsWwwGnuOrgLicenses = new Link(this.page, { label: 'https://www.gnu.org/licenses/' }, { screen: 'AboutPage', expectedUrl: '/#About', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'AboutPage', expectedUrl: '/#About', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
