import type { APIResponse } from '@playwright/test';
import type { AdminNationalityClient } from '../../api/clients/AdminNationalityClient';
import type { CreateANationalityRequest } from '../testData/AdminNationality.types.generated';

/**
 * Precondition/setup helpers for Admin/Nationality, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createANationality(client: AdminNationalityClient, overrides: Partial<CreateANationalityRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateANationalityRequest;
  return client.createANationality(body);
}
