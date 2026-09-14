// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for TimeSheetPeriod. */
export class TimeSheetPeriodApi {
  constructor(private readonly api: ApiClient) {}

  /** Get the Timesheet Period. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/time-sheet-period', params);
  }

  /** Update the Timesheet Period. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/time/time-sheet-period', params), data);
  }
}
