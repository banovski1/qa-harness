import type { APIResponse } from '@playwright/test';
import type { AdminLdapConfigurationClient } from '../../api/clients/AdminLdapConfigurationClient';
import type { TestLdapConnectionRequest } from '../testData/AdminLdapConfiguration.types.generated';

/**
 * Precondition/setup helpers for Admin/LDAP Configuration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function testLdapConnection(client: AdminLdapConfigurationClient, overrides: Partial<TestLdapConnectionRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as TestLdapConnectionRequest;
  return client.testLdapConnection(body);
}
