// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class HomePageGenerated extends BasePage {
  readonly path = '/';
  readonly heading = 'How to Learn JavaScript Efficiently';

  // 4 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in HomePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly angularFrontend = new Link(this.page, { label: 'Angular frontend' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly realworld = new Link(this.page, { label: 'Realworld' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly globalFeed = new Link(this.page, { label: 'Global Feed' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly johndoe = new Link(this.page, { label: 'johndoe' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control2 = new Button(this.page, { label: '2' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly howToLearnJavaScriptEfficientlyAComprehensiveGuideToMasteringJavaScriptFromBeginnerToAdvancedLevelReadMoreBeginnersJavascriptProgrammingWebdev = new Link(this.page, { label: 'How to Learn JavaScript EfficientlyA comprehensive guide to mastering JavaScript from beginner to advanced levelRead more... beginners javascript programming webdev' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly janesmith = new Link(this.page, { label: 'janesmith' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control22 = new Button(this.page, { label: '2' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly reactHooksBestPracticesAndCommonPitfallsEssentialPatternsAndAntiPatternsWhenWorkingWithReactHooksReadMoreFrontendHooksJavascriptReact = new Link(this.page, { label: 'React Hooks: Best Practices and Common PitfallsEssential patterns and anti-patterns when working with React HooksRead more... frontend hooks javascript react' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly mikewilson = new Link(this.page, { label: 'mikewilson' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control1 = new Button(this.page, { label: '1' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly buildingScalableAPIsWithNodeJsArchitecturalPatternsAndBestPracticesForCreatingRobustBackendServicesReadMoreApiArchitectureBackendNodejs = new Link(this.page, { label: 'Building Scalable APIs with Node.jsArchitectural patterns and best practices for creating robust backend servicesRead more... api architecture backend nodejs' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly sarahchen = new Link(this.page, { label: 'sarahchen' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control12 = new Button(this.page, { label: '1' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly introductionToMachineLearningForDevelopersGettingStartedWithMLConceptsAndPracticalApplicationsForSoftwareDevelopersReadMoreAiDatascienceMachinelearningPython = new Link(this.page, { label: 'Introduction to Machine Learning for DevelopersGetting started with ML concepts and practical applications for software developersRead more... ai datascience machinelearning python' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control13 = new Button(this.page, { label: '1' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly ai = new Link(this.page, { label: 'ai' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly api = new Link(this.page, { label: 'api' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly architecture = new Link(this.page, { label: 'architecture' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly backend = new Link(this.page, { label: 'backend' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly beginners = new Link(this.page, { label: 'beginners' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly datascience = new Link(this.page, { label: 'datascience' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly frontend = new Link(this.page, { label: 'frontend' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly hooks = new Link(this.page, { label: 'hooks' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly javascript = new Link(this.page, { label: 'javascript' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly machinelearning = new Link(this.page, { label: 'machinelearning' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly nodejs = new Link(this.page, { label: 'nodejs' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly programming = new Link(this.page, { label: 'programming' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly python = new Link(this.page, { label: 'python' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly react = new Link(this.page, { label: 'react' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly webdev = new Link(this.page, { label: 'webdev' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly conduit = new Link(this.page, { label: 'Conduit' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly realWorldOSSProject = new Link(this.page, { label: 'RealWorld OSS Project' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
