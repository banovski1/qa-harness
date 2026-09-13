// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class KnowledgeBaseArticlePageGenerated extends BasePage {
  readonly path = '/#KnowledgeBaseArticle';
  readonly heading = 'Knowledge Base';

  // 13 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in KnowledgeBaseArticlePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });
  readonly createArticle = new Button(this.page, { label: 'Create Article' }, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });
  readonly topLevel = new Link(this.page, { label: 'Top Level' }, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });
  readonly collapsed = new Button(this.page, { label: 'Collapsed' }, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'KnowledgeBaseArticlePage', expectedUrl: '/#KnowledgeBaseArticle', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
