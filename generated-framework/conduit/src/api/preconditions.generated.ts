// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/conduit/app-model.json (dd99ed2cf3)

import { Api, idOf } from './resources.generated.ts';
import { uniqueName } from '../utils/unique-name.ts';

/**
 * Establishes state through the API, and remembers how to remove it.
 *
 * Each method is named after the sentence it makes true. Dependencies are stated,
 * never resolved automatically: a helper that quietly created three other records
 * would make a failing test impossible to read.
 */
export class Preconditions {
  private readonly created: { label: string; undo: () => Promise<void> }[] = [];

  constructor(private readonly api: Api) {}

  /** Makes true: an Article exists. */
  async article(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.article.create(payload);
    const id = idOf(response, 'slug');
    this.created.push({
      label: `Article ${id}`,
      undo: () => this.api.article.remove({ slug: id }),
    });
    return { id, data: response };
  }

  /** Makes true: a User exists. */
  async user(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.user.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for User: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Undo everything this test made, newest first. Failures are reported, never thrown. */
  async cleanup(): Promise<void> {
    for (const record of [...this.created].reverse()) {
      try {
        await record.undo();
      } catch (error) {
        console.warn(`cleanup failed for ${record.label}: ${(error as Error).message.split('\n')[0]}`);
      }
    }
    this.created.length = 0;
  }
}
