// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Read-only: this API declares no create for Purge. */
export class PurgeApi {
  constructor(private readonly api: ApiClient) {}

  /** Purge Candidate. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/maintenance/candidates/purge', params));
  }
}
