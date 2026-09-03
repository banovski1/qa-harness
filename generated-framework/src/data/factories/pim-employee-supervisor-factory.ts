import type { APIResponse } from '@playwright/test';
import type { PimEmployeeSupervisorClient } from '../../api/clients/PimEmployeeSupervisorClient';
import type { AddASupervisorToAnEmployeeRequest } from '../testData/PimEmployeeSupervisor.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Supervisor, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addASupervisorToAnEmployee(client: PimEmployeeSupervisorClient, empNumber: number, overrides: Partial<AddASupervisorToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddASupervisorToAnEmployeeRequest;
  return client.addASupervisorToAnEmployee(empNumber, body);
}
