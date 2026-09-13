// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class PreferencesPageGenerated extends BasePage {
  readonly path = '/#Preferences';
  readonly heading = 'PreferencesJack Adams';

  // 10 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in PreferencesPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly locale = new Button(this.page, { label: 'Locale' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly general = new Button(this.page, { label: 'General' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly userInterface = new Button(this.page, { label: 'User Interface' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly thousandSeparator = new TextField(this.page, { label: 'Thousand Separator', via: 'proximity' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly decimalMark = new TextField(this.page, { label: 'Decimal Mark *', via: 'proximity' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'PreferencesPage', expectedUrl: '/#Preferences', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
