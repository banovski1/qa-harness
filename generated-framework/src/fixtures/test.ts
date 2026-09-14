// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { test as base } from '@playwright/test';
import { Api } from '../api/Api.ts';
import { Preconditions } from '../api/Preconditions.ts';

export const test = base.extend<{ api: Api; given: Preconditions }>({
  api: async ({ request }, use) => {
    await use(new Api(request));
  },
  // Named "given" so a spec reads as a sentence: given.employee().
  given: async ({ api }, use) => {
    const preconditions = new Preconditions(api);
    await use(preconditions);
    await preconditions.cleanup();
  },
});

export { expect } from '@playwright/test';
