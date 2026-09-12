// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/espocrm-demo/app-model.json (8b4f900085)

import type { Locator, Page } from '@playwright/test';
import { BaseComponent, type ComponentContext } from './base/BaseComponent.ts';

/** navigation region — 19 controls shared across 60 screens. This class owns the only selector for this region. */
export class NavigationBar extends BaseComponent {
  constructor(page: Page, context: ComponentContext = {}) {
    super(page, 'NavigationBar', context);
  }

  locator(): Locator {
    return this.page.locator('#navbar');
  }

  get home(): Locator {
    return this.locator().getByRole('link', { name: 'Home', exact: true });
  }

  get accounts(): Locator {
    return this.locator().getByRole('link', { name: 'Accounts', exact: true });
  }

  get contacts(): Locator {
    return this.locator().getByRole('link', { name: 'Contacts', exact: true });
  }

  get leads(): Locator {
    return this.locator().getByRole('link', { name: 'Leads', exact: true });
  }

  get opportunities(): Locator {
    return this.locator().getByRole('link', { name: 'Opportunities', exact: true });
  }

  get emails(): Locator {
    return this.locator().getByRole('link', { name: 'Emails', exact: true });
  }

  get calendar(): Locator {
    return this.locator().getByRole('link', { name: 'Calendar', exact: true });
  }

  get meetings(): Locator {
    return this.locator().getByRole('link', { name: 'Meetings', exact: true });
  }

  get calls(): Locator {
    return this.locator().getByRole('link', { name: 'Calls', exact: true });
  }

  get tasks(): Locator {
    return this.locator().getByRole('link', { name: 'Tasks', exact: true });
  }

  get cases(): Locator {
    return this.locator().getByRole('link', { name: 'Cases', exact: true });
  }

  get knowledgeBase(): Locator {
    return this.locator().getByRole('link', { name: 'Knowledge Base', exact: true });
  }

  get documents(): Locator {
    return this.locator().getByRole('link', { name: 'Documents', exact: true });
  }

  get salesPurchases(): Locator {
    return this.locator().getByRole('button', { name: 'Sales & Purchases', exact: true });
  }

  get search(): Locator {
    return this.locator().getByRole('searchbox', { name: 'Search', exact: true });
  }

  get lastViewed(): Locator {
    return this.locator().getByRole('button', { name: 'Last Viewed', exact: true });
  }

  get create(): Locator {
    return this.locator().getByRole('button', { name: 'Create', exact: true });
  }

  get notifications(): Locator {
    return this.locator().getByRole('button', { name: 'Notifications', exact: true });
  }

  get menu(): Locator {
    return this.locator().getByRole('button', { name: 'Menu', exact: true });
  }

  /** Click one of this region's controls by name, with the shared diagnostics. */
  async click(control: 'home' | 'accounts' | 'contacts' | 'leads' | 'opportunities' | 'emails' | 'calendar' | 'meetings' | 'calls' | 'tasks' | 'cases' | 'knowledgeBase' | 'documents' | 'salesPurchases' | 'search' | 'lastViewed' | 'create' | 'notifications' | 'menu'): Promise<void> {
    await this.act(`click ${control}`, async () => {
      await (this as unknown as Record<string, Locator>)[control].click();
    });
  }

  async goToAccounts(): Promise<void> {
    await this.click('accounts');
  }

  async goToContacts(): Promise<void> {
    await this.click('contacts');
  }

  async goToLeads(): Promise<void> {
    await this.click('leads');
  }

  async goToOpportunities(): Promise<void> {
    await this.click('opportunities');
  }

  async goToEmails(): Promise<void> {
    await this.click('emails');
  }

  async goToCalendar(): Promise<void> {
    await this.click('calendar');
  }

  async goToMeetings(): Promise<void> {
    await this.click('meetings');
  }

  async goToCalls(): Promise<void> {
    await this.click('calls');
  }

  async goToTasks(): Promise<void> {
    await this.click('tasks');
  }

  async goToCases(): Promise<void> {
    await this.click('cases');
  }
}
