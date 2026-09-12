// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class HomePageGenerated extends BasePage {
  readonly path = '/';
  readonly heading = null;

  // 22 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in HomePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly espoCRMDemo = new RecordTable(this.page, 'espoCRMDemo', { shape: TABLE_SHAPE, columns: ["37Mon 07Tue 08Wed 09Thu 10Fri 11Sat 12Sun 13","37","Mon 07","Tue 08","Wed 09","Thu 10","Fri 11","Sat 12","Sun 13"], keyColumn: '37Mon 07Tue 08Wed 09Thu 10Fri 11Sat 12Sun 13', screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly espoCRMDemo2 = new RecordTable(this.page, 'espoCRMDemo2', { shape: TABLE_SHAPE, columns: ["37","Mon 07","Tue 08","Wed 09","Thu 10","Fri 11","Sat 12","Sun 13"], keyColumn: '37', screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly homepage = new Button(this.page, { label: 'Homepage' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly sales = new Button(this.page, { label: 'Sales' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly analytics = new Button(this.page, { label: 'Analytics' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly salesManager = new Button(this.page, { label: 'Sales Manager' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly callCenter = new Button(this.page, { label: 'Call Center' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly projects = new Button(this.page, { label: 'Projects' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly correctDiscountAmount = new Link(this.page, { label: 'Correct Discount Amount' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control0629 = new Link(this.page, { label: '06:29' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams2 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly prepareProductPresentation = new Link(this.page, { label: 'Prepare product presentation' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06292 = new Link(this.page, { label: '06:29' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams3 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly pT00001 = new Link(this.page, { label: 'PT-00001' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control0600 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams4 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly pR00001 = new Link(this.page, { label: 'PR-00001' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard2 = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06002 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams5 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly i00018 = new Link(this.page, { label: 'I-00018' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard3 = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06003 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams6 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly dO00004 = new Link(this.page, { label: 'DO-00004' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard4 = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06004 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams7 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly sO00015 = new Link(this.page, { label: 'SO-00015' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard5 = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06005 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams8 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly q00018 = new Link(this.page, { label: 'Q-00018' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard6 = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06006 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams9 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly rootURLIsNotUpdated = new Link(this.page, { label: 'Root URL is not updated' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06007 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly jackAdams10 = new Link(this.page, { label: 'Jack Adams' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly labelIsNotTranslated = new Link(this.page, { label: 'Label is not translated' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control06008 = new Link(this.page, { label: '06:00' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly showMore = new Button(this.page, { label: 'Show more' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly previous = new Button(this.page, { field: 'previous' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly next = new Button(this.page, { field: 'next' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly handingTheOrderToTheShippingProvider = new Link(this.page, { label: 'Handing the order to the shipping provider' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly speakersBulkPurchase = new Link(this.page, { label: 'Speakers Bulk Purchase' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly analyseSalesStats = new Link(this.page, { label: 'Analyse sales stats' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly sendWeeklyAnalyticsToTopManagement = new Link(this.page, { label: 'Send weekly analytics to top management' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control15TabletsPurchase = new Link(this.page, { label: '15 Tablets Purchase' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly salesPlan = new Link(this.page, { label: 'Sales Plan' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly sendSalesOrderDraftToABeike = new Link(this.page, { label: 'Send sales order draft to A.Beike' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly intelacard7 = new Link(this.page, { label: 'Intelacard' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly prepareAnnualRevenueReportForInvestors = new Link(this.page, { label: 'Prepare annual revenue report for investors' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly bradleyWyatt = new Link(this.page, { label: 'Bradley Wyatt' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly discountDiscussionWithMrBrenson = new Link(this.page, { label: 'Discount discussion with Mr. Brenson' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly easyReservations = new Link(this.page, { label: 'EasyReservations' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly discussPlans = new Link(this.page, { label: 'Discuss plans' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly waterfallProject = new Link(this.page, { label: 'Waterfall Project' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly control7ShowMore = new Button(this.page, { label: '7 Show more' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly askingForCompensation = new Link(this.page, { label: 'Asking for compensation' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly winSPrivateHospital = new Link(this.page, { label: 'Win\'s Private Hospital' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly discountIssue = new Link(this.page, { label: 'Discount Issue' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly prospaPalnesBank = new Link(this.page, { label: 'Prospa-Palnes Bank' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly deliveryStatusCheck = new Link(this.page, { label: 'Delivery Status Check' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly irvingSSportGoods = new Link(this.page, { label: 'Irving\'s Sport Goods' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly productSupportQuestion = new Link(this.page, { label: 'Product Support Question' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly nationalLumber = new Link(this.page, { label: 'National Lumber' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly returnRequest = new Link(this.page, { label: 'Return Request' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly easyReservations2 = new Link(this.page, { label: 'EasyReservations' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly warrantyCoverageQuestion = new Link(this.page, { label: 'Warranty Coverage Question' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly janeville = new Link(this.page, { label: 'Janeville' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'HomePage', expectedUrl: '/', modelPath: MODEL_PATH });

  /** Proved by the crawl: this control leads to ProjectPage. */
  async goToProjects(): Promise<void> {
    await this.projects.click();
    await this.page.waitForURL(url => url.href.includes('/#Project'));
  }

  constructor(page: Page) {
    super(page);
  }
}
