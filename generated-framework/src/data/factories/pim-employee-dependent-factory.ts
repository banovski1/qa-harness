import type { APIResponse } from '@playwright/test';
import type { PimEmployeeDependentClient } from '../../api/clients/PimEmployeeDependentClient';
import type { AddADependentToAnEmployeeRequest } from '../testData/PimEmployeeDependent.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Dependent, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addADependentToAnEmployee(client: PimEmployeeDependentClient, empNumber: number, overrides: Partial<AddADependentToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddADependentToAnEmployeeRequest;
  return client.addADependentToAnEmployee(empNumber, body);
}
