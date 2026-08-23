import type { APIResponse } from '@playwright/test';
import type { PerformanceTrackerLogsClient } from '../../api/clients/PerformanceTrackerLogsClient';
import type { CreateALogForAPerformanceTrackerRequest } from '../testData/PerformanceTrackerLogs.types.generated';

/**
 * Precondition/setup helpers for Performance/Tracker Logs, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createALogForAPerformanceTracker(client: PerformanceTrackerLogsClient, trackerId: number, overrides: Partial<CreateALogForAPerformanceTrackerRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateALogForAPerformanceTrackerRequest;
  return client.createALogForAPerformanceTracker(trackerId, body);
}
