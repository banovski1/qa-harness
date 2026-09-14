// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a User exists.
 *  Requires: Employee — create those first. */
export class UserApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Users. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/users', params);
  }

  /** Get a User. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/users/{id}', params));
  }

  /**
   * Create a User.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: username, password, status, userRoleId, empNumber.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/users', data);
  }

  /** Update a User. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/users/{id}', params), data);
  }

  /** Delete Users. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/users', params));
  }
}
