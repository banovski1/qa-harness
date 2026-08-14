import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

const baseURL = process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Deliberately conservative. A test suite is only as parallel as the app under
  // test can serve; oversubscribing a slow environment produces timeouts that
  // look like product bugs. Raise it once you know the app keeps up.
  workers: process.env.CI ? 4 : 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  globalSetup: './src/fixtures/global-setup.ts',
  use: {
    baseURL,
    storageState: '.auth/state.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
