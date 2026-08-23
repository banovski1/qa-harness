import type { APIResponse } from '@playwright/test';
import type { PimEmployeeSalaryClient } from '../../api/clients/PimEmployeeSalaryClient';
import type { AddASalaryComponentToAnEmployeeRequest } from '../testData/PimEmployeeSalary.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Salary, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addASalaryComponentToAnEmployee(client: PimEmployeeSalaryClient, empNumber: number, overrides: Partial<AddASalaryComponentToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddASalaryComponentToAnEmployeeRequest;
  return client.addASalaryComponentToAnEmployee(empNumber, body);
}
