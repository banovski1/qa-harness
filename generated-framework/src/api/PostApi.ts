// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Post exists. */
export class PostApi {
  constructor(private readonly api: ApiClient) {}

  /** Get a Post. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/buzz/posts/{id}', params));
  }

  /**
   * Post Text, Photos or Video.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/buzz/posts', data);
  }

  /** Edit a Post. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/buzz/posts/{id}', params), data);
  }

  /** List All Shares of a Post. */
  async getShares<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/posts/{id}/shares', params), { data });
  }
}
