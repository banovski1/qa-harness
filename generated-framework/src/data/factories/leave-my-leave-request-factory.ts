import type { APIResponse } from '@playwright/test';
import type { LeaveMyLeaveRequestClient } from '../../api/clients/LeaveMyLeaveRequestClient';
import type { ApplyForLeaveRequest } from '../testData/LeaveMyLeaveRequest.types.generated';

/**
 * Precondition/setup helpers for Leave/My Leave Request, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function applyForLeave(client: LeaveMyLeaveRequestClient, overrides: Partial<ApplyForLeaveRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as ApplyForLeaveRequest;
  return client.applyForLeave(body, {});
}
