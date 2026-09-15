// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a PayGrade exists. */
export class PayGradeApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Pay Grades. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/pay-grades', params);
  }

  /** Get a Pay Grade. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/pay-grades/{id}', params));
  }

  /**
   * Create a Pay Grade.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/pay-grades', data);
  }

  /** Update a Pay Grade. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/pay-grades/{id}', params), data);
  }

  /** Delete Pay Grades. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/pay-grades', params));
  }

  /** Delete Pay Grade Currencies. */
  async deleteCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies', params), { data });
  }

  /** List All Pay Grade Currencies. */
  async getCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies', params), { data });
  }

  /** Create a Pay Grade Currency. */
  async postCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies', params), { data });
  }

  /** List Allowed Currencies for Pay Grade. */
  async getCurrenciesAllowed<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies/allowed', params), { data });
  }

  /** Get a Pay Grade Currency. */
  async getCurrenciesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies/{id}', params), { data });
  }

  /** Update a Pay Grade Currency. */
  async putCurrenciesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies/{id}', params), { data });
  }
}
