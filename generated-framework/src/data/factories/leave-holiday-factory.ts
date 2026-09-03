import type { APIResponse } from '@playwright/test';
import type { LeaveHolidayClient } from '../../api/clients/LeaveHolidayClient';
import type { CreateAHolidayRequest } from '../testData/LeaveHoliday.types.generated';

/**
 * Precondition/setup helpers for Leave/Holiday, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAHoliday(client: LeaveHolidayClient, overrides: Partial<CreateAHolidayRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAHolidayRequest;
  return client.createAHoliday(body);
}
