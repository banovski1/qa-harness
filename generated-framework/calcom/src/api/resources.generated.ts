// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/calcom/app-model.json (b0a34f21c9)

import { ApiClient, fillPath, idOf } from './ApiClient.ts';
import type { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/constants.ts';

/** Creating one makes true: a Booking exists.
 */
export class BookingApi {
  constructor(private readonly api: ApiClient) {}

  /** Get all bookings. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/bookings', params);
  }

  /** Get a booking. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/bookings/{bookingUid}', params));
  }

  /**
   * Create a booking.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/bookings', data);
  }

  /** Get all attendees for a booking. */
  async getAttendees<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/bookings/{bookingUid}/attendees', params), { data });
  }

  /** Add an attendee to a booking. */
  async postAttendees<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/bookings/{bookingUid}/attendees', params), { data });
  }

  /** Remove an attendee from a booking. */
  async deleteAttendeesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/bookings/{bookingUid}/attendees/{attendeeId}', params), { data });
  }

  /** Get a specific attendee for a booking. */
  async getAttendeesById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/bookings/{bookingUid}/attendees/{attendeeId}', params), { data });
  }

  /** Get 'Add to Calendar' links for a booking. */
  async getCalendarLinks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/bookings/{bookingUid}/calendar-links', params), { data });
  }

  /** Cancel a booking. */
  async postCancel<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/bookings/{bookingUid}/cancel', params), { data });
  }

  /** Get Video Meeting Sessions. Only supported for Cal Video. */
  async getConferencingSessions<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/bookings/{bookingUid}/conferencing-sessions', params), { data });
  }

  /** Confirm a booking. */
  async postConfirm<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/bookings/{bookingUid}/confirm', params), { data });
  }

  /** Decline a booking. */
  async postDecline<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/bookings/{bookingUid}/decline', params), { data });
  }

  /** Add guests to an existing booking. */
  async postGuests<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/bookings/{bookingUid}/guests', params), { data });
  }

  /** Update booking location for an existing booking. */
  async patchLocation<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/bookings/{bookingUid}/location', params), { data });
  }

  /** Mark a booking absence. */
  async postMarkAbsent<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/bookings/{bookingUid}/mark-absent', params), { data });
  }
}

/** Read-only: this API declares no create for BusyTime.
 */
export class BusyTimeApi {
  constructor(private readonly api: ApiClient) {}

  /** Get busy times. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/calendars/busy-times', params);
  }
}

/** Read-only: this API declares no create for BySeat.
 */
export class BySeatApi {
  constructor(private readonly api: ApiClient) {}

  /** Get a booking by seat UID. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/bookings/by-seat/{seatUid}', params));
  }
}

/** Read-only: this API declares no create for Calendar.
 */
export class CalendarApi {
  constructor(private readonly api: ApiClient) {}

  /** Get all calendars. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/calendars', params);
  }

  /** Check a calendar connection. */
  async getCheck<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/{calendar}/check', params), { data });
  }

  /** Get OAuth connect URL. */
  async getConnect<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/{calendar}/connect', params), { data });
  }

  /** Save Apple calendar credentials. */
  async postCredentials<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/calendars/{calendar}/credentials', params), { data });
  }

  /** Disconnect a calendar. */
  async postDisconnect<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/calendars/{calendar}/disconnect', params), { data });
  }

  /** Get meeting details from calendar. */
  async getEventById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/{calendar}/event/{eventUid}', params), { data });
  }

  /** Update meeting details in calendar. */
  async patchEventById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/calendars/{calendar}/event/{eventUid}', params), { data });
  }

  /** List calendar events. */
  async getEvents<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/{calendar}/events', params), { data });
  }

  /** Create a calendar event. */
  async postEvents<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/calendars/{calendar}/events', params), { data });
  }

  /** Delete a calendar event. */
  async deleteEventsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/calendars/{calendar}/events/{eventUid}', params), { data });
  }

  /** Get meeting details from calendar. */
  async getEventsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/{calendar}/events/{eventUid}', params), { data });
  }

  /** Update meeting details in calendar. */
  async patchEventsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/calendars/{calendar}/events/{eventUid}', params), { data });
  }

  /** Get free/busy times. */
  async getFreebusy<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/{calendar}/freebusy', params), { data });
  }
}

/** Read-only: this API declares no create for Check.
 */
export class CheckApi {
  constructor(private readonly api: ApiClient) {}

