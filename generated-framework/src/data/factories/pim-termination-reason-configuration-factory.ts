import type { APIResponse } from '@playwright/test';
import type { PimTerminationReasonConfigurationClient } from '../../api/clients/PimTerminationReasonConfigurationClient';
import type { CreateATerminationReasonRequest } from '../testData/PimTerminationReasonConfiguration.types.generated';

/**
 * Precondition/setup helpers for PIM/Termination Reason Configuration, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createATerminationReason(client: PimTerminationReasonConfigurationClient, overrides: Partial<CreateATerminationReasonRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateATerminationReasonRequest;
  return client.createATerminationReason(body);
}
