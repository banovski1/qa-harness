import type { APIResponse } from '@playwright/test';
import type { PerformanceKpiConfigurationClient } from '../../api/clients/PerformanceKpiConfigurationClient';
import type { CreateAKpiRequest } from '../testData/PerformanceKpiConfiguration.types.generated';

/**
 * Precondition/setup helpers for Performance/KPI Configuration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAKpi(client: PerformanceKpiConfigurationClient, overrides: Partial<CreateAKpiRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAKpiRequest;
  return client.createAKpi(body);
}
