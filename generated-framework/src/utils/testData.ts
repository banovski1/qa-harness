import { randomUUID } from 'node:crypto';

/**
 * Unique values for anything a test creates.
 *
 * Tests that share a record cannot run in parallel: one edits what another is
 * asserting on, and the failure surfaces as a flake rather than as the
 * collision it is. A timestamp is not enough — two workers can start inside the
 * same millisecond — so these are UUID-backed.
 */
export function uniqueSuffix(): string {
  return randomUUID().replace(/-/g, '').slice(0, 10);
}

export function uniqueUsername(prefix = 'qa'): string {
  return `${prefix}.${uniqueSuffix()}`;
}

export function uniqueEmail(prefix = 'qa', domain = 'example.com'): string {
  return `${prefix}.${uniqueSuffix()}@${domain}`;
}

export function uniqueName(prefix: string): string {
  return `${prefix} ${uniqueSuffix()}`;
}
