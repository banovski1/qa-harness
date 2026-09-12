// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewDirectoryPageGenerated extends BasePage {
  readonly path = '/web/index.php/directory/viewDirectory';
  readonly heading = null;

  // 4 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewDirectoryPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });
  readonly typeForHints = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewDirectoryPage', expectedUrl: '/web/index.php/directory/viewDirectory', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
