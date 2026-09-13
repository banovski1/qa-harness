// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class RegisterPageGenerated extends BasePage {
  readonly path = '/register';
  readonly heading = 'Sign up';

  // 1 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in RegisterPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });
  readonly haveAnAccount = new Link(this.page, { label: 'Have an account?' }, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });
  readonly username = new TextField(this.page, { label: 'Username' }, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });
  readonly email = new TextField(this.page, { label: 'Email' }, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });
  readonly password = new TextField(this.page, { label: 'Password' }, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });
  readonly signUp = new Button(this.page, { label: 'Sign up' }, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });
  readonly realWorldOSSProject = new Link(this.page, { label: 'RealWorld OSS Project' }, { screen: 'RegisterPage', expectedUrl: '/register', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to LoginPage. */
  async goToHaveAnAccount(): Promise<void> {
    await this.haveAnAccount.click();
    await this.page.waitForURL(url => url.href.includes('/login'));
  }

  constructor(page: Page) {
    super(page);
  }
}
