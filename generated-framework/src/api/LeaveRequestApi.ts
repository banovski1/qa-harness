// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a LeaveRequest exists.
 *  Requires: Employee, LeaveType — create those first. */
export class LeaveRequestApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Leave Requests. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/employees/leave-requests', params);
  }

  /** Get a Leave Request. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/employees/leave-requests/{leaveRequestId}', params));
  }

  /**
   * Create a Leave Request.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: empNumber, leaveTypeId, fromDate, toDate, comment, partialOption, duration.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/employees/leave-requests', data);
  }

  /** Update a Leave Request. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/employees/leave-requests/{leaveRequestId}', params), data);
  }

  /** List Comments for a Leave Request. */
  async getLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leave-requests/{leaveRequestId}/leave-comments', params), { data });
  }

  /** Comment on a Leave Request. */
  async postLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/leave/leave-requests/{leaveRequestId}/leave-comments', params), { data });
  }

  /** List All Leaves in a Leave Request. */
  async getLeaves<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leave-requests/{leaveRequestId}/leaves', params), { data });
  }
}
