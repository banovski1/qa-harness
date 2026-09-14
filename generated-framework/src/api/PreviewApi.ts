// Generated once from analysis.json (56e23b3b09) on 2026-09-13.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Action endpoints only: a POST here leaves nothing to read back. */
export class PreviewApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Preview Theme.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: primaryColor, primaryFontColor, secondaryColor, secondaryFontColor, primaryGradientStartColor, primaryGradientEndColor.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/theme/preview', data);
  }
}
