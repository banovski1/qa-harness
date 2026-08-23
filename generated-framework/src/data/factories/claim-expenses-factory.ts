import type { APIResponse } from '@playwright/test';
import type { ClaimExpensesClient } from '../../api/clients/ClaimExpensesClient';
import type { AddAnExpenseToAClaimRequest } from '../testData/ClaimExpenses.types.generated';

/**
 * Precondition/setup helpers for Claim/Expenses, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnExpenseToAClaim(client: ClaimExpensesClient, requestId: number, overrides: Partial<AddAnExpenseToAClaimRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnExpenseToAClaimRequest;
  return client.addAnExpenseToAClaim(requestId, body);
}
