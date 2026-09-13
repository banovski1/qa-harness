// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/analysis.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, Select, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class SearchEvaluatePerformanceReviewPageGenerated extends BasePage {
  readonly path = '/web/index.php/performance/searchEvaluatePerformanceReview';
  readonly heading = null;

  // 2 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in SearchEvaluatePerformanceReviewPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly searchEvaluatePerformanceReview = new RecordTable(this.page, 'searchEvaluatePerformanceReview', { shape: TABLE_SHAPE, columns: ["EmployeeAscendingDescending","Job Title","Sub Unit","Review PeriodAscendingDescending","Due DateAscendingDescending","Review StatusAscendingDescending","Actions"], keyColumn: 'EmployeeAscendingDescending', screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly myTrackers = new Link(this.page, { label: 'My Trackers' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly employeeTrackers = new Link(this.page, { label: 'Employee Trackers' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly jobTitle = new Select(this.page, { label: 'Job Title', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly subUnit = new Select(this.page, { label: 'Sub Unit', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly include = new Select(this.page, { label: 'Include', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly reviewStatus = new Select(this.page, { label: 'Review Status', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly fromDate = new TextField(this.page, { label: 'From Date', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly toDate = new TextField(this.page, { label: 'To Date', via: 'proximity' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly reset = new Button(this.page, { label: 'Reset' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });
  readonly control = new Button(this.page, { label: '×' }, { screen: 'SearchEvaluatePerformanceReviewPage', expectedUrl: '/web/index.php/performance/searchEvaluatePerformanceReview', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
