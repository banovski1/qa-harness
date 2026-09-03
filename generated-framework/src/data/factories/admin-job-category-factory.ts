import type { APIResponse } from '@playwright/test';
import type { AdminJobCategoryClient } from '../../api/clients/AdminJobCategoryClient';
import type { CreateAJobCategoryRequest } from '../testData/AdminJobCategory.types.generated';

/**
 * Precondition/setup helpers for Admin/Job Category, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAJobCategory(client: AdminJobCategoryClient, overrides: Partial<CreateAJobCategoryRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAJobCategoryRequest;
  return client.createAJobCategory(body);
}
