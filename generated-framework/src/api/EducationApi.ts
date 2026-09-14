// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: an Education exists. */
export class EducationApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Education Records. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/educations', params);
  }

  /** Get an Education Record. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/educations/{id}', params));
  }

  /**
   * Create an Education Record.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/educations', data);
  }

  /** Update an Education Record. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/educations/{id}', params), data);
  }

  /** Delete Education Records. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/educations', params));
  }
}
