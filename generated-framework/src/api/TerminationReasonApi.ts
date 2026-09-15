// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a TerminationReason exists. */
export class TerminationReasonApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Termination Reasons. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/termination-reasons', params);
  }

  /** Get a Termination Reason. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/pim/termination-reasons/{id}', params));
  }

  /**
   * Create a Termination Reason.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/termination-reasons', data);
  }

  /** Update a Termination Reason. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/termination-reasons/{id}', params), data);
  }

  /** Delete Termination Reasons. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/termination-reasons', params));
  }
}
