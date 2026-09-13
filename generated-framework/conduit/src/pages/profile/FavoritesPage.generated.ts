// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/analysis.json (dd99ed2cf3)

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';

export class FavoritesPageGenerated extends BasePage {
  readonly path = '/profile/{username}/favorites';
  readonly heading = null;

  // This route is declared in the app's source but the crawl never reached it, so
  // it has a URL and nothing else. Crawl the screen to fill it in.




  constructor(page: Page) {
    super(page);
  }
}
