import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const baseURL = process.env.BASE_URL ?? 'https://demo.eu.espocrm.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Deliberately conservative. A test suite is only as parallel as the app under
  // test can serve; oversubscribing a slow environment produces timeouts that
  // look like product bugs. Raise it once you know the app keeps up.
  workers: process.env.CI ? 4 : 2,
  forbidOnly: !!process.env.CI,
  // Retries reduce noise in CI; they do not fix a flaky test. A test that needs a
  // second attempt to pass is still broken — fix the wait, not the retry count.
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  globalSetup: './src/fixtures/global-setup.ts',
  // Web-first assertions retry until this window elapses, which is what makes
  // them safe to use in place of an explicit wait.
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    storageState: '.auth/state.json',
    // Not 'on-first-retry': retries are CI-only, so that setting records nothing
    // for the local failure you are actually trying to debug.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
