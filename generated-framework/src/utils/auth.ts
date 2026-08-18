import type { Page } from '@playwright/test';

/** Log in as an arbitrary user, for scripts that switch identities mid-test. */
export async function loginAs(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/web/index.php/auth/login', { waitUntil: 'domcontentloaded' });
  await page.getByRole('textbox', { name: 'Username', exact: true }).waitFor({ state: 'visible', timeout: 60_000 });
  await page.getByRole('textbox', { name: 'Username', exact: true }).fill(username);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
}
