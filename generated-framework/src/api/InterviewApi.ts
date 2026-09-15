// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Interview. */
export class InterviewApi {
  constructor(private readonly api: ApiClient) {}

  /** Delete Interview Attachments. */
  async deleteAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments', params), { data });
  }

  /** List All Interview Attachments. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments', params), { data });
  }

  /** Add an Attachment to an Interview. */
  async postAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments', params), { data });
  }

  /** Get an Interview Attachment. */
  async getAttachmentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}', params), { data });
  }

  /** Update an Interview Attachment. */
  async putAttachmentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}', params), { data });
  }
}
