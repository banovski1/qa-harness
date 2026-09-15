// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a JobTitle exists. */
export class JobTitleApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Job Titles. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/job-titles', params);
  }

  /** Get a Job Title. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/job-titles/{id}', params));
  }

  /**
   * Create a Job Title.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: title, description, note, specification.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/job-titles', data);
  }

  /** Update a Job Title. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/job-titles/{id}', params), data);
  }

  /** Delete Job Titles. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/job-titles', params));
  }

  /** Get Job Specification. */
  async getSpecification<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/job-titles/{id}/specification', params), { data });
  }
}
