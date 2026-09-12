// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://demo.eu.espocrm.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    storageState: '.auth/user.json',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/, use: { storageState: undefined } },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
  ],
});