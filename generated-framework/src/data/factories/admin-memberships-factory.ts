import type { APIResponse } from '@playwright/test';
import type { AdminMembershipsClient } from '../../api/clients/AdminMembershipsClient';
import type { CreateAMembershipRequest } from '../testData/AdminMemberships.types.generated';

/**
 * Precondition/setup helpers for Admin/Memberships, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAMembership(client: AdminMembershipsClient, overrides: Partial<CreateAMembershipRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAMembershipRequest;
  return client.createAMembership(body);
}
