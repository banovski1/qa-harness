// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import type { Page } from '@playwright/test';
import { BasePage } from '../BasePage.ts';
import { MODEL_PATH } from '../../config/constants.ts';

export class CandidateIdPage extends BasePage {
  readonly path = '/web/index.php/recruitment/viewCandidateAttachment/candidateId/{candidateId}';
  readonly heading = null;

  // This route is declared in the app's source but the crawl never reached it, so
  // it has a URL and nothing else. Crawl the screen to fill it in.




  constructor(page: Page) {
    super(page);
  }

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
