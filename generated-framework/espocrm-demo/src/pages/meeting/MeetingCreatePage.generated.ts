// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class MeetingCreatePageGenerated extends BasePage {
  readonly path = '/#Meeting/create';
  readonly heading = 'Meetingscreate';

  // 27 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in MeetingCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly name = new TextField(this.page, { label: 'Name *', via: 'proximity' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly dateStart = new TextField(this.page, { field: 'dateStart' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly dateStartTime = new TextField(this.page, { field: 'dateStart-time' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly dateEnd = new TextField(this.page, { field: 'dateEnd' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly dateEndTime = new TextField(this.page, { field: 'dateEnd-time' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly description = new TextField(this.page, { label: 'Description', via: 'proximity' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'MeetingCreatePage', expectedUrl: '/#Meeting/create', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
