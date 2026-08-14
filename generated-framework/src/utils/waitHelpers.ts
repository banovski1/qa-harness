import type { Locator, Page } from '@playwright/test';

/** Wait for the app's loading indicator to disappear, if one is present at all. */
export async function waitForSpinnerToClear(page: Page, timeout = 15_000): Promise<void> {
  const spinner = page.locator('[role="progressbar"], [aria-busy="true"]').first();
  if ((await spinner.count()) === 0) return;
  await spinner.waitFor({ state: 'hidden', timeout }).catch(() => {
    // A spinner that never resolves is the assertion's problem, not the wait's.
  });
}

/** Poll until the locator resolves to exactly one element. */
export async function waitForUnique(locator: Locator, timeout = 10_000): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if ((await locator.count()) === 1) return;
    await locator.page().waitForTimeout(100);
  }
  throw new Error(`Locator did not resolve to exactly one element within ${timeout}ms`);
}
