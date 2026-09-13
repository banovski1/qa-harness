// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/analysis.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class ViewCandidatesPageGenerated extends BasePage {
  readonly path = '/web/index.php/recruitment/viewCandidates';
  readonly heading = null;

  // 3 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewCandidatesPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly candidates = new RecordTable(this.page, 'candidates', { shape: TABLE_SHAPE, columns: ["VacancyAscendingDescending","CandidateAscendingDescending","Hiring ManagerAscendingDescending","Date of ApplicationAscendingDescending","StatusAscendingDescending","Actions"], keyColumn: 'VacancyAscendingDescending', screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly candidates2 = new Link(this.page, { label: 'Candidates' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly vacancies = new Link(this.page, { label: 'Vacancies' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly jobTitle = new Select(this.page, { label: 'Job Title', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly vacancy = new Select(this.page, { label: 'Vacancy', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly hiringManager = new Select(this.page, { label: 'Hiring Manager', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly status = new Select(this.page, { label: 'Status', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly candidateName = new TextField(this.page, { label: 'Candidate Name', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly keywords = new TextField(this.page, { label: 'Keywords', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly dateOfApplication = new TextField(this.page, { label: 'Date of Application', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly to = new TextField(this.page, { label: 'To' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
  readonly methodOfApplication = new Select(this.page, { label: 'Method of Application', via: 'proximity' }, { screen: 'ViewCandidatesPage', expectedUrl: '/web/index.php/recruitment/viewCandidates', modelPath: MODEL_PATH });
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
