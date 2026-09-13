// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class LoginPageGenerated extends BasePage {
  readonly path = '/login';
  readonly heading = 'Sign in';

  // 1 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in LoginPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'LoginPage', expectedUrl: '/login', modelPath: MODEL_PATH });
  readonly needAnAccount = new Link(this.page, { label: 'Need an account?' }, { screen: 'LoginPage', expectedUrl: '/login', modelPath: MODEL_PATH });
  readonly email = new TextField(this.page, { label: 'Email' }, { screen: 'LoginPage', expectedUrl: '/login', modelPath: MODEL_PATH });
  readonly password = new TextField(this.page, { label: 'Password' }, { screen: 'LoginPage', expectedUrl: '/login', modelPath: MODEL_PATH });
  readonly signIn = new Button(this.page, { label: 'Sign in' }, { screen: 'LoginPage', expectedUrl: '/login', modelPath: MODEL_PATH });
  readonly realWorldOSSProject = new Link(this.page, { label: 'RealWorld OSS Project' }, { screen: 'LoginPage', expectedUrl: '/login', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to RegisterPage. */
  async goToNeedAnAccount(): Promise<void> {
    await this.needAnAccount.click();
    await this.page.waitForURL(url => url.href.includes('/register'));
  }

  constructor(page: Page) {
    super(page);
  }
}
