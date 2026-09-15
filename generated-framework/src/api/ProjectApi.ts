// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Project exists.
 *  Requires: Customer — create those first. */
export class ProjectApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Projects. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/projects', params);
  }

  /** Get a Project. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/time/projects/{id}', params));
  }

  /**
   * Crete a Project.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: customerId, name, description, projectAdminsEmpNumbers.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/time/projects', data);
  }

  /** Update a Project. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/time/projects/{id}', params), data);
  }

  /** Delete Projects. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/time/projects', params));
  }

  /** Delete a Project's Activities. */
  async deleteActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities', params), { data });
  }

  /** List a Project's Activities. */
  async getActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities', params), { data });
  }

  /** Add an Activity to a Project. */
  async postActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities', params), { data });
  }

  /** Get a Project's Activity. */
  async getActivitiesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities/{id}', params), { data });
  }

  /** Update a Project's Activity. */
  async putActivitiesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities/{id}', params), { data });
  }

  /** List Copyable Activities Between Two Projects. */
  async getActivitiesCopyById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}', params), { data });
  }

  /** Copy Activities From One Project. */
  async postActivitiesCopyById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}', params), { data });
  }
}
