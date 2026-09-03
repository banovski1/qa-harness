import type { APIResponse } from '@playwright/test';
import type { AdminLicenseClient } from '../../api/clients/AdminLicenseClient';
import type { CreateALicenseRequest } from '../testData/AdminLicense.types.generated';

/**
 * Precondition/setup helpers for Admin/License, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createALicense(client: AdminLicenseClient, overrides: Partial<CreateALicenseRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateALicenseRequest;
  return client.createALicense(body);
}
