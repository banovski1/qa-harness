// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/analysis.json (8b4f900085)

import { ApiClient, fillPath, idOf } from './ApiClient.ts';
import type { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/constants.ts';

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class DestroyAuthTokenApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * log out.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/api/v1/App/destroyAuthToken', data);
  }
}

/** Read-only: this API declares no create for Metadata.
 */
export class MetadataApi {
  constructor(private readonly api: ApiClient) {}

  /** the full metadata tree — field definitions for every entity, i.e. what a create payload may contain. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/api/v1/Metadata', params);
  }
}

/** Every resource the API declares, on one object. */
export class Api {
  readonly http: ApiClient;
  readonly destroyAuthToken: DestroyAuthTokenApi;
  readonly metadata: MetadataApi;

  constructor(request: APIRequestContext, baseUrl = BASE_URL) {
    this.http = new ApiClient(request, baseUrl);
    this.destroyAuthToken = new DestroyAuthTokenApi(this.http);
    this.metadata = new MetadataApi(this.http);
  }
}

export { idOf };
