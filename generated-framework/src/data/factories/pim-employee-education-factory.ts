import type { APIResponse } from '@playwright/test';
import type { PimEmployeeEducationClient } from '../../api/clients/PimEmployeeEducationClient';
import type { AddAnEducationalQualificationToAnEmployeeRequest } from '../testData/PimEmployeeEducation.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Education, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnEducationalQualificationToAnEmployee(client: PimEmployeeEducationClient, empNumber: number, overrides: Partial<AddAnEducationalQualificationToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnEducationalQualificationToAnEmployeeRequest;
  return client.addAnEducationalQualificationToAnEmployee(empNumber, body);
}
