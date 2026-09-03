import type { APIResponse } from '@playwright/test';
import type { RecruitmentCandidatesClient } from '../../api/clients/RecruitmentCandidatesClient';
import type { CreateACandidateRequest } from '../testData/RecruitmentCandidates.types.generated';

/**
 * Precondition/setup helpers for Recruitment/Candidates, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createACandidate(client: RecruitmentCandidatesClient, overrides: Partial<CreateACandidateRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateACandidateRequest;
  return client.createACandidate(body);
}
