import type { APIResponse } from '@playwright/test';
import type { PimEmployeeMembershipClient } from '../../api/clients/PimEmployeeMembershipClient';
import type { AddAMembershipToAnEmployeeRequest } from '../testData/PimEmployeeMembership.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Membership, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAMembershipToAnEmployee(client: PimEmployeeMembershipClient, empNumber: number, overrides: Partial<AddAMembershipToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAMembershipToAnEmployeeRequest;
  return client.addAMembershipToAnEmployee(empNumber, body);
}
