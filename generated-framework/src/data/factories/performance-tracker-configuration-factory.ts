import type { APIResponse } from '@playwright/test';
import type { PerformanceTrackerConfigurationClient } from '../../api/clients/PerformanceTrackerConfigurationClient';
import type { CreateAPerformanceTrackerRequest } from '../testData/PerformanceTrackerConfiguration.types.generated';

/**
 * Precondition/setup helpers for Performance/Tracker Configuration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAPerformanceTracker(client: PerformanceTrackerConfigurationClient, overrides: Partial<CreateAPerformanceTrackerRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAPerformanceTrackerRequest;
  return client.createAPerformanceTracker(body);
}
