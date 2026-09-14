// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Action endpoints only: a POST here leaves nothing to read back.
 *  Requires: Candidate — create those first. */
export class AttachmentApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Add an Attachment to a Candidate.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: candidateId, attachment.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/recruitment/candidate/attachments', data);
  }

  /** Delete Vacancy Attachments. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/recruitment/vacancy/attachments', params));
  }
}
