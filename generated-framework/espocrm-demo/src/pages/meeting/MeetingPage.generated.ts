// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class MeetingPageGenerated extends BasePage {
  readonly path = '/#Meeting';
  readonly heading = 'Meetings';

  // 5 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in MeetingPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly meetings = new RecordTable(this.page, 'meetings', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Status","Parent","Date Start","Assigned User"], keyColumn: 'Name', screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly createMeeting = new Link(this.page, { label: 'Create Meeting' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly control12027 = new Button(this.page, { label: '1–20 / 27' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly previousPage = new Button(this.page, { label: 'Previous Page' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly nextPage = new Button(this.page, { label: 'Next Page' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly control7ShowMore = new Button(this.page, { label: '7 Show more' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'MeetingPage', expectedUrl: '/#Meeting', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to MeetingCreatePage. */
  async goToCreateMeeting(): Promise<void> {
    await this.createMeeting.click();
    await this.page.waitForURL(url => url.href.includes('/#Meeting/create'));
  }

  constructor(page: Page) {
    super(page);
  }
}
