import type { APIResponse } from '@playwright/test';
import type { ClaimExpenseTypesClient } from '../../api/clients/ClaimExpenseTypesClient';
import type { CreateAnExpenseTypeRequest } from '../testData/ClaimExpenseTypes.types.generated';

/**
 * Precondition/setup helpers for Claim/Expense Types, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAnExpenseType(client: ClaimExpenseTypesClient, overrides: Partial<CreateAnExpenseTypeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAnExpenseTypeRequest;
  return client.createAnExpenseType(body);
}
