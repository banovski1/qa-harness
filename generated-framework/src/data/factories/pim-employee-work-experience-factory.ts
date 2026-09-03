import type { APIResponse } from '@playwright/test';
import type { PimEmployeeWorkExperienceClient } from '../../api/clients/PimEmployeeWorkExperienceClient';
import type { AddAWorkExperienceRecordToAnEmployeeRequest } from '../testData/PimEmployeeWorkExperience.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Work Experience, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAWorkExperienceRecordToAnEmployee(client: PimEmployeeWorkExperienceClient, empNumber: number, overrides: Partial<AddAWorkExperienceRecordToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAWorkExperienceRecordToAnEmployeeRequest;
  return client.addAWorkExperienceRecordToAnEmployee(empNumber, body);
}
