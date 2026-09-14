// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a LeaveEntitlement exists.
 *  Requires: Employee, LeaveType, Location — create those first. */
export class LeaveEntitlementApi {
  constructor(private readonly api: ApiClient) {}

  /** List an Employee's Leave Entitlements. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/employees/leave-entitlements', params);
  }

  /** Get a Leave Entitlement. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/leave-entitlements/{id}', params));
  }

  /**
   * Assign Leave Entitlements to Employees.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: empNumber, entitlement, fromDate, toDate, leaveTypeId, bulkAssign, locationId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/leave-entitlements', data);
  }

  /** Update a Leave Entitlement. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leave-entitlements/{id}', params), data);
  }

  /** Delete Leave Entitlements. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/leave/leave-entitlements', params));
  }

  /** Validate Leave Entitlement. */
  async getValidationEntitlements<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leave-entitlements/{id}/validation/entitlements', params), { data });
  }
}
