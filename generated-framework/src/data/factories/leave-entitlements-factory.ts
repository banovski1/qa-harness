import type { APIResponse } from '@playwright/test';
import type { LeaveEntitlementsClient } from '../../api/clients/LeaveEntitlementsClient';
import type { AssignLeaveEntitlementsToEmployeesRequest } from '../testData/LeaveEntitlements.types.generated';

/**
 * Precondition/setup helpers for Leave/Entitlements, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function assignLeaveEntitlementsToEmployees(client: LeaveEntitlementsClient, overrides: Partial<AssignLeaveEntitlementsToEmployeesRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AssignLeaveEntitlementsToEmployeesRequest;
  return client.assignLeaveEntitlementsToEmployees(body);
}
