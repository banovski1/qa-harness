// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Checkbox, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class EmailCreatePageGenerated extends BasePage {
  readonly path = '/#Email/create';
  readonly heading = 'Emailscreate';

  // 19 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in EmailCreatePage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly save = new Button(this.page, { label: 'Save' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly cancel = new Button(this.page, { label: 'Cancel' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly dateSent = new TextField(this.page, { field: 'dateSent' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly dateSentTime = new TextField(this.page, { field: 'dateSent-time' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly from = new TextField(this.page, { label: 'From *', via: 'proximity' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly subject = new TextField(this.page, { label: 'Subject *', via: 'proximity' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly style = new Button(this.page, { label: 'Style' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly boldB = new Button(this.page, { label: 'Bold (⌘+B)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly italicI = new Button(this.page, { label: 'Italic (⌘+I)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly underlineU = new Button(this.page, { label: 'Underline (⌘+U)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly removeFontStyleDELETE = new Button(this.page, { label: 'Remove Font Style (⌘+DELETE)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly fontSize = new Button(this.page, { label: 'Font Size' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly recentColor = new Button(this.page, { label: 'Recent Color' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly moreColor = new Button(this.page, { label: 'More Color' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly unorderedListNUM7 = new Button(this.page, { label: 'Unordered list (⌘+⇧+NUM7)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly orderedListNUM8 = new Button(this.page, { label: 'Ordered list (⌘+⇧+NUM8)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly paragraph = new Button(this.page, { label: 'Paragraph' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly lineHeight = new Button(this.page, { label: 'Line Height' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly linkCMDK = new Button(this.page, { label: 'Link (CMD+K)' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly picture = new Button(this.page, { label: 'Picture' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly insertHorizontalRule = new Button(this.page, { label: 'Insert Horizontal Rule' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly codeView = new Button(this.page, { label: 'Code View' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly fullScreen = new Button(this.page, { label: 'Full Screen' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly attachFile = new Button(this.page, { label: 'Attach File' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly insertField = new Button(this.page, { label: 'Insert Field' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly hTML = new Checkbox(this.page, { label: 'HTML', via: 'proximity' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'EmailCreatePage', expectedUrl: '/#Email/create', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
