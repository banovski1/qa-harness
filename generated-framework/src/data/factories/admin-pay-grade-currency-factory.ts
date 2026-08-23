import type { APIResponse } from '@playwright/test';
import type { AdminPayGradeCurrencyClient } from '../../api/clients/AdminPayGradeCurrencyClient';
import type { CreateAPayGradeCurrencyRequest } from '../testData/AdminPayGradeCurrency.types.generated';

/**
 * Precondition/setup helpers for Admin/Pay Grade Currency, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAPayGradeCurrency(client: AdminPayGradeCurrencyClient, payGradeId: number, overrides: Partial<CreateAPayGradeCurrencyRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAPayGradeCurrencyRequest;
  return client.createAPayGradeCurrency(payGradeId, body);
}
