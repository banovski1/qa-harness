// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, TextField } from '../../components/index.ts';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';
  readonly heading = null;

  // The crawl never reached this route — everything here comes from a recording.
  // The controls resolved when a human used them; nothing has proved them unique.
  readonly username = new TextField(this.page, { label: 'Username' }, { screen: 'LoginPage', expectedUrl: '/web/index.php/auth/login', modelPath: MODEL_PATH });
  readonly password = new TextField(this.page, { label: 'Password' }, { screen: 'LoginPage', expectedUrl: '/web/index.php/auth/login', modelPath: MODEL_PATH });
  readonly login = new Button(this.page, { label: 'Login' }, { screen: 'LoginPage', expectedUrl: '/web/index.php/auth/login', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
