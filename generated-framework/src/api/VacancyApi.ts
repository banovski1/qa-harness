// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Vacancy exists.
 *  Requires: Employee, JobTitle — create those first. */
export class VacancyApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Vacancies. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/recruitment/vacancies', params);
  }

  /** Get a Vacancy. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/recruitment/vacancies/{id}', params));
  }

  /**
   * Create a Vacancy.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, status, jobTitleId, isPublished, description, numOfPositions, employeeId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/recruitment/vacancies', data);
  }

  /** Update a Vacancy. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/recruitment/vacancies/{id}', params), data);
  }

  /** Delete Vacancies. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/recruitment/vacancies', params));
  }

  /** Get a Vacancy Attachment. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/vacancies/{vacancyId}/attachments', params), { data });
  }

  /** Update a Vacancy Attachment. */
  async putAttachmentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/vacancies/{vacancyId}/attachments/{attachmentId}', params), { data });
  }
}
