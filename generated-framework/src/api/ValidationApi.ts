// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Validation. */
export class ValidationApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Project Acitvity Uniqueness in Timesheet. */
  async getProjectActivity<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/validation/{timesheetId}/project-activity', params), { data });
  }
}
