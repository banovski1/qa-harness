// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Review exists.
 *  Requires: Employee — create those first. */
export class ReviewApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Reviews. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/employees/reviews', params);
  }

  /** Get a Performance Review. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/performance/manage/reviews/{id}', params));
  }

  /**
   * Create a Performance Review.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: empNumber, reviewerEmpNumber, startDate, endDate, dueDate, activate.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/performance/manage/reviews', data);
  }

  /** Update a Performance Review. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/performance/manage/reviews/{id}', params), data);
  }

  /** Delete Performance Reviews. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/performance/manage/reviews', params));
  }

  /** Get Allowed Actions for Review. */
  async getActionsAllowed<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/actions/allowed', params), { data });
  }

  /** Get the Employee's Evaluation in a Review. */
  async getEvaluationEmployee<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/employee', params), { data });
  }

  /** Update the Employee's Evaluation in a Review. */
  async putEvaluationEmployee<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/employee', params), { data });
  }

  /** Get a Finalized Performance Review. */
  async getEvaluationFinal<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/final', params), { data });
  }

  /** Finalize Performance Review. */
  async putEvaluationFinal<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/final', params), { data });
  }

  /** Get the Supervisor's Evaluation in a Review. */
  async getEvaluationSupervisor<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/supervisor', params), { data });
  }

  /** Update the Supervisor's Evaluation in a Review. */
  async putEvaluationSupervisor<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/supervisor', params), { data });
  }

  /** List KPIs for a Review. */
  async getKpis<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/kpis', params), { data });
  }
}
