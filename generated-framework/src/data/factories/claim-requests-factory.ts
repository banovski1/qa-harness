import type { APIResponse } from '@playwright/test';
import type { ClaimRequestsClient } from '../../api/clients/ClaimRequestsClient';
import type { ListAnEmployeesClaimRequestsRequest } from '../testData/ClaimRequests.types.generated';

/**
 * Precondition/setup helpers for Claim/Requests, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function listAnEmployeesClaimRequests(client: ClaimRequestsClient, empNumber: number, overrides: Partial<ListAnEmployeesClaimRequestsRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as ListAnEmployeesClaimRequestsRequest;
  return client.listAnEmployeesClaimRequests(empNumber, body);
}
