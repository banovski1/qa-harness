import type { APIResponse } from '@playwright/test';
import type { TimeProjectClient } from '../../api/clients/TimeProjectClient';
import type { CreateAProjectRequest } from '../testData/TimeProject.types.generated';

/**
 * Precondition/setup helpers for Time/Project, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAProject(client: TimeProjectClient, overrides: Partial<CreateAProjectRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAProjectRequest;
  return client.createAProject(body);
}
