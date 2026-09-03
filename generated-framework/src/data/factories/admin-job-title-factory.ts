import type { APIResponse } from '@playwright/test';
import type { AdminJobTitleClient } from '../../api/clients/AdminJobTitleClient';
import type { CreateAJobTitleRequest } from '../testData/AdminJobTitle.types.generated';

/**
 * Precondition/setup helpers for Admin/Job Title, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAJobTitle(client: AdminJobTitleClient, overrides: Partial<CreateAJobTitleRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAJobTitleRequest;
  return client.createAJobTitle(body);
}
