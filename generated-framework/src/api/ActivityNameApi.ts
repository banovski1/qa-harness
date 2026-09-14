// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for ActivityName. */
export class ActivityNameApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Project Activity Name Uniqueness. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/time/validation/activity-name/{id}', params));
  }
}
