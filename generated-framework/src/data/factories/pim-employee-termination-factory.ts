import type { APIResponse } from '@playwright/test';
import type { PimEmployeeTerminationClient } from '../../api/clients/PimEmployeeTerminationClient';
import type { TerminateAnEmployeeRequest } from '../testData/PimEmployeeTermination.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Termination, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function terminateAnEmployee(client: PimEmployeeTerminationClient, empNumber: number, overrides: Partial<TerminateAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as TerminateAnEmployeeRequest;
  return client.terminateAnEmployee(empNumber, body);
}
