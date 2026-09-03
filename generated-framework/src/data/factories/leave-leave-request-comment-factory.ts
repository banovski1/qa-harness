import type { APIResponse } from '@playwright/test';
import type { LeaveLeaveRequestCommentClient } from '../../api/clients/LeaveLeaveRequestCommentClient';
import type { CommentOnALeaveRequestRequest } from '../testData/LeaveLeaveRequestComment.types.generated';

/**
 * Precondition/setup helpers for Leave/Leave Request Comment, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function commentOnALeaveRequest(client: LeaveLeaveRequestCommentClient, leaveRequestId: number, overrides: Partial<CommentOnALeaveRequestRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CommentOnALeaveRequestRequest;
  return client.commentOnALeaveRequest(leaveRequestId, body);
}
