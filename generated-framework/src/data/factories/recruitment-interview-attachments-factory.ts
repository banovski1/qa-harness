import type { APIResponse } from '@playwright/test';
import type { RecruitmentInterviewAttachmentsClient } from '../../api/clients/RecruitmentInterviewAttachmentsClient';
import type { AddAnAttachmentToAnInterviewRequest } from '../testData/RecruitmentInterviewAttachments.types.generated';

/**
 * Precondition/setup helpers for Recruitment/Interview Attachments, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnAttachmentToAnInterview(client: RecruitmentInterviewAttachmentsClient, interviewId: number, overrides: Partial<AddAnAttachmentToAnInterviewRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnAttachmentToAnInterviewRequest;
  return client.addAnAttachmentToAnInterview(interviewId, body);
}
