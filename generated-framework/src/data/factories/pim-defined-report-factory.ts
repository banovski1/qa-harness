import type { APIResponse } from '@playwright/test';
import type { PimDefinedReportClient } from '../../api/clients/PimDefinedReportClient';
import type { CreateAPimReportRequest } from '../testData/PimDefinedReport.types.generated';

/**
 * Precondition/setup helpers for PIM/Defined Report, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAPimReport(client: PimDefinedReportClient, overrides: Partial<CreateAPimReportRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAPimReportRequest;
  return client.createAPimReport(body);
}
