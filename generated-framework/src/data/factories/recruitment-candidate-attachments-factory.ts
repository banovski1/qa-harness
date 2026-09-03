import type { APIResponse } from '@playwright/test';
import type { RecruitmentCandidateAttachmentsClient } from '../../api/clients/RecruitmentCandidateAttachmentsClient';
import type { AddAnAttachmentToACandidateRequest } from '../testData/RecruitmentCandidateAttachments.types.generated';

/**
 * Precondition/setup helpers for Recruitment/Candidate Attachments, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnAttachmentToACandidate(client: RecruitmentCandidateAttachmentsClient, overrides: Partial<AddAnAttachmentToACandidateRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnAttachmentToACandidateRequest;
  return client.addAnAttachmentToACandidate(body);
}
