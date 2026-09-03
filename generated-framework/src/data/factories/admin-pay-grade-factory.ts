import type { APIResponse } from '@playwright/test';
import type { AdminPayGradeClient } from '../../api/clients/AdminPayGradeClient';
import type { CreateAPayGradeRequest } from '../testData/AdminPayGrade.types.generated';

/**
 * Precondition/setup helpers for Admin/Pay Grade, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAPayGrade(client: AdminPayGradeClient, overrides: Partial<CreateAPayGradeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAPayGradeRequest;
  return client.createAPayGrade(body);
}
