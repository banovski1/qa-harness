// Preconditions go through here, not through the browser.
//
// A test that creates its fixtures by clicking is slow and tests the same screens twice;
// worse, when setup breaks it fails the wrong test. This client makes state directly and
// reports its own failures as clearly as the components report theirs.
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { test } from '@playwright/test';

export interface ApiFailure {
  method: string;
  path: string;
  status: number;
  body: string;
  sent: unknown;
  hint: string;
}

export class ApiError extends Error {
  constructor(readonly failure: ApiFailure) {
    super(
      `${failure.method} ${failure.path} → ${failure.status}\n` +
      `  sent:  ${JSON.stringify(failure.sent ?? null).slice(0, 400)}\n` +
      `  body:  ${failure.body.slice(0, 400)}\n` +
      `  hint:  ${failure.hint}`,
    );
    this.name = 'ApiError';
  }
}

function hintFor(status: number): string {
  if (status === 401) return 'not authenticated — the storage state is missing or expired. Re-run the setup project.';
  if (status === 403) return 'authenticated but not permitted. The test user lacks the role this endpoint needs.';
  if (status === 404) return 'no such path, or the record was already removed. Check the path against app-model.json.';
  if (status === 422 || status === 400) return 'the payload was rejected. The required fields in app-model.json come from the spec — if the spec omits a mandatory field, record it in analysis/<app>/api.json.';
  if (status === 405) return 'the method is wrong for this path.';
  if (status >= 500) return 'the application errored. This is usually bad data in the payload rather than a broken test.';
  return 'unexpected status.';
}

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
  ) {}

  async call<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: { data?: unknown; params?: Record<string, string | number | boolean> } = {},
  ): Promise<T> {
    return test.step(`API ${method} ${path}`, async () => {
      const url = this.baseUrl.replace(/\/$/, '') + path;
      const response: APIResponse = await this.request.fetch(url, {
        method,
        data: options.data as never,
        params: options.params,
        headers: { Accept: 'application/json' },
      });
      const text = await response.text();
      if (!response.ok()) {
        throw new ApiError({
          method, path, status: response.status(), body: text,
          sent: options.data ?? null, hint: hintFor(response.status()),
        });
      }
      if (!text) return undefined as T;
      try {
        return JSON.parse(text) as T;
      } catch {
        return text as unknown as T;
      }
    });
  }

  get<T = unknown>(path: string, params?: Record<string, string | number | boolean>) {
    return this.call<T>('GET', path, { params });
  }
  post<T = unknown>(path: string, data?: unknown) { return this.call<T>('POST', path, { data }); }
  put<T = unknown>(path: string, data?: unknown) { return this.call<T>('PUT', path, { data }); }
  patch<T = unknown>(path: string, data?: unknown) { return this.call<T>('PATCH', path, { data }); }
  delete<T = unknown>(path: string) { return this.call<T>('DELETE', path); }
}

/** Fill a path's record slots: ('/x/{id}', { id: 7 }) → '/x/7'. */
export function fillPath(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const value = params[key];
    if (value === undefined) {
      throw new Error(`${template} needs a value for {${key}}; got ${JSON.stringify(params)}`);
    }
    return String(value);
  });
}

/**
 * The id of a record the API just returned.
 *
 * Every API wraps its payload differently — `{data:{id}}`, `{id}`, `{user:{id}}` — and a
 * precondition needs the id to clean up afterwards. This tries the shapes in order and
 * says so plainly when none of them fit, rather than returning undefined.
 */
export function idOf(response: unknown, field = 'id'): string | number {
  const seen = new Set<unknown>();
  const search = (node: unknown, depth: number): string | number | undefined => {
    if (!node || typeof node !== 'object' || depth > 3 || seen.has(node)) return undefined;
    seen.add(node);
    const record = node as Record<string, unknown>;
    const direct = record[field];
    if (typeof direct === 'string' || typeof direct === 'number') return direct;
    for (const value of Object.values(record)) {
      const found = search(value, depth + 1);
      if (found !== undefined) return found;
    }
    return undefined;
  };
  const found = search(response, 0);
  if (found === undefined) {
    throw new Error(
      `No "${field}" in the response, so this record cannot be cleaned up later. ` +
      `Response was: ${JSON.stringify(response).slice(0, 300)}`,
    );
  }
  return found;
}
