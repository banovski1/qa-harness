// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: a Tracker exists.
 *  Requires: Employee — create those first. */
export class TrackerApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Performance Trackers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/config/trackers', params);
  }

  /** Get a Performance Tracker. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/performance/config/trackers/{id}', params));
  }

  /**
   * Create a Performance Tracker.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: trackerName, empNumber, reviewers.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/performance/config/trackers', data);
  }

  /** Update a Performance Tracker. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/performance/config/trackers/{id}', params), data);
  }

  /** Delete Performance Trackers. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/performance/config/trackers', params));
  }

  /** Remove Logs from a Performance Tracker. */
  async deleteLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs', params), { data });
  }

  /** List Logs for a Performance Tracker. */
  async getLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs', params), { data });
  }

  /** Create a Log for a Performance Tracker. */
  async postLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs', params), { data });
  }

  /** Get a Log from a Performance Tracker. */
  async getLogsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs/{id}', params), { data });
  }

  /** Update a Log from a Performance Tracker. */
  async putLogsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs/{id}', params), { data });
  }
}
