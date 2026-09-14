// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Request exists. */
export class RequestApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Claim Requests. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/claim/employees/requests', params);
  }

  /** Get My Claim Request. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/claim/requests/{id}', params));
  }

  /**
   * Create My Claim Request.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: claimEventId, currencyId, remarks.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/claim/requests', data);
  }

  /** Perform an Action on a Claim Request. */
  async putAction<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/action', params), { data });
  }

  /** Remove Attachments from a Claim. */
  async deleteAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments', params), { data });
  }

  /** List Attachements on a Claim. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments', params), { data });
  }

  /** Add Attachments to a Claim. */
  async postAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments', params), { data });
  }

  /** View an Attachment on a Claim. */
  async getAttachmentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments/{id}', params), { data });
  }

  /** Update an Attachment on a Claim. */
  async putAttachmentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments/{id}', params), { data });
  }

  /** Remove an Expense from a Claim. */
  async deleteExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses', params), { data });
  }

  /** List All Expenses from a Claim. */
  async getExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses', params), { data });
  }

  /** Add an Expense to a Claim. */
  async postExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses', params), { data });
  }

  /** Get an Expense from a Claim. */
  async getExpensesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses/{id}', params), { data });
  }

  /** Update an Expense from a Claim. */
  async putExpensesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses/{id}', params), { data });
  }
}
