// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Action endpoints only: a POST here leaves nothing to read back. */
export class CsvImportApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Import Employee Records.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: attachment.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/csv-import', data);
  }
}
