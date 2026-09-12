// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class CalendarPageGenerated extends BasePage {
  readonly path = '/#Calendar';
  readonly heading = null;

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in CalendarPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly calendar = new RecordTable(this.page, 'calendar', { shape: TABLE_SHAPE, columns: ["37Mon 07Tue 08Wed 09Thu 10Fri 11Sat 12Sun 13","37","Mon 07","Tue 08","Wed 09","Thu 10","Fri 11","Sat 12","Sun 13"], keyColumn: '37Mon 07Tue 08Wed 09Thu 10Fri 11Sat 12Sun 13', screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly calendar2 = new RecordTable(this.page, 'calendar2', { shape: TABLE_SHAPE, columns: ["37","Mon 07","Tue 08","Wed 09","Thu 10","Fri 11","Sat 12","Sun 13"], keyColumn: '37', screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly todayTo = new Button(this.page, { label: 'TodayTo' }, { screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly monthMo = new Button(this.page, { label: 'MonthMo' }, { screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly weekWe = new Button(this.page, { label: 'WeekWe' }, { screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly timelineTi = new Button(this.page, { label: 'TimelineTi' }, { screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'CalendarPage', expectedUrl: '/#Calendar', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
