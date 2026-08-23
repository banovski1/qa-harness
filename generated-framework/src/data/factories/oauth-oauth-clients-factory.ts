import type { APIResponse } from '@playwright/test';
import type { OauthOauthClientsClient } from '../../api/clients/OauthOauthClientsClient';
import type { CreateAnOauthClientRequest } from '../testData/OauthOauthClients.types.generated';

/**
 * Precondition/setup helpers for OAuth/OAuth Clients, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAnOauthClient(client: OauthOauthClientsClient, overrides: Partial<CreateAnOauthClientRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAnOauthClientRequest;
  return client.createAnOauthClient(body);
}
