// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/analysis.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ArticlePageGenerated extends BasePage {
  readonly path = '/article/{slug}';
  readonly heading = 'Building Scalable APIs with Node.js';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ArticlePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly mikewilson = new Link(this.page, { label: 'mikewilson', within: 'Building Scalable APIs with Node.js' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly followMikewilson = new Button(this.page, { label: 'Follow mikewilson', within: 'Building Scalable APIs with Node.js' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly favoriteArticle1 = new Button(this.page, { label: 'Favorite Article (1)', within: 'Building Scalable APIs with Node.js' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly mikewilson2 = new Link(this.page, { label: 'mikewilson', within: 'Database Optimization' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly followMikewilson2 = new Button(this.page, { label: 'Follow mikewilson', within: 'Database Optimization' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly favoriteArticle12 = new Button(this.page, { label: 'Favorite Article (1)', within: 'Database Optimization' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly signUp = new Link(this.page, { label: 'sign up' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly janesmith = new Link(this.page, { label: 'janesmith' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly johndoe = new Link(this.page, { label: 'johndoe' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });
  readonly realWorldOSSProject = new Link(this.page, { label: 'RealWorld OSS Project' }, { screen: 'ArticlePage', expectedUrl: '/article/{slug}', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to RegisterPage. */
  async goToSignUp(): Promise<void> {
    await this.signUp.click();
    await this.page.waitForURL(url => url.href.includes('/register'));
  }

  constructor(page: Page) {
    super(page);
  }
}
