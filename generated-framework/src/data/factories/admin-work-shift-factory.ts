import type { APIResponse } from '@playwright/test';
import type { AdminWorkShiftClient } from '../../api/clients/AdminWorkShiftClient';
import type { CreateAWorkShiftRequest } from '../testData/AdminWorkShift.types.generated';

/**
 * Precondition/setup helpers for Admin/Work Shift, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAWorkShift(client: AdminWorkShiftClient, overrides: Partial<CreateAWorkShiftRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAWorkShiftRequest;
  return client.createAWorkShift(body);
}
