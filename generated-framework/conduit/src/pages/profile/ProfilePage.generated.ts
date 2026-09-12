// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ProfilePageGenerated extends BasePage {
  readonly path = '/profile/{username}';
  readonly heading = 'React Hooks: Best Practices and Common Pitfalls';

  // 1 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ProfilePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly followJanesmith = new Button(this.page, { label: 'Follow janesmith' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly myPosts = new Link(this.page, { label: 'My Posts' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly favoritedPosts = new Link(this.page, { label: 'Favorited Posts' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly janesmith = new Link(this.page, { label: 'janesmith' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly control2 = new Button(this.page, { label: '2' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly reactHooksBestPracticesAndCommonPitfallsEssentialPatternsAndAntiPatternsWhenWorkingWithReactHooksReadMoreFrontendHooksJavascriptReact = new Link(this.page, { label: 'React Hooks: Best Practices and Common PitfallsEssential patterns and anti-patterns when working with React HooksRead more... frontend hooks javascript react' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly control1 = new Button(this.page, { label: '1' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly conduit = new Link(this.page, { label: 'Conduit' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });
  readonly realWorldOSSProject = new Link(this.page, { label: 'RealWorld OSS Project' }, { screen: 'ProfilePage', expectedUrl: '/profile/{username}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
