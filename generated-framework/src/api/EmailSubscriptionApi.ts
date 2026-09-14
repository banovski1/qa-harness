// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for EmailSubscription. */
export class EmailSubscriptionApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Email Subscriptions. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/email-subscriptions', params);
  }

  /** Update an Email Subscription. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/email-subscriptions/{id}', params), data);
  }

  /** Delete Email Subscribers. */
  async deleteSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', params), { data });
  }

  /** List All Email Subscribers. */
  async getSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', params), { data });
  }

  /** Create an Email Subscriber. */
  async postSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', params), { data });
  }

  /** Get an Email Subscriber. */
  async getSubscribersById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}', params), { data });
  }

  /** Update an Email Susbcriber. */
  async putSubscribersById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}', params), { data });
  }
}
