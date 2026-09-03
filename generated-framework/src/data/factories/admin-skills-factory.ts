import type { APIResponse } from '@playwright/test';
import type { AdminSkillsClient } from '../../api/clients/AdminSkillsClient';
import type { CreateASkillRequest } from '../testData/AdminSkills.types.generated';

/**
 * Precondition/setup helpers for Admin/Skills, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function createASkill(client: AdminSkillsClient, overrides: Partial<CreateASkillRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CreateASkillRequest;
  return client.createASkill(body);
}
