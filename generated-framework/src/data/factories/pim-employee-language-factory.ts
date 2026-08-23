import type { APIResponse } from '@playwright/test';
import type { PimEmployeeLanguageClient } from '../../api/clients/PimEmployeeLanguageClient';
import type { AddALanguageToAnEmployeeRequest } from '../testData/PimEmployeeLanguage.types.generated';

/**
 * Precondition/setup helpers for PIM/Employee Language, backed by the typed API client
 * instead of the browser. Fill in real field values per creator below — the
 * api-map only knows the request shape, not what makes a valid record here.
 * Written once by the generator; never overwritten.
 */

export async function addALanguageToAnEmployee(client: PimEmployeeLanguageClient, empNumber: number, overrides: Partial<AddALanguageToAnEmployeeRequest> = {}): Promise<APIResponse> {
  // TODO: fill in required fields with sensible defaults, then spread overrides.
  const body = { ...overrides } as AddALanguageToAnEmployeeRequest;
  return client.addALanguageToAnEmployee(empNumber, body);
}
