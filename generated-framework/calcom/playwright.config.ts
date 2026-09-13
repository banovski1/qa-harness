// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/analysis.json (b0a34f21c9)

import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://cal.com/',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Shorter than the test timeout on purpose: a component must fail while there
    // is still budget left to diagnose why, or every failure reads as TIMED_OUT.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});