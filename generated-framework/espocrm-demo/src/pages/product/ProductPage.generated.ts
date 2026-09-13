// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';
import { Button, Link, TextField } from '../../components/fields.ts';
import { NavigationBar } from '../../components/NavigationBar.generated.ts';

export class ProductPageGenerated extends BasePage {
  readonly path = '/#Product';
  readonly heading = 'Products';

  // 7 element(s) on this screen carry no label, role name or field
  // identifier, so nothing here addresses them. Record the flow that uses one and add
  // a scoped accessor in ProductPage.ts.
  readonly navigation = new NavigationBar(this.page, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly createProduct = new Button(this.page, { label: 'Create Product' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly textFilter = new TextField(this.page, { field: 'textFilter' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly search = new Button(this.page, { label: 'Search' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly electronics = new Link(this.page, { label: 'Electronics' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly accessories = new Link(this.page, { label: 'Accessories' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly services = new Link(this.page, { label: 'Services' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly subscriptions = new Link(this.page, { label: 'Subscriptions' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });
  readonly espoCRMInc = new Link(this.page, { label: 'EspoCRM, Inc.' }, { screen: 'ProductPage', expectedUrl: '/#Product', modelPath: MODEL_PATH });



  constructor(page: Page) {
    super(page);
  }
}
