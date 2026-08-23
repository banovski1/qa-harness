import type { APIResponse } from '@playwright/test';
import type { PimEmployeeImmigrationClient } from '../../api/clients/PimEmployeeImmigrationClient';
import type { AddAnImmigrationRecordToAnEmployeeRequest } from '../testData/PimEmployeeImmigration.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Immigration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnImmigrationRecordToAnEmployee(client: PimEmployeeImmigrationClient, empNumber: number, overrides: Partial<AddAnImmigrationRecordToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnImmigrationRecordToAnEmployeeRequest;
  return client.addAnImmigrationRecordToAnEmployee(empNumber, body);
}
