// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Comment. */
export class CommentApi {
  constructor(private readonly api: ApiClient) {}

  /** Unlike a Liked Comment. */
  async deleteLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/buzz/comments/{commentId}/likes', params), { data });
  }

  /** List Likes on a Comment. */
  async getLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/comments/{commentId}/likes', params), { data });
  }

  /** Like a Comment. */
  async postLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/buzz/comments/{commentId}/likes', params), { data });
  }
}
