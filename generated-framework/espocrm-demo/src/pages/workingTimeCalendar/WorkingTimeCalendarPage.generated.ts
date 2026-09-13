// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Link } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';
import { RecordTable } from '../../components/RecordTable.ts';
import { TABLE_SHAPE } from '../../components/locator-templates.generated.ts';

export class WorkingTimeCalendarPageGenerated extends BasePage {
  readonly path = '/#WorkingTimeCalendar';
  readonly heading = 'Working Time Calendars';

  // 6 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in WorkingTimeCalendarPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'WorkingTimeCalendarPage', expectedUrl: '/#WorkingTimeCalendar', modelPath: MODEL_PATH });
  readonly workingTimeCalendars = new RecordTable(this.page, 'workingTimeCalendars', { shape: TABLE_SHAPE, columns: ["Select All Results","Name","Time Zone","Is Default"], keyColumn: 'Name', screen: 'WorkingTimeCalendarPage', expectedUrl: '/#WorkingTimeCalendar', modelPath: MODEL_PATH });
  readonly createCalendar = new Link(this.page, { label: 'Create Calendar' }, { screen: 'WorkingTimeCalendarPage', expectedUrl: '/#WorkingTimeCalendar', modelPath: MODEL_PATH });
  readonly exceptions = new Link(this.page, { label: 'Exceptions' }, { screen: 'WorkingTimeCalendarPage', expectedUrl: '/#WorkingTimeCalendar', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'WorkingTimeCalendarPage', expectedUrl: '/#WorkingTimeCalendar', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
