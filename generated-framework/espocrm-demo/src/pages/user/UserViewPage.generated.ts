// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class UserViewPageGenerated extends BasePage {
  readonly path = '/#User/view/{id}';
  readonly heading = 'UsersJack Adams';

  // 30 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in UserViewPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly externalAccounts = new Link(this.page, { label: 'External Accounts' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly calendar = new Link(this.page, { label: 'Calendar' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly edit = new Button(this.page, { label: 'Edit' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly access = new Button(this.page, { label: 'Access' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly userName = new Button(this.page, { label: 'User Name' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly isActive = new Button(this.page, { label: 'Is Active' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly teams = new Button(this.page, { label: 'Teams' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly sales = new Link(this.page, { label: 'Sales' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly defaultTeam = new Button(this.page, { label: 'Default Team' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly roles = new Button(this.page, { label: 'Roles' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly layoutSet = new Button(this.page, { label: 'Layout Set' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly writeAMessageOnYourStream = new TextField(this.page, { label: 'Write a message on your stream' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly pT00001 = new Link(this.page, { label: 'PT-00001' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly pR00001 = new Link(this.page, { label: 'PR-00001' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly i00018 = new Link(this.page, { label: 'I-00018' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly dO00004 = new Link(this.page, { label: 'DO-00004' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly sO00015 = new Link(this.page, { label: 'SO-00015' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to CalendarPage. */
  async goToCalendar(): Promise<void> {
    await this.calendar.click();
    await this.page.waitForURL(url => url.href.includes('/#Calendar'));
  }

  /** Proved by the crawl: this control leads to TeamPage. */
  async goToTeams(): Promise<void> {
    await this.teams.click();
    await this.page.waitForURL(url => url.href.includes('/#Team'));
  }

  constructor(page: Page) {
    super(page);
  }
}
