import type { APIResponse } from '@playwright/test';
import type { AdminThemeClient } from '../../api/clients/AdminThemeClient';
import type { PreviewThemeRequest } from '../testData/AdminTheme.types.generated';

/**
 * Precondition/setup helpers for Admin/Theme, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function previewTheme(client: AdminThemeClient, overrides: Partial<PreviewThemeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as PreviewThemeRequest;
  return client.previewTheme(body);
}
