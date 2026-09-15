// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Translation. */
export class TranslationApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate I18N Translation. */
  async getValidate<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/i18n/translation/{langStringId}/validate', params), { data });
  }
}
