// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Candidate exists.
 *  Requires: Vacancy — create those first. */
export class CandidateApi {
  constructor(private readonly api: ApiClient) {}

  /** List Purgeable Candidates for a Vacancy. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/maintenance/candidates', params);
  }

  /** Get a Candidate. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/recruitment/candidates/{id}', params));
  }

  /**
   * Create a Candidate.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: firstName, middleName, lastName, email, contactNumber, vacancyId, keywords, comment, dateOfApplication, consentToKeepData.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/recruitment/candidates', data);
  }

  /** Update a Candidate. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/recruitment/candidates/{id}', params), data);
  }

  /** Delete Candidates. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/recruitment/candidates', params));
  }

  /** Get a Candidate's Attachment. */
  async getAttachment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidate/{candidateId}/attachment', params), { data });
  }

  /** Update a Candidate's Attachment. */
  async putAttachment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidate/{candidateId}/attachment', params), { data });
  }

  /** Update a Candidate's Interview. */
  async putInterviewById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidate/{candidateId}/interview/{interviewId}', params), { data });
  }

  /** Get Allowed Actions for Candidate. */
  async getActionsAllowed<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/actions/allowed', params), { data });
  }

  /** Hire Candidate. */
  async putHire<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/hire', params), { data });
  }

  /** List a Candidate's History. */
  async getHistory<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/history', params), { data });
  }

  /** Get a Candidate's History Record. */
  async getHistoryById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/history/{historyId}', params), { data });
  }

  /** Update a Candidate's History Record. */
  async putHistoryById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/history/{historyId}', params), { data });
  }

  /** Get a Candidate's Inteview. */
  async getInterviewById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/interview/{interviewId}', params), { data });
  }

  /** Mark Candidate Interview as Failed. */
  async putInterviewsFail<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/fail', params), { data });
  }

  /** Mark Candidate Interview as Passed. */
  async putInterviewsPass<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/pass', params), { data });
  }

  /** Decline Job Offer for Candidate. */
  async putJobDecline<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/job/decline', params), { data });
  }
}
