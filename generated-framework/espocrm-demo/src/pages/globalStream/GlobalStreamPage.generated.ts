// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class GlobalStreamPageGenerated extends BasePage {
  readonly path = '/#GlobalStream';
  readonly heading = 'Global Stream';

  // 24 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in GlobalStreamPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly espoCRMDemo = new RecordTable(this.page, 'espoCRMDemo', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly espoCRMDemo2 = new RecordTable(this.page, 'espoCRMDemo2', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly espoCRMDemo3 = new RecordTable(this.page, 'espoCRMDemo3', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly espoCRMDemo4 = new RecordTable(this.page, 'espoCRMDemo4', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly correctDiscountAmount = new Link(this.page, { label: 'Correct Discount Amount' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control0629 = new Link(this.page, { label: '06:29' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams2 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly prepareProductPresentation = new Link(this.page, { label: 'Prepare product presentation' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06292 = new Link(this.page, { label: '06:29' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams3 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly pT00001 = new Link(this.page, { label: 'PT-00001' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly intelacard = new Link(this.page, { label: 'Intelacard' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control0600 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams4 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly pR00001 = new Link(this.page, { label: 'PR-00001' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly intelacard2 = new Link(this.page, { label: 'Intelacard' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06002 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams5 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly i00018 = new Link(this.page, { label: 'I-00018' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly intelacard3 = new Link(this.page, { label: 'Intelacard' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06003 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams6 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly dO00004 = new Link(this.page, { label: 'DO-00004' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly intelacard4 = new Link(this.page, { label: 'Intelacard' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06004 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams7 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly sO00015 = new Link(this.page, { label: 'SO-00015' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly intelacard5 = new Link(this.page, { label: 'Intelacard' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06005 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams8 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly q00018 = new Link(this.page, { label: 'Q-00018' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly intelacard6 = new Link(this.page, { label: 'Intelacard' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06006 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams9 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly rootURLIsNotUpdated = new Link(this.page, { label: 'Root URL is not updated' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06007 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams10 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly rootURLIsNotUpdated2 = new Link(this.page, { label: 'Root URL is not updated' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06008 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams11 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly labelIsNotTranslated = new Link(this.page, { label: 'Label is not translated' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance2 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control06009 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams12 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly labelIsNotTranslated2 = new Link(this.page, { label: 'Label is not translated' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060010 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams13 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly cathyBush = new Link(this.page, { label: 'Cathy Bush' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance3 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060011 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams14 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly adamPowers = new Link(this.page, { label: 'Adam Powers' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance4 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060012 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams15 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly emilyShelter = new Link(this.page, { label: 'Emily Shelter' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance5 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060013 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams16 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly benSmith = new Link(this.page, { label: 'Ben Smith' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance6 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060014 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams17 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams18 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance7 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060015 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams19 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly qualityAssurance8 = new Link(this.page, { label: 'Quality Assurance' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060016 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams20 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly refactorACLFramework = new Link(this.page, { label: 'Refactor ACL framework' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly points = new Button(this.page, { label: 'Points' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060017 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly jackAdams21 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly roleUIImprovement = new Link(this.page, { label: 'Role UI improvement' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly points2 = new Button(this.page, { label: 'Points' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly control060018 = new Link(this.page, { label: '06:00' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly showMore = new Button(this.page, { label: 'Show more' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'GlobalStreamPage', expectedUrl: '/#GlobalStream', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
