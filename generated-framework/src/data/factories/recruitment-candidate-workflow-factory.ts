import type { APIResponse } from '@playwright/test';
import type { RecruitmentCandidateWorkflowClient } from '../../api/clients/RecruitmentCandidateWorkflowClient';
import type { ScheduleInterviewForACandidateRequest } from '../testData/RecruitmentCandidateWorkflow.types.generated';

/**
 * Precondition/setup helpers for Recruitment/Candidate Workflow, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function scheduleInterviewForACandidate(client: RecruitmentCandidateWorkflowClient, candidateId: number, overrides: Partial<ScheduleInterviewForACandidateRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as ScheduleInterviewForACandidateRequest;
  return client.scheduleInterviewForACandidate(candidateId, body);
}