  /** Check an ICS feed. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/calendars/ics-feed/check', params);
  }
}

/** Read-only: this API declares no create for Client.
 */
export class ClientApi {
  constructor(private readonly api: ApiClient) {}

  /** Get OAuth2 client. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/auth/oauth2/clients/{clientId}', params));
  }
}

/** Read-only: this API declares no create for Conferencing.
 */
export class ConferencingApi {
  constructor(private readonly api: ApiClient) {}

  /** List your conferencing applications. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/conferencing', params);
  }

  /** Connect your conferencing application. */
  async postConnect<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/conferencing/{app}/connect', params), { data });
  }

  /** Set your default conferencing application. */
  async postDefault<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/conferencing/{app}/default', params), { data });
  }

  /** Disconnect your conferencing application. */
  async deleteDisconnect<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/conferencing/{app}/disconnect', params), { data });
  }

  /** Get OAuth conferencing app auth URL. */
  async getOauthAuthUrl<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/conferencing/{app}/oauth/auth-url', params), { data });
  }

  /** Conferencing app OAuth callback. */
  async getOauthCallback<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/conferencing/{app}/oauth/callback', params), { data });
  }
}

/** Read-only: this API declares no create for Connect.
 */
export class ConnectApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Stripe connect URL. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/stripe/connect', params);
  }
}

/** Read-only: this API declares no create for Connection.
 */
export class ConnectionApi {
  constructor(private readonly api: ApiClient) {}

  /** List calendar connections. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/calendars/connections', params);
  }

  /** List events for a connection. */
  async getEvents<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/connections/{connectionId}/events', params), { data });
  }

  /** Create event on a connection. */
  async postEvents<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/calendars/connections/{connectionId}/events', params), { data });
  }

  /** Delete event for a connection. */
  async deleteEventsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/calendars/connections/{connectionId}/events/{eventId}', params), { data });
  }

  /** Get event for a connection. */
  async getEventsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/connections/{connectionId}/events/{eventId}', params), { data });
  }

  /** Update event for a connection. */
  async patchEventsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/calendars/connections/{connectionId}/events/{eventId}', params), { data });
  }

  /** Get free/busy for a connection. */
  async getFreebusy<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/calendars/connections/{connectionId}/freebusy', params), { data });
  }
}

/** Read-only: this API declares no create for Default.
 */
export class DefaultApi {
  constructor(private readonly api: ApiClient) {}

  /** Get your default conferencing application. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/conferencing/default', params);
  }
}

/** Read-only: this API declares no create for DestinationCalendar.
 */
export class DestinationCalendarApi {
  constructor(private readonly api: ApiClient) {}

  /** Update destination calendars. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/v2/destination-calendars', params), data);
  }
}

/** Read-only: this API declares no create for Email.
 */
export class EmailApi {
  constructor(private readonly api: ApiClient) {}

  /** Get list of verified emails. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/verified-resources/emails', params);
  }

  /** Get verified email by id. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/verified-resources/emails/{id}', params));
  }
}

/** Creating one makes true: an EventType exists.
 */
export class EventTypeApi {
  constructor(private readonly api: ApiClient) {}

  /** Get all event types. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/event-types', params);
  }

  /** Get an event type. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/event-types/{eventTypeId}', params));
  }

  /**
   * Create an event type.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/event-types', data);
  }

  /** Update an event type. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.patch<T>(fillPath('/v2/event-types/{eventTypeId}', params), data);
  }

  /** Delete an event type. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/v2/event-types/{eventTypeId}', params));
  }

  /** Get all private links for an event type. */
  async getPrivateLinks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/event-types/{eventTypeId}/private-links', params), { data });
  }

  /** Create a private link for an event type. */
  async postPrivateLinks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/event-types/{eventTypeId}/private-links', params), { data });
  }

  /** Delete a private link for an event type. */
  async deletePrivateLinksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/event-types/{eventTypeId}/private-links/{linkId}', params), { data });
  }

  /** Update a private link for an event type. */
  async patchPrivateLinksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/event-types/{eventTypeId}/private-links/{linkId}', params), { data });
  }

  /** Delete all webhooks. */
  async deleteWebhooks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/event-types/{eventTypeId}/webhooks', params), { data });
  }

  /** Get all webhooks. */
  async getWebhooks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/event-types/{eventTypeId}/webhooks', params), { data });
  }

  /** Create a webhook. */
  async postWebhooks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/event-types/{eventTypeId}/webhooks', params), { data });
  }

  /** Delete a webhook. */
  async deleteWebhooksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/event-types/{eventTypeId}/webhooks/{webhookId}', params), { data });
  }

  /** Get a webhook. */
  async getWebhooksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/event-types/{eventTypeId}/webhooks/{webhookId}', params), { data });
  }

  /** Update a webhook. */
  async patchWebhooksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/event-types/{eventTypeId}/webhooks/{webhookId}', params), { data });
  }
}

