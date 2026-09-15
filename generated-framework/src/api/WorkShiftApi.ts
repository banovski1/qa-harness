// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a WorkShift exists.
 *  Requires: Employee — create those first. */
export class WorkShiftApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Work Shifts. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/work-shifts', params);
  }

  /** Get a Work Shift. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/work-shifts/{id}', params));
  }

  /**
   * Create a Work Shift.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, hoursPerDay, startTime, endTime, empNumbers.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/work-shifts', data);
  }

  /** Update a Work Shift. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/work-shifts/{id}', params), data);
  }

  /** Delete Work Shifts. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/work-shifts', params));
  }
}
