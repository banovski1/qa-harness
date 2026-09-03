import type { APIResponse } from '@playwright/test';
import type { ClaimMyRequestsClient } from '../../api/clients/ClaimMyRequestsClient';
import type { CreateMyClaimRequestRequest } from '../testData/ClaimMyRequests.types.generated';

/**
 * Precondition/setup helpers for Claim/My Requests, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createMyClaimRequest(client: ClaimMyRequestsClient, overrides: Partial<CreateMyClaimRequestRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateMyClaimRequestRequest;
  return client.createMyClaimRequest(body);
}