/** Read-only: this API declares no create for Me.
 */
export class MeApi {
  constructor(private readonly api: ApiClient) {}

  /** Get my profile. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/me', params);
  }

  /** Update my profile. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.patch<T>(fillPath('/v2/me', params), data);
  }
}

/** Read-only: this API declares no create for Oauth.
 */
export class OauthApi {
  constructor(private readonly api: ApiClient) {}

  /** Refresh managed user tokens. */
  async postRefresh<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/oauth/{clientId}/refresh', params), { data });
  }
}

/** Creating one makes true: an OauthClient exists.
 */
export class OauthClientApi {
  constructor(private readonly api: ApiClient) {}

  /** Get all OAuth clients. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/oauth-clients', params);
  }

  /** Get an OAuth client. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/oauth-clients/{clientId}', params));
  }

  /**
   * Create an OAuth client.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/oauth-clients', data);
  }

  /** Update an OAuth client. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.patch<T>(fillPath('/v2/oauth-clients/{clientId}', params), data);
  }

  /** Delete an OAuth client. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/v2/oauth-clients/{clientId}', params));
  }

  /** Get all managed users. */
  async getUsers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/oauth-clients/{clientId}/users', params), { data });
  }

  /** Create a managed user. */
  async postUsers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/oauth-clients/{clientId}/users', params), { data });
  }

  /** Delete a managed user. */
  async deleteUsersById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/oauth-clients/{clientId}/users/{userId}', params), { data });
  }

  /** Get a managed user. */
  async getUsersById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/oauth-clients/{clientId}/users/{userId}', params), { data });
  }

  /** Update a managed user. */
  async patchUsersById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/oauth-clients/{clientId}/users/{userId}', params), { data });
  }

  /** Force refresh tokens. */
  async postUsersForceRefresh<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/oauth-clients/{clientId}/users/{userId}/force-refresh', params), { data });
  }

  /** Delete all webhooks. */
  async deleteWebhooks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/oauth-clients/{clientId}/webhooks', params), { data });
  }

  /** Get all webhooks. */
  async getWebhooks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/oauth-clients/{clientId}/webhooks', params), { data });
  }

  /** Create a webhook. */
  async postWebhooks<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/v2/oauth-clients/{clientId}/webhooks', params), { data });
  }

  /** Delete a webhook. */
  async deleteWebhooksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/v2/oauth-clients/{clientId}/webhooks/{webhookId}', params), { data });
  }

  /** Get a webhook. */
  async getWebhooksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/v2/oauth-clients/{clientId}/webhooks/{webhookId}', params), { data });
  }

  /** Update a webhook. */
  async patchWebhooksById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PATCH', fillPath('/v2/oauth-clients/{clientId}/webhooks/{webhookId}', params), { data });
  }
}

/** Read-only: this API declares no create for Phone.
 */
export class PhoneApi {
  constructor(private readonly api: ApiClient) {}

  /** Get list of verified phone numbers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/verified-resources/phones', params);
  }

  /** Get verified phone number by id. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/verified-resources/phones/{id}', params));
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class RefreshApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Refresh API Key.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/api-keys/refresh', data);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class RequestApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Request email verification code.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/verified-resources/emails/verification-code/request', data);
  }
}

/** Creating one makes true: a Reservation exists.
 */
export class ReservationApi {
  constructor(private readonly api: ApiClient) {}

  /** Get reserved slot. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/slots/reservations/{uid}', params));
  }

  /**
   * Reserve a slot.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/slots/reservations', data);
  }

  /** Update a reserved slot. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.patch<T>(fillPath('/v2/slots/reservations/{uid}', params), data);
  }

  /** Delete a reserved slot. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/v2/slots/reservations/{uid}', params));
  }
}

/** Creating one makes true: a Save exists.
 */
export class SaveApi {
  constructor(private readonly api: ApiClient) {}

