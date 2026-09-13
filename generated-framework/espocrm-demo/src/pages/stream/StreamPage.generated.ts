// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class StreamPageGenerated extends BasePage {
  readonly path = '/#Stream';
  readonly heading = 'Stream';

  // 82 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in StreamPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly createPost = new Button(this.page, { label: 'Create Post' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly posts = new Button(this.page, { label: 'Posts' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly updates = new Button(this.page, { label: 'Updates' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly checkForStreamUpdates = new Button(this.page, { label: 'Check for stream updates' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly pT00001 = new Link(this.page, { label: 'PT-00001' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly pR00001 = new Link(this.page, { label: 'PR-00001' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly i00018 = new Link(this.page, { label: 'I-00018' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly dO00004 = new Link(this.page, { label: 'DO-00004' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly sO00015 = new Link(this.page, { label: 'SO-00015' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly q00018 = new Link(this.page, { label: 'Q-00018' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly rootURLIsNotUpdated = new Link(this.page, { label: 'Root URL is not updated' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly labelIsNotTranslated = new Link(this.page, { label: 'Label is not translated' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly refactorACLFramework = new Link(this.page, { label: 'Refactor ACL framework' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly roleUIImprovement = new Link(this.page, { label: 'Role UI improvement' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly themeFramework = new Link(this.page, { label: 'Theme framework' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly lightTheme = new Link(this.page, { label: 'Light theme' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly refactorStylesheets = new Link(this.page, { label: 'Refactor stylesheets' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly oIDCAuthentication = new Link(this.page, { label: 'OIDC authentication' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly teamManagement = new Link(this.page, { label: 'Team management' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly whatColorsWillBeTrendyInTheNextSeason = new Link(this.page, { label: 'What colors will be trendy in the next season' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly bulkOrder482 = new Link(this.page, { label: 'Bulk Order #482' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly callCenterEquipmentOrder = new Link(this.page, { label: 'Call Center Equipment Order' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly showMore = new Button(this.page, { label: 'Show more' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
