// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Action endpoints only: a POST here leaves nothing to read back. */
export class ShareApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Share a Post.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: text, shareId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/buzz/shares', data);
  }

  /** Edit a Share. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/buzz/shares/{id}', params), data);
  }

  /** Delete a Share. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/buzz/shares/{id}', params));
  }

  /** List All Comments on a Post. */
  async getComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments', params), { data });
  }

  /** Comment on a Post. */
  async postComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments', params), { data });
  }

  /** Delete a Comment on a Post. */
  async deleteCommentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments/{commentId}', params), { data });
  }

  /** Get a Comment on a Post. */
  async getCommentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments/{commentId}', params), { data });
  }

  /** Edit a Comment on a Post. */
  async putCommentsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments/{commentId}', params), { data });
  }

  /** Unlike a Liked Share/Post. */
  async deleteLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/likes', params), { data });
  }

  /** List Likes on a Share/Post. */
  async getLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/likes', params), { data });
  }

  /** Like a Share/Post. */
  async postLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/likes', params), { data });
  }
}
