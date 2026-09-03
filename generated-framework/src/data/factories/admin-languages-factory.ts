import type { APIResponse } from '@playwright/test';
import type { AdminLanguagesClient } from '../../api/clients/AdminLanguagesClient';
import type { CreateALanguageRequest } from '../testData/AdminLanguages.types.generated';

/**
 * Precondition/setup helpers for Admin/Languages, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createALanguage(client: AdminLanguagesClient, overrides: Partial<CreateALanguageRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateALanguageRequest;
  return client.createALanguage(body);
}
