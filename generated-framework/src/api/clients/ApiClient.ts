import type { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * A thin wrapper over Playwright's request context, for the work that does not
 * need a browser.
 *
 * Validation rules, authorization, pagination, response codes and boundary
 * values are cheaper, faster and steadier to check here than through a form —
 * and setup/teardown through the API keeps a browser test focused on the
 * journey it is actually about instead of on arranging its own fixtures.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(path: string): Promise<APIResponse> {
    return this.request.get(path);
  }

  async post(path: string, data: unknown): Promise<APIResponse> {
    return this.request.post(path, { data });
  }

  async put(path: string, data: unknown): Promise<APIResponse> {
    return this.request.put(path, { data });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(path);
  }

  /** GET the path and fail loudly if it did not succeed, so callers can trust the body. */
  async json<T>(path: string): Promise<T> {
    const response = await this.get(path);
    if (!response.ok()) {
      throw new Error(`GET ${path} failed with ${response.status()} ${response.statusText()}`);
    }
    return (await response.json()) as T;
  }
}
