import type { APIResponse } from '@playwright/test';
import type { BuzzCommentsClient } from '../../api/clients/BuzzCommentsClient';
import type { CommentOnAPostRequest } from '../testData/BuzzComments.types.generated';

/**
 * Precondition/setup helpers for Buzz/Comments, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function commentOnAPost(client: BuzzCommentsClient, shareId: number, overrides: Partial<CommentOnAPostRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as CommentOnAPostRequest;
  return client.commentOnAPost(shareId, body, {});
}
