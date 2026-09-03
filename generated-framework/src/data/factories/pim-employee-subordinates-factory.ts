import type { APIResponse } from '@playwright/test';
import type { PimEmployeeSubordinatesClient } from '../../api/clients/PimEmployeeSubordinatesClient';
import type { AddASubordinateToAnEmployeeRequest } from '../testData/PimEmployeeSubordinates.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Subordinates, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addASubordinateToAnEmployee(client: PimEmployeeSubordinatesClient, empNumber: number, overrides: Partial<AddASubordinateToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddASubordinateToAnEmployeeRequest;
  return client.addASubordinateToAnEmployee(empNumber, body);
}
