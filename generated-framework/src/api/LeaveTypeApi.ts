// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a LeaveType exists. */
export class LeaveTypeApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Leave Types. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/leave-types', params);
  }

  /** Get Leave Balance for a Leave Type. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/leave-balance/leave-type/{leaveTypeId}', params));
  }

  /**
   * Create a Leave Type.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, situational.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/leave-types', data);
  }

  /** Update a Leave Type. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leave-types/{id}', params), data);
  }

  /** Delete Leave Types. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/leave/leave-types', params));
  }
}
