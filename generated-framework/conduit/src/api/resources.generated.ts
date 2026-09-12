// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import { ApiClient, fillPath, idOf } from './ApiClient.ts';
import type { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/constants.ts';

/** Creating one makes true: an Article exists.
 */
export class ArticleApi {
  constructor(private readonly api: ApiClient) {}

  /** the feed, filtered by tag/author/favorited. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/api/articles', params);
  }

  /** one article. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/api/articles/{slug}', params));
  }

  /**
   * create an article — the precondition workhorse.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: article.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/api/articles', data);
  }

  /** delete an article — use for cleanup. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/api/articles/{slug}', params));
  }

  /** favourite an article. */
  async postFavorite<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/api/articles/{slug}/favorite', params), { data });
  }

  /** comments on an article. */
  async getComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/api/articles/{slug}/comments', params), { data });
  }

  /** delete a comment. */
  async deleteComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/api/articles/{slug}/comments/{id}', params), { data });
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class LoginApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * log in.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/api/users/login', data);
  }
}

/** Read-only: this API declares no create for Profile.
 */
export class ProfileApi {
  constructor(private readonly api: ApiClient) {}

  /** a user profile. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/api/profiles/{username}', params));
  }
}

/** Read-only: this API declares no create for Tag.
 */
export class TagApi {
  constructor(private readonly api: ApiClient) {}

  /** the tag cloud. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/api/tags', params);
  }
}

/** Creating one makes true: a User exists.
 */
export class UserApi {
  constructor(private readonly api: ApiClient) {}

  /** the current user. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/api/user', params);
  }

  /**
   * register — creates a test user.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: user.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/api/users', data);
  }

  /** update settings. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/api/user', params), data);
  }
}

/** Every resource the API declares, on one object. */
export class Api {
  readonly client: ApiClient;
  readonly article: ArticleApi;
  readonly login: LoginApi;
  readonly profile: ProfileApi;
  readonly tag: TagApi;
  readonly user: UserApi;

  constructor(request: APIRequestContext, baseUrl = BASE_URL) {
    this.client = new ApiClient(request, baseUrl);
    this.article = new ArticleApi(this.client);
    this.login = new LoginApi(this.client);
    this.profile = new ProfileApi(this.client);
    this.tag = new TagApi(this.client);
    this.user = new UserApi(this.client);
  }
}

export { idOf };
