// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Defined exists. */
export class DefinedApi {
  constructor(private readonly api: ApiClient) {}

  /** List All PIM Reports. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/reports/defined', params);
  }

  /**
   * Create a PIM Report.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, include, criteria, y, operator, fieldGroup, includeHeader.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/reports/defined', data);
  }

  /** Update a PIM Report. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/reports/defined/{id}', params), data);
  }

  /** Delete PIM Reports. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/reports/defined', params));
  }
}
