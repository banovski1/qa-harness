// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import { test as base } from '@playwright/test';
import { Api } from '../api/resources.generated.ts';
import { Preconditions } from '../api/preconditions.generated.ts';

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
