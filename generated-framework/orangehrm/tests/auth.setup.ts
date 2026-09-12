// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

// Logs in once per run and saves the session, so no spec pays for a login.
// The steps come from analysis/orangehrm/app-profile.yaml; credentials never do.
import { test as setup, expect } from '@playwright/test';
setup('authenticate', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.locator('input[name=\'username\']').fill(process.env.APP_USERNAME ?? '');
  await page.locator('input[name=\'password\']').fill(process.env.APP_PASSWORD ?? '');
  await page.locator('button[type=\'submit\']').click();
  await expect(page.locator('.oxd-topbar-header').first()).toBeVisible({ timeout: 30_000 });
  await page.context().storageState({ path: '.auth/user.json' });
});