import type { APIResponse } from '@playwright/test';
import type { AdminEmailSubscriberClient } from '../../api/clients/AdminEmailSubscriberClient';
import type { CreateAnEmailSubscriberRequest } from '../testData/AdminEmailSubscriber.types.generated';

/**
 * Precondition/setup helpers for Admin/Email Subscriber, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAnEmailSubscriber(client: AdminEmailSubscriberClient, emailSubscriptionId: number, overrides: Partial<CreateAnEmailSubscriberRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAnEmailSubscriberRequest;
  return client.createAnEmailSubscriber(emailSubscriptionId, body);
}
