// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

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

  /** Makes true: a Booking exists. */
  async booking(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.booking.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for Booking: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Makes true: an EventType exists. */
  async eventType(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.eventType.create(payload);
    const id = idOf(response, 'eventTypeId');
    this.created.push({
      label: `EventType ${id}`,
      undo: () => this.api.eventType.remove({ eventTypeId: id }),
    });
    return { id, data: response };
  }

  /** Makes true: an OauthClient exists. */
  async oauthClient(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.oauthClient.create(payload);
    const id = idOf(response, 'clientId');
    this.created.push({
      label: `OauthClient ${id}`,
      undo: () => this.api.oauthClient.remove({ clientId: id }),
    });
    return { id, data: response };
  }

  /** Makes true: a Reservation exists. */
  async reservation(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.reservation.create(payload);
    const id = idOf(response, 'uid');
    this.created.push({
      label: `Reservation ${id}`,
      undo: () => this.api.reservation.remove({ uid: id }),
    });
    return { id, data: response };
  }

  /** Makes true: a Save exists. */
  async save(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.save.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for Save: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Makes true: a Schedule exists. */
  async schedule(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.schedule.create(payload);
    const id = idOf(response, 'scheduleId');
    this.created.push({
      label: `Schedule ${id}`,
      undo: () => this.api.schedule.remove({ scheduleId: id }),
    });
    return { id, data: response };
  }

  /** Makes true: a Webhook exists. */
  async webhook(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.webhook.create(payload);
    const id = idOf(response, 'webhookId');
    this.created.push({
      label: `Webhook ${id}`,
      undo: () => this.api.webhook.remove({ webhookId: id }),
    });
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
