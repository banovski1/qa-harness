import type { APIResponse } from '@playwright/test';
import type { PimReportingMethodConfigurationClient } from '../../api/clients/PimReportingMethodConfigurationClient';
import type { CreateAReportingMethodRequest } from '../testData/PimReportingMethodConfiguration.types.generated';

/**
 * Precondition/setup helpers for PIM/Reporting Method Configuration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAReportingMethod(client: PimReportingMethodConfigurationClient, overrides: Partial<CreateAReportingMethodRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAReportingMethodRequest;
  return client.createAReportingMethod(body);
}
