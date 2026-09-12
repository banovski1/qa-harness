// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class StreamPageGenerated extends BasePage {
  readonly path = '/#Stream';
  readonly heading = 'Stream';

  // 24 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in StreamPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo = new RecordTable(this.page, 'espoCRMDemo', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo2 = new RecordTable(this.page, 'espoCRMDemo2', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo3 = new RecordTable(this.page, 'espoCRMDemo3', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo4 = new RecordTable(this.page, 'espoCRMDemo4', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo5 = new RecordTable(this.page, 'espoCRMDemo5', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo6 = new RecordTable(this.page, 'espoCRMDemo6', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo7 = new RecordTable(this.page, 'espoCRMDemo7', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo8 = new RecordTable(this.page, 'espoCRMDemo8', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo9 = new RecordTable(this.page, 'espoCRMDemo9', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo10 = new RecordTable(this.page, 'espoCRMDemo10', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMDemo11 = new RecordTable(this.page, 'espoCRMDemo11', { shape: TABLE_SHAPE, columns: [], keyColumn: null, screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly createPost = new Button(this.page, { label: 'Create Post' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly all = new Button(this.page, { label: 'All' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly posts = new Button(this.page, { label: 'Posts' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly updates = new Button(this.page, { label: 'Updates' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly checkForStreamUpdates = new Button(this.page, { label: 'Check for stream updates' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly correctDiscountAmount = new Link(this.page, { label: 'Correct Discount Amount' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control0629 = new Link(this.page, { label: '06:29' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams2 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly prepareProductPresentation = new Link(this.page, { label: 'Prepare product presentation' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06292 = new Link(this.page, { label: '06:29' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams3 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly pT00001 = new Link(this.page, { label: 'PT-00001' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly intelacard = new Link(this.page, { label: 'Intelacard' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control0600 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams4 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly pR00001 = new Link(this.page, { label: 'PR-00001' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly intelacard2 = new Link(this.page, { label: 'Intelacard' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06002 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams5 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly i00018 = new Link(this.page, { label: 'I-00018' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly intelacard3 = new Link(this.page, { label: 'Intelacard' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06003 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams6 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly dO00004 = new Link(this.page, { label: 'DO-00004' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly intelacard4 = new Link(this.page, { label: 'Intelacard' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06004 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams7 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly sO00015 = new Link(this.page, { label: 'SO-00015' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly intelacard5 = new Link(this.page, { label: 'Intelacard' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06005 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams8 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly q00018 = new Link(this.page, { label: 'Q-00018' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly intelacard6 = new Link(this.page, { label: 'Intelacard' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06006 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams9 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly rootURLIsNotUpdated = new Link(this.page, { label: 'Root URL is not updated' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06007 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams10 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly labelIsNotTranslated = new Link(this.page, { label: 'Label is not translated' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06008 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams11 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly refactorACLFramework = new Link(this.page, { label: 'Refactor ACL framework' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control06009 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams12 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly roleUIImprovement = new Link(this.page, { label: 'Role UI improvement' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points2 = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060010 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams13 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly themeFramework = new Link(this.page, { label: 'Theme framework' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points3 = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060011 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams14 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly lightTheme = new Link(this.page, { label: 'Light theme' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points4 = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060012 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams15 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly refactorStylesheets = new Link(this.page, { label: 'Refactor stylesheets' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points5 = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060013 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams16 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly oIDCAuthentication = new Link(this.page, { label: 'OIDC authentication' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points6 = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060014 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams17 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly teamManagement = new Link(this.page, { label: 'Team management' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly points7 = new Button(this.page, { label: 'Points' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060015 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams18 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly whatColorsWillBeTrendyInTheNextSeason = new Link(this.page, { label: 'What colors will be trendy in the next season' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060016 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams19 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly bulkOrder482 = new Link(this.page, { label: 'Bulk Order #482' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly amount = new Button(this.page, { label: 'Amount' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060017 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly jackAdams20 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly callCenterEquipmentOrder = new Link(this.page, { label: 'Call Center Equipment Order' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly amount2 = new Button(this.page, { label: 'Amount' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly control060018 = new Link(this.page, { label: '06:00' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly showMore = new Button(this.page, { label: 'Show more' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'StreamPage', expectedUrl: '/#Stream', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
