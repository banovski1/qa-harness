// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class TagPageGenerated extends BasePage {
  readonly path = '/tag/{tag}';
  readonly heading = 'Introduction to Machine Learning for Developers';

  // 1 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in TagPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly angularFrontend = new Link(this.page, { label: 'Angular frontend' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly realworld = new Link(this.page, { label: 'Realworld' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly globalFeed = new Link(this.page, { label: 'Global Feed' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly sarahchen = new Link(this.page, { label: 'sarahchen' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly control1 = new Button(this.page, { label: '1' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly introductionToMachineLearningForDevelopersGettingStartedWithMLConceptsAndPracticalApplicationsForSoftwareDevelopersReadMoreAiDatascienceMachinelearningPython = new Link(this.page, { label: 'Introduction to Machine Learning for DevelopersGetting started with ML concepts and practical applications for software developersRead more... ai datascience machinelearning python' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly control12 = new Button(this.page, { label: '1' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly ai = new Link(this.page, { label: 'ai' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly api = new Link(this.page, { label: 'api' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly architecture = new Link(this.page, { label: 'architecture' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly backend = new Link(this.page, { label: 'backend' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly beginners = new Link(this.page, { label: 'beginners' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly datascience = new Link(this.page, { label: 'datascience' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly frontend = new Link(this.page, { label: 'frontend' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly hooks = new Link(this.page, { label: 'hooks' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly javascript = new Link(this.page, { label: 'javascript' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly machinelearning = new Link(this.page, { label: 'machinelearning' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly nodejs = new Link(this.page, { label: 'nodejs' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly programming = new Link(this.page, { label: 'programming' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly python = new Link(this.page, { label: 'python' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly react = new Link(this.page, { label: 'react' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly webdev = new Link(this.page, { label: 'webdev' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly conduit = new Link(this.page, { label: 'Conduit' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });
  readonly realWorldOSSProject = new Link(this.page, { label: 'RealWorld OSS Project' }, { screen: 'TagPage', expectedUrl: '/tag/{tag}', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
