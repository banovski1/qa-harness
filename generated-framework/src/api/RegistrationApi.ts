// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Registration exists.
 *  Requires: Subunit — create those first. */
export class RegistrationApi {
  constructor(private readonly api: ApiClient) {}

  /** List Workspace notification registrations. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/workspace-notification/registrations', params);
  }

  /** Get one Workspace notification registration. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations/{id}', params));
  }

  /**
   * Create a Workspace notification registration.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: eventType, provider, webhookUrl, channelLabel, subunitIds, timezone, dailySendTime, active.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/workspace-notification/registrations', data);
  }

  /** Update a Workspace notification registration (partial update supported). */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations/{id}', params), data);
  }

  /** Delete one or more Workspace notification registrations. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations', params));
  }

  /** Send a test Slack notification using a saved registration's stored webhook. */
  async postTest<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations/{id}/test', params), { data });
  }
}
