import type { APIResponse } from '@playwright/test';
import type { TimeEmployeeTimesheetClient } from '../../api/clients/TimeEmployeeTimesheetClient';
import type { CreateATimesheetForAnEmployeeRequest } from '../testData/TimeEmployeeTimesheet.types.generated';

/**
 * Precondition/setup helpers for Time/Employee Timesheet, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createATimesheetForAnEmployee(client: TimeEmployeeTimesheetClient, empNumber: number, overrides: Partial<CreateATimesheetForAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateATimesheetForAnEmployeeRequest;
  return client.createATimesheetForAnEmployee(empNumber, body);
}
