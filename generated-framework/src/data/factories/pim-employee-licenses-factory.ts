import type { APIResponse } from '@playwright/test';
import type { PimEmployeeLicensesClient } from '../../api/clients/PimEmployeeLicensesClient';
import type { AddALicenseToAnEmployeeRequest } from '../testData/PimEmployeeLicenses.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Licenses, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addALicenseToAnEmployee(client: PimEmployeeLicensesClient, empNumber: number, overrides: Partial<AddALicenseToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddALicenseToAnEmployeeRequest;
  return client.addALicenseToAnEmployee(empNumber, body);
}
