// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

// Logs in once per run through the API and saves the session, so no spec pays
// for a login. These are the steps verify-auth.ts proved against the running
// application, not a transcription of the login screen.
import { test as setup } from '@playwright/test';
import { authenticate } from '../src/support/authenticate.ts';
import { STORAGE_STATE } from '../src/config/constants.ts';

setup('authenticate', async ({ request }) => {
  await authenticate(request);
  await request.storageState({ path: STORAGE_STATE });
});
