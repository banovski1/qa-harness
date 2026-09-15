// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { test as base } from '@playwright/test';
import { Api } from '../api/Api.ts';
import { Preconditions } from '../api/Preconditions.ts';
import { authenticate } from '../support/authenticate.ts';

export const test = base.extend<{ api: Api; given: Preconditions }>({
  api: async ({ playwright, baseURL }, use) => {
    // A context of its own, deliberately anonymous at birth. Inheriting the
    // worker's `request` fixture would carry no credential: the browser's
    // storage state does not reach it, and every call would be unauthenticated.
    const request = await playwright.request.newContext({
      baseURL, storageState: { cookies: [], origins: [] },
    });
    try {
      const headers = await authenticate(request);
      await use(new Api(request, baseURL, headers));
    } finally {
      await request.dispose();
    }
  },
  // Named "given" so a spec reads as a sentence: given.employee().
  given: async ({ api }, use) => {
    const preconditions = new Preconditions(api);
    try {
      await use(preconditions);
    } finally {
      // In a finally, so a failing test still removes what it made.
      await preconditions.cleanup();
    }
  },
});

export { expect } from '@playwright/test';
