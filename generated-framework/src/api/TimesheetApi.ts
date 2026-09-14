// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Timesheet. */
export class TimesheetApi {
  constructor(private readonly api: ApiClient) {}

  /** Get a Timesheet's Entries. */
  async getEntries<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/employees/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Update a Timesheet's Entries. */
  async putEntries<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/employees/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Get a Timesheet's Action Logs. */
  async getActionLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/action-logs', params), { data });
  }

  /** List My Timesheet Entries. */
  async getEntries2<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Update My Timesheet Entries. */
  async putEntries2<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Update a Timesheet Comment. */
  async putEntriesComment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries/comment', params), { data });
  }

  /** Get a Timesheet Comment. */
  async getEntriesComment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries/{id}/comment', params), { data });
  }
}
