import type { APIResponse } from '@playwright/test';
import type { TimeMyTimesheetClient } from '../../api/clients/TimeMyTimesheetClient';
import type { CreateMyTimesheetRequest } from '../testData/TimeMyTimesheet.types.generated';

/**
 * Precondition/setup helpers for Time/My Timesheet, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createMyTimesheet(client: TimeMyTimesheetClient, overrides: Partial<CreateMyTimesheetRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateMyTimesheetRequest;
  return client.createMyTimesheet(body);
}
