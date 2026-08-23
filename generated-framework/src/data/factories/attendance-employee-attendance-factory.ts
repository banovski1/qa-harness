import type { APIResponse } from '@playwright/test';
import type { AttendanceEmployeeAttendanceClient } from '../../api/clients/AttendanceEmployeeAttendanceClient';
import type { CreateAnEmployeesAttendanceRecordRequest } from '../testData/AttendanceEmployeeAttendance.types.generated';

/**
 * Precondition/setup helpers for Attendance/Employee Attendance, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAnEmployeesAttendanceRecord(client: AttendanceEmployeeAttendanceClient, empNumber: number, overrides: Partial<CreateAnEmployeesAttendanceRecordRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAnEmployeesAttendanceRecordRequest;
  return client.createAnEmployeesAttendanceRecord(empNumber, body);
}
