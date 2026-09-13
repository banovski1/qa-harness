// UI login for a credential set that must not reuse the stored admin session
// (tests/auth.setup.ts). Mirrors that file's own, already-proven mechanism for this
// screen — the login route is declared but never crawled, so this is the only evidence
// of its controls this project has.
import { expect, type Page } from '@playwright/test';

export async function loginAsUser(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/web/index.php/auth/login');
  await page.locator('input[name=\'username\']').fill(username);
  await page.locator('input[name=\'password\']').fill(password);
  await page.locator('button[type=\'submit\']').click();
  await expect(page.locator('.oxd-topbar-header').first()).toBeVisible({ timeout: 30_000 }); // allow:positional-locator mirrors tests/auth.setup.ts's own proven selector for this uncrawled screen
}
