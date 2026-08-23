import type { APIResponse } from '@playwright/test';
import type { PimEmployeeCsvImportClient } from '../../api/clients/PimEmployeeCsvImportClient';
import type { ImportEmployeeRecordsRequest } from '../testData/PimEmployeeCsvImport.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee CSV Import, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function importEmployeeRecords(client: PimEmployeeCsvImportClient, overrides: Partial<ImportEmployeeRecordsRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as ImportEmployeeRecordsRequest;
  return client.importEmployeeRecords(body);
}
