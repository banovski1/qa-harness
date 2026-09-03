import type { APIResponse } from '@playwright/test';
import type { ClaimEventsClient } from '../../api/clients/ClaimEventsClient';
import type { CreateAClamEventRequest } from '../testData/ClaimEvents.types.generated';

/**
 * Precondition/setup helpers for Claim/Events, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAClamEvent(client: ClaimEventsClient, overrides: Partial<CreateAClamEventRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAClamEventRequest;
  return client.createAClamEvent(body);
}
