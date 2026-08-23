import type { APIResponse } from '@playwright/test';
import type { AdminUsersClient } from '../../api/clients/AdminUsersClient';
import type { CreateAUserRequest } from '../testData/AdminUsers.types.generated';

/**
 * Precondition/setup helpers for Admin/Users, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAUser(client: AdminUsersClient, overrides: Partial<CreateAUserRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAUserRequest;
  return client.createAUser(body);
}
