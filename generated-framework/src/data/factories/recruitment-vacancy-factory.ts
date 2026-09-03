import type { APIResponse } from '@playwright/test';
import type { RecruitmentVacancyClient } from '../../api/clients/RecruitmentVacancyClient';
import type { CreateAVacancyRequest } from '../testData/RecruitmentVacancy.types.generated';

/**
 * Precondition/setup helpers for Recruitment/Vacancy, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createAVacancy(client: RecruitmentVacancyClient, overrides: Partial<CreateAVacancyRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateAVacancyRequest;
  return client.createAVacancy(body);
}
