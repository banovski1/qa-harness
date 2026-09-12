// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ViewBuzzPageGenerated extends BasePage {
  readonly path = '/web/index.php/buzz/viewBuzz';
  readonly heading = null;

  // 9 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ViewBuzzPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly upgrade = new Link(this.page, { label: 'Upgrade' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly upgrade2 = new Button(this.page, { label: 'Upgrade' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly whatSOnYourMind = new TextField(this.page, { label: 'What\'s on your mind?' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly post = new Button(this.page, { label: 'Post' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly sharePhotos = new Button(this.page, { label: 'Share Photos' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly shareVideo = new Button(this.page, { label: 'Share Video' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly mostRecentPosts = new Button(this.page, { label: 'Most Recent Posts' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly mostLikedPosts = new Button(this.page, { label: 'Most Liked Posts' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly mostCommentedPosts = new Button(this.page, { label: 'Most Commented Posts' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });
  readonly orangeHRMInc = new Link(this.page, { label: 'OrangeHRM, Inc' }, { screen: 'ViewBuzzPage', expectedUrl: '/web/index.php/buzz/viewBuzz', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
