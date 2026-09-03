import type { APIResponse } from '@playwright/test';
import type { LeaveLeaveCommentClient } from '../../api/clients/LeaveLeaveCommentClient';
import type { CommentOnALeaveRequest } from '../testData/LeaveLeaveComment.types.generated';

/**
 * Precondition/setup helpers for Leave/Leave Comment, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function commentOnALeave(client: LeaveLeaveCommentClient, leaveId: number, overrides: Partial<CommentOnALeaveRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CommentOnALeaveRequest;
  return client.commentOnALeave(leaveId, body);
}
