import type { APIResponse } from '@playwright/test';
import type { PimCustomFieldClient } from '../../api/clients/PimCustomFieldClient';
import type { CreateACustomFieldRequest } from '../testData/PimCustomField.types.generated';

/**
 * Precondition/setup helpers for PIM/Custom Field, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createACustomField(client: PimCustomFieldClient, overrides: Partial<CreateACustomFieldRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateACustomFieldRequest;
  return client.createACustomField(body);
}
