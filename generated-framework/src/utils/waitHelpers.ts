import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Wait for the app's loading indicator to disappear, if one is present at all.
 *
 * A cleared spinner is not evidence that anything succeeded — it is a UI
 * decoration that a redesign can remove. Use this to settle an intermediate
 * screen, never in place of asserting the response or the result the user sees.
 */
export async function waitForSpinnerToClear(page: Page, timeout = 15_000): Promise<void> {
  const spinner = page.locator('[role="progressbar"], [aria-busy="true"]');
  if ((await spinner.count()) === 0) return;
  await expect(spinner.first()).toBeHidden({ timeout }); // allow:positional-locator
}

/** Poll until the locator resolves to exactly one element. */
export async function waitForUnique(locator: Locator, timeout = 10_000): Promise<void> {
  await expect
    .poll(async () => locator.count(), {
      message: 'locator did not resolve to exactly one element',
      timeout,
    })
    .toBe(1);
}
