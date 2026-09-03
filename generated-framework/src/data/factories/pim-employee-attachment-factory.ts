import type { APIResponse } from '@playwright/test';
import type { PimEmployeeAttachmentClient } from '../../api/clients/PimEmployeeAttachmentClient';
import type { AddAnAttachmentToAnEmployeeOnAScreenRequest } from '../testData/PimEmployeeAttachment.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Attachment, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addAnAttachmentToAnEmployeeOnAScreen(client: PimEmployeeAttachmentClient, empNumber: number, screen: string, overrides: Partial<AddAnAttachmentToAnEmployeeOnAScreenRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddAnAttachmentToAnEmployeeOnAScreenRequest;
  return client.addAnAttachmentToAnEmployeeOnAScreen(empNumber, screen, body);
}
