// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Language exists. */
export class LanguageApi {
  constructor(private readonly api: ApiClient) {}

  /** List All I18N Languages. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/i18n/languages', params);
  }

  /** Get an I18N Language. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/i18n/languages/{id}', params));
  }

  /**
   * Create a Language Record.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/languages', data);
  }

  /** Update an I18N Language. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/i18n/languages/{id}', params), data);
  }

  /** Delete an I18N Language. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/i18n/languages', params));
  }

  /** Import I18N language. */
  async postImport<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/import', params), { data });
  }

  /** List All I18N Translations. */
  async getTranslations<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/translations', params), { data });
  }

  /** Bulk Update I18N Translations. */
  async putTranslationsBulk<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/translations/bulk', params), { data });
  }

  /** List I18N Import Errors. */
  async getTranslationsErrors<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/translations/errors', params), { data });
  }
}
