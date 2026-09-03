import type { Page, Response } from '@playwright/test';

export interface ResponseCriteria {
  urlIncludes: string;
  method?: string;
  status?: number;
}

/**
 * Register a response wait *before* the action that triggers it.
 *
 * The listener has to exist before the request is sent, or a fast response
 * lands before anything is watching and the wait hangs until it times out. So
 * this deliberately returns an un-awaited promise:
 *
 *   const saved = expectResponse(page, { urlIncludes: '/users', method: 'POST', status: 200 });
 *   await page.saveButton.click();
 *   await saved;
 *
 * Asserting the response rather than a spinner also means the test knows the
 * difference between "the operation succeeded" and "the loading state ended".
 */
export function expectResponse(page: Page, criteria: ResponseCriteria): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.url().includes(criteria.urlIncludes) &&
      (criteria.method === undefined || response.request().method() === criteria.method) &&
      (criteria.status === undefined || response.status() === criteria.status),
  );
}

/** The same wait, resolved to the parsed JSON body. */
export async function expectJson<T>(page: Page, criteria: ResponseCriteria): Promise<T> {
  const response = await expectResponse(page, criteria);
  return (await response.json()) as T;
}
