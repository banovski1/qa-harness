import type { APIResponse } from '@playwright/test';
import type { RecruitmentVacancyAttachmentsClient } from '../../api/clients/RecruitmentVacancyAttachmentsClient';
import type { AddAnAttachmentToAVacancyRequest } from '../testData/RecruitmentVacancyAttachments.types.generated';

/**
 * Precondition/setup helpers for Recruitment/Vacancy Attachments, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnAttachmentToAVacancy(client: RecruitmentVacancyAttachmentsClient, overrides: Partial<AddAnAttachmentToAVacancyRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnAttachmentToAVacancyRequest;
  return client.addAnAttachmentToAVacancy(body);
}
