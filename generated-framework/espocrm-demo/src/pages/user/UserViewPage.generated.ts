// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class UserViewPageGenerated extends BasePage {
  readonly path = '/#User/view/{id}';
  readonly heading = 'UsersJack Adams';

  // 12 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in UserViewPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly users = new Link(this.page, { label: 'Users' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
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
  readonly jackAdams = new Link(this.page, { label: 'Jack Adams' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly correctDiscountAmount = new Link(this.page, { label: 'Correct Discount Amount' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly control0629 = new Link(this.page, { label: '06:29' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly jackAdams2 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly prepareProductPresentation = new Link(this.page, { label: 'Prepare product presentation' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly control06292 = new Link(this.page, { label: '06:29' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly jackAdams3 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly pT00001 = new Link(this.page, { label: 'PT-00001' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly intelacard = new Link(this.page, { label: 'Intelacard' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly control0600 = new Link(this.page, { label: '06:00' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly jackAdams4 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly pR00001 = new Link(this.page, { label: 'PR-00001' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly intelacard2 = new Link(this.page, { label: 'Intelacard' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly control06002 = new Link(this.page, { label: '06:00' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly jackAdams5 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly i00018 = new Link(this.page, { label: 'I-00018' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly intelacard3 = new Link(this.page, { label: 'Intelacard' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly control06003 = new Link(this.page, { label: '06:00' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly showMore = new Button(this.page, { label: 'Show more' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly showMore2 = new Button(this.page, { label: 'Show more' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'UserViewPage', expectedUrl: '/#User/view/{id}', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to CalendarPage. */
  async goToCalendar(): Promise<void> {
    await this.calendar.click();
    await this.page.waitForURL(url => url.href.includes('/#Calendar'));
  }

  /** Proved by the crawl: this control leads to UserPage. */
  async goToUsers(): Promise<void> {
    await this.users.click();
    await this.page.waitForURL(url => url.href.includes('/#User'));
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
