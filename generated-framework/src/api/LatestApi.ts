// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Latest. */
export class LatestApi {
  constructor(private readonly api: ApiClient) {}

  /** Get the Latest Attendance Record. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/records/latest', params);
  }
}
