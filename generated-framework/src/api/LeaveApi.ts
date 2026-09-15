// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Leave. */
export class LeaveApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Employees on Leave Today. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/dashboard/employees/leaves', params);
  }

  /** Update a Leave. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leaves/{leaveId}', params), data);
  }

  /** List All Comments for a Leave. */
  async getLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leaves/{leaveId}/leave-comments', params), { data });
  }

  /** Comment on a Leave. */
  async postLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/leave/leaves/{leaveId}/leave-comments', params), { data });
  }
}
