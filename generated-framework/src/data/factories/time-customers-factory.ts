import type { APIResponse } from '@playwright/test';
import type { TimeCustomersClient } from '../../api/clients/TimeCustomersClient';
import type { CreateACustomerRequest } from '../testData/TimeCustomers.types.generated';

/**
 * Precondition/setup helpers for Time/Customers, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createACustomer(client: TimeCustomersClient, overrides: Partial<CreateACustomerRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateACustomerRequest;
  return client.createACustomer(body);
}
