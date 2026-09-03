import type { APIResponse } from '@playwright/test';
import type { PimEmployeeSkillClient } from '../../api/clients/PimEmployeeSkillClient';
import type { AddASkillToAnEmployeeRequest } from '../testData/PimEmployeeSkill.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Skill, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addASkillToAnEmployee(client: PimEmployeeSkillClient, empNumber: number, overrides: Partial<AddASkillToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddASkillToAnEmployeeRequest;
  return client.addASkillToAnEmployee(empNumber, body);
}