  /** Save Stripe credentials. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/stripe/save', params);
  }

  /**
   * Save an ICS feed.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/calendars/ics-feed/save', data);
  }
}

/** Creating one makes true: a Schedule exists.
 */
export class ScheduleApi {
  constructor(private readonly api: ApiClient) {}

  /** Get all schedules. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/schedules', params);
  }

  /** Get a schedule. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/schedules/{scheduleId}', params));
  }

  /**
   * Create a schedule.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/schedules', data);
  }

  /** Update a schedule. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.patch<T>(fillPath('/v2/schedules/{scheduleId}', params), data);
  }

  /** Delete a schedule. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/v2/schedules/{scheduleId}', params));
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class SelectedCalendarApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Add a selected calendar.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/selected-calendars', data);
  }

  /** Delete a selected calendar. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/v2/selected-calendars', params));
  }
}

/** Read-only: this API declares no create for Slot.
 */
export class SlotApi {
  constructor(private readonly api: ApiClient) {}

  /** Get available time slots for an event type. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/slots', params);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class TokenApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Exchange authorization code or refresh token for tokens.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/auth/oauth2/token', data);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class VerifyApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Verify an email.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/verified-resources/emails/verification-code/verify', data);
  }
}

/** Creating one makes true: a Webhook exists.
 */
export class WebhookApi {
  constructor(private readonly api: ApiClient) {}

  /** Get all webhooks. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/v2/webhooks', params);
  }

  /** Get a webhook. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/v2/webhooks/{webhookId}', params));
  }

  /**
   * Create a webhook.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: $ref.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/v2/webhooks', data);
  }

  /** Update a webhook. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.patch<T>(fillPath('/v2/webhooks/{webhookId}', params), data);
  }

  /** Delete a webhook. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/v2/webhooks/{webhookId}', params));
  }
}

/** Every resource the API declares, on one object. */
export class Api {
  readonly http: ApiClient;
  readonly booking: BookingApi;
  readonly busyTime: BusyTimeApi;
  readonly bySeat: BySeatApi;
  readonly calendar: CalendarApi;
  readonly check: CheckApi;
  readonly client: ClientApi;
  readonly conferencing: ConferencingApi;
  readonly connect: ConnectApi;
  readonly connection: ConnectionApi;
  readonly default: DefaultApi;
  readonly destinationCalendar: DestinationCalendarApi;
  readonly email: EmailApi;
  readonly eventType: EventTypeApi;
  readonly me: MeApi;
  readonly oauth: OauthApi;
  readonly oauthClient: OauthClientApi;
  readonly phone: PhoneApi;
  readonly refresh: RefreshApi;
  readonly request: RequestApi;
  readonly reservation: ReservationApi;
  readonly save: SaveApi;
  readonly schedule: ScheduleApi;
  readonly selectedCalendar: SelectedCalendarApi;
  readonly slot: SlotApi;
  readonly token: TokenApi;
  readonly verify: VerifyApi;
  readonly webhook: WebhookApi;

  constructor(request: APIRequestContext, baseUrl = BASE_URL) {
    this.http = new ApiClient(request, baseUrl);
    this.booking = new BookingApi(this.http);
    this.busyTime = new BusyTimeApi(this.http);
    this.bySeat = new BySeatApi(this.http);
    this.calendar = new CalendarApi(this.http);
    this.check = new CheckApi(this.http);
    this.client = new ClientApi(this.http);
    this.conferencing = new ConferencingApi(this.http);
    this.connect = new ConnectApi(this.http);
    this.connection = new ConnectionApi(this.http);
    this.default = new DefaultApi(this.http);
    this.destinationCalendar = new DestinationCalendarApi(this.http);
    this.email = new EmailApi(this.http);
    this.eventType = new EventTypeApi(this.http);
    this.me = new MeApi(this.http);
    this.oauth = new OauthApi(this.http);
    this.oauthClient = new OauthClientApi(this.http);
    this.phone = new PhoneApi(this.http);
    this.refresh = new RefreshApi(this.http);
    this.request = new RequestApi(this.http);
    this.reservation = new ReservationApi(this.http);
    this.save = new SaveApi(this.http);
    this.schedule = new ScheduleApi(this.http);
    this.selectedCalendar = new SelectedCalendarApi(this.http);
    this.slot = new SlotApi(this.http);
    this.token = new TokenApi(this.http);
    this.verify = new VerifyApi(this.http);
    this.webhook = new WebhookApi(this.http);
  }
}

export { idOf };
