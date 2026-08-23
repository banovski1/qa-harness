import type { APIResponse } from '@playwright/test';
import type { LeaveEmployeeLeaveRequestClient } from '../../api/clients/LeaveEmployeeLeaveRequestClient';
import type { CreateALeaveRequestRequest } from '../testData/LeaveEmployeeLeaveRequest.types.generated';

/**
 * Precondition/setup helpers for Leave/Employee Leave Request, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createALeaveRequest(client: LeaveEmployeeLeaveRequestClient, overrides: Partial<CreateALeaveRequestRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateALeaveRequestRequest;
  return client.createALeaveRequest(body, {});
}
