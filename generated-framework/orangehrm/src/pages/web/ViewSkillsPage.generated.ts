// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';

export class ViewSkillsPageGenerated extends BasePage {
  readonly path = '/web/index.php/admin/viewSkills';
  readonly heading = null;

  // This route is declared in the app's source but the crawl never reached it, so
  // it has a URL and nothing else. Crawl the screen to fill it in.




  constructor(page: Page) {
    super(page);
  }
}
