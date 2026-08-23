import type { APIResponse } from '@playwright/test';
import type { TimeCopyProjectActivityClient } from '../../api/clients/TimeCopyProjectActivityClient';
import type { CopyActivitiesFromOneProjectRequest } from '../testData/TimeCopyProjectActivity.types.generated';

/**
 * Precondition/setup helpers for Time/Copy Project Activity, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function copyActivitiesFromOneProject(client: TimeCopyProjectActivityClient, toProjectId: number, fromProjectId: number, overrides: Partial<CopyActivitiesFromOneProjectRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CopyActivitiesFromOneProjectRequest;
  return client.copyActivitiesFromOneProject(toProjectId, fromProjectId, body);
}
