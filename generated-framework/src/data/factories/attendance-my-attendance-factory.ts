import type { APIResponse } from '@playwright/test';
import type { AttendanceMyAttendanceClient } from '../../api/clients/AttendanceMyAttendanceClient';
import type { CreateMyAttendanceRecordRequest } from '../testData/AttendanceMyAttendance.types.generated';

/**
 * Precondition/setup helpers for Attendance/My Attendance, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createMyAttendanceRecord(client: AttendanceMyAttendanceClient, overrides: Partial<CreateMyAttendanceRecordRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateMyAttendanceRecordRequest;
  return client.createMyAttendanceRecord(body);
}
