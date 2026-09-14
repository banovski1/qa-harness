// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Bulk. */
export class BulkApi {
  constructor(private readonly api: ApiClient) {}

  /** Bulk Approve/Cancel/Reject Leave Requests. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/employees/leave-requests/bulk', params), data);
  }
}
