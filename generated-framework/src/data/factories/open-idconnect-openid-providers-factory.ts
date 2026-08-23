import type { APIResponse } from '@playwright/test';
import type { OpenIdconnectOpenidProvidersClient } from '../../api/clients/OpenIdconnectOpenidProvidersClient';
import type { CreateOpenidProviderRequest } from '../testData/OpenIdconnectOpenidProviders.types.generated';

/**
 * Precondition/setup helpers for OpenIDConnect/openid-providers, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createOpenidProvider(client: OpenIdconnectOpenidProvidersClient, overrides: Partial<CreateOpenidProviderRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateOpenidProviderRequest;
  return client.createOpenidProvider(body);
}
