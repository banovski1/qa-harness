// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

// Logs in once per run and saves the session, so no spec pays for a login.
// The steps come from analysis/espocrm-demo/app-profile.yaml; credentials never do.
import { test as setup, expect } from '@playwright/test';
setup('authenticate', async ({ page }) => {
  await page.goto('https://demo.eu.espocrm.com/?l=en_GB');
  await page.locator('#field-userName').selectOption('admin');
  await page.locator('#btn-login').click();
  await expect(page.locator('a[href=\'#Contact\']').first()).toBeVisible({ timeout: 30_000 });
  await page.context().storageState({ path: '.auth/user.json' });
});