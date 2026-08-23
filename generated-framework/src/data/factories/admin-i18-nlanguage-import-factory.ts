import type { APIResponse } from '@playwright/test';
import type { AdminI18NLanguageImportClient } from '../../api/clients/AdminI18NLanguageImportClient';
import type { ImportI18nLanguageRequest } from '../testData/AdminI18NLanguageImport.types.generated';

/**
 * Precondition/setup helpers for Admin/I18N Language Import, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function importI18nLanguage(client: AdminI18NLanguageImportClient, languageId: number, overrides: Partial<ImportI18nLanguageRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as ImportI18nLanguageRequest;
  return client.importI18nLanguage(languageId, body);
}
