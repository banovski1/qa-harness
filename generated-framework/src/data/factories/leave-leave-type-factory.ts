import type { APIResponse } from '@playwright/test';
import type { LeaveLeaveTypeClient } from '../../api/clients/LeaveLeaveTypeClient';
import type { CreateALeaveTypeRequest } from '../testData/LeaveLeaveType.types.generated';

/**
 * Precondition/setup helpers for Leave/Leave Type, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createALeaveType(client: LeaveLeaveTypeClient, overrides: Partial<CreateALeaveTypeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateALeaveTypeRequest;
  return client.createALeaveType(body);
}
