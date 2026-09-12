// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewCandidatesPageGenerated extends BasePage {
  readonly path = '/web/index.php/recruitment/viewCandidates';
  readonly heading = null;

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewCandidatesPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly candidates = new Link(this.page, { label: 'Candidates' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly vacancies = new Link(this.page, { label: 'Vacancies' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly typeForHints = new TextField(this.page, { label: 'Type for hints...' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly enterCommaSeperatedWords = new TextField(this.page, { label: 'Enter comma seperated words...' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly from = new TextField(this.page, { label: 'From' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly to = new TextField(this.page, { label: 'To' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly add = new Button(this.page, { label: 'Add' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly control1 = new Button(this.page, { label: '1' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly control2 = new Button(this.page, { label: '2' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
