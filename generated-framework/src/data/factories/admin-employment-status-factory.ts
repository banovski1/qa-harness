import type { APIResponse } from '@playwright/test';
import type { AdminEmploymentStatusClient } from '../../api/clients/AdminEmploymentStatusClient';
import type { CreateAnEmploymentStatusRequest } from '../testData/AdminEmploymentStatus.types.generated';

/**
 * Precondition/setup helpers for Admin/Employment Status, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAnEmploymentStatus(client: AdminEmploymentStatusClient, overrides: Partial<CreateAnEmploymentStatusRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAnEmploymentStatusRequest;
  return client.createAnEmploymentStatus(body);
}
