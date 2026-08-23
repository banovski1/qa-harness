import type { APIResponse } from '@playwright/test';
import type { PimEmployeeEmergencyContactClient } from '../../api/clients/PimEmployeeEmergencyContactClient';
import type { AddAnEmergencyContactToAnEmployeeRequest } from '../testData/PimEmployeeEmergencyContact.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Emergency Contact, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnEmergencyContactToAnEmployee(client: PimEmployeeEmergencyContactClient, empNumber: number, overrides: Partial<AddAnEmergencyContactToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnEmergencyContactToAnEmployeeRequest;
  return client.addAnEmergencyContactToAnEmployee(empNumber, body);
}
