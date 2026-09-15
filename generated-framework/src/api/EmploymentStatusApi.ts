// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: an EmploymentStatus exists. */
export class EmploymentStatusApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Employment Statuses. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/employment-statuses', params);
  }

  /** Get an Employment Status. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/employment-statuses/{id}', params));
  }

  /**
   * Create an Employment Status.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/employment-statuses', data);
  }

  /** Update an Employment Status. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/employment-statuses/{id}', params), data);
  }

  /** Delete Employment Statuses. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/employment-statuses', params));
  }
}
