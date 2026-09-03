import type { APIResponse } from '@playwright/test';
import type { TimeProjectActivityClient } from '../../api/clients/TimeProjectActivityClient';
import type { AddAnActivityToAProjectRequest } from '../testData/TimeProjectActivity.types.generated';

/**
 * Precondition/setup helpers for Time/Project Activity, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnActivityToAProject(client: TimeProjectActivityClient, projectId: number, overrides: Partial<AddAnActivityToAProjectRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnActivityToAProjectRequest;
  return client.addAnActivityToAProject(projectId, body);
}
