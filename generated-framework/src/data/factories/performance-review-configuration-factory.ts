import type { APIResponse } from '@playwright/test';
import type { PerformanceReviewConfigurationClient } from '../../api/clients/PerformanceReviewConfigurationClient';
import type { CreateAPerformanceReviewRequest } from '../testData/PerformanceReviewConfiguration.types.generated';

/**
 * Precondition/setup helpers for Performance/Review Configuration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAPerformanceReview(client: PerformanceReviewConfigurationClient, overrides: Partial<CreateAPerformanceReviewRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAPerformanceReviewRequest;
  return client.createAPerformanceReview(body);
}
