// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { Api, idOf } from './Api.ts';
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

  /** Makes true: a Candidate exists. Needs an existing Vacancy — pass their ids in overrides. */
  async candidate(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { firstName: uniqueName('Candidate'), ...overrides };
    const response = await this.api.candidate.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Candidate ${id}`,
      undo: () => this.api.candidate.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Customer exists. */
  async customer(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Customer'), ...overrides };
    const response = await this.api.customer.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Customer ${id}`,
      undo: () => this.api.customer.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a CustomField exists. */
  async customField(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.customField.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `CustomField ${id}`,
      undo: () => this.api.customField.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Defined exists. */
  async defined(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Defined'), ...overrides };
    const response = await this.api.defined.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Defined ${id}`,
      undo: () => this.api.defined.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: an Education exists. */
  async education(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Education'), ...overrides };
    const response = await this.api.education.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Education ${id}`,
      undo: () => this.api.education.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: an Employee exists. */
  async employee(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { lastName: uniqueName('Employee'), ...overrides };
    const response = await this.api.employee.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Employee ${id}`,
      undo: () => this.api.employee.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: an EmploymentStatus exists. */
  async employmentStatus(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('EmploymentStatus'), ...overrides };
    const response = await this.api.employmentStatus.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `EmploymentStatus ${id}`,
      undo: () => this.api.employmentStatus.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: an Event exists. */
  async event(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Event'), ...overrides };
    const response = await this.api.event.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Event ${id}`,
      undo: () => this.api.event.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Holiday exists. */
  async holiday(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Holiday'), ...overrides };
    const response = await this.api.holiday.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Holiday ${id}`,
      undo: () => this.api.holiday.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a JobCategory exists. */
  async jobCategory(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('JobCategory'), ...overrides };
    const response = await this.api.jobCategory.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `JobCategory ${id}`,
      undo: () => this.api.jobCategory.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a JobTitle exists. */
  async jobTitle(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { title: uniqueName('JobTitle'), ...overrides };
    const response = await this.api.jobTitle.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `JobTitle ${id}`,
      undo: () => this.api.jobTitle.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Kpis exists. Needs an existing JobTitle — pass their ids in overrides. */
  async kpis(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { title: uniqueName('Kpis'), ...overrides };
    const response = await this.api.kpis.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Kpis ${id}`,
      undo: () => this.api.kpis.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Language exists. */
  async language(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Language'), ...overrides };
    const response = await this.api.language.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Language ${id}`,
      undo: () => this.api.language.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a LeaveEntitlement exists. Needs an existing Employee and LeaveType and Location — pass their ids in overrides. */
  async leaveEntitlement(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.leaveEntitlement.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `LeaveEntitlement ${id}`,
      undo: () => this.api.leaveEntitlement.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a LeaveRequest exists. Needs an existing Employee and LeaveType — pass their ids in overrides. */
  async leaveRequest(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.leaveRequest.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for LeaveRequest: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Makes true: a LeaveType exists. */
  async leaveType(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('LeaveType'), ...overrides };
    const response = await this.api.leaveType.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `LeaveType ${id}`,
      undo: () => this.api.leaveType.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Licens exists. */
  async licens(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Licens'), ...overrides };
    const response = await this.api.licens.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Licens ${id}`,
      undo: () => this.api.licens.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Location exists. */
  async location(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Location'), ...overrides };
    const response = await this.api.location.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Location ${id}`,
      undo: () => this.api.location.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Membership exists. */
  async membership(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Membership'), ...overrides };
    const response = await this.api.membership.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Membership ${id}`,
      undo: () => this.api.membership.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Nationality exists. */
  async nationality(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Nationality'), ...overrides };
    const response = await this.api.nationality.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Nationality ${id}`,
      undo: () => this.api.nationality.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: an OauthClient exists. */
  async oauthClient(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('OauthClient'), ...overrides };
    const response = await this.api.oauthClient.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `OauthClient ${id}`,
      undo: () => this.api.oauthClient.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: an OpenidProvider exists. */
  async openidProvider(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('OpenidProvider'), ...overrides };
    const response = await this.api.openidProvider.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `OpenidProvider ${id}`,
      undo: () => this.api.openidProvider.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a PayGrade exists. */
  async payGrade(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('PayGrade'), ...overrides };
    const response = await this.api.payGrade.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `PayGrade ${id}`,
      undo: () => this.api.payGrade.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Post exists. */
  async post(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.post.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for Post: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Makes true: a Project exists. Needs an existing Customer — pass their ids in overrides. */
  async project(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Project'), ...overrides };
    const response = await this.api.project.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Project ${id}`,
      undo: () => this.api.project.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Registration exists. Needs an existing Subunit — pass their ids in overrides. */
  async registration(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.registration.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Registration ${id}`,
      undo: () => this.api.registration.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a ReportingMethod exists. */
  async reportingMethod(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('ReportingMethod'), ...overrides };
    const response = await this.api.reportingMethod.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `ReportingMethod ${id}`,
      undo: () => this.api.reportingMethod.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Request exists. */
  async request(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.request.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for Request: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Makes true: a Review exists. Needs an existing Employee — pass their ids in overrides. */
  async review(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.review.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Review ${id}`,
      undo: () => this.api.review.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Skill exists. */
  async skill(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Skill'), ...overrides };
    const response = await this.api.skill.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Skill ${id}`,
      undo: () => this.api.skill.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Subunit exists. */
  async subunit(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Subunit'), ...overrides };
    const response = await this.api.subunit.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Subunit ${id}`,
      undo: () => this.api.subunit.remove({ id: id }),
    });
    return { id, data: response };
  }

  /** Makes true: a TerminationReason exists. */
  async terminationReason(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('TerminationReason'), ...overrides };
    const response = await this.api.terminationReason.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `TerminationReason ${id}`,
      undo: () => this.api.terminationReason.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Tracker exists. Needs an existing Employee — pass their ids in overrides. */
  async tracker(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.tracker.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Tracker ${id}`,
      undo: () => this.api.tracker.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a Type exists. */
  async type(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Type'), ...overrides };
    const response = await this.api.type.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Type ${id}`,
      undo: () => this.api.type.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a User exists. Needs an existing Employee — pass their ids in overrides. */
  async user(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { username: uniqueName('User'), ...overrides };
    const response = await this.api.user.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `User ${id}`,
      undo: () => this.api.user.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a UserSync exists. */
  async userSync(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { ...overrides };
    const response = await this.api.userSync.create(payload);
    const id = idOf(response, 'id');
    // The API declares no delete for UserSync: this record cannot be cleaned up.
    return { id, data: response };
  }

  /** Makes true: a Vacancy exists. Needs an existing Employee and JobTitle — pass their ids in overrides. */
  async vacancy(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('Vacancy'), ...overrides };
    const response = await this.api.vacancy.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `Vacancy ${id}`,
      undo: () => this.api.vacancy.remove({  }),
    });
    return { id, data: response };
  }

  /** Makes true: a WorkShift exists. Needs an existing Employee — pass their ids in overrides. */
  async workShift(overrides: Record<string, unknown> = {}): Promise<{ id: string | number; data: any }> {
    const payload = { name: uniqueName('WorkShift'), ...overrides };
    const response = await this.api.workShift.create(payload);
    const id = idOf(response, 'id');
    this.created.push({
      label: `WorkShift ${id}`,
      undo: () => this.api.workShift.remove({  }),
    });
    return { id, data: response };
  }

  /**
   * Undo everything this test made, newest first.
   *
   * A cleanup failure is reported and not thrown, because a test that already
   * passed should not be failed by its own teardown. Pass `strict` to invert
   * that: the round-trip gate needs a delete that quietly removes nothing to be
   * an error, since a silent no-op is the exact defect it exists to catch.
   */
  async cleanup({ strict = false }: { strict?: boolean } = {}): Promise<void> {
    const failures: string[] = [];
    for (const record of [...this.created].reverse()) {
      try {
        await record.undo();
      } catch (error) {
        const detail = `${record.label}: ${(error as Error).message.split('\n')[0]}`;
        failures.push(detail);
        if (!strict) console.warn(`cleanup failed for ${detail}`);
      }
    }
    this.created.length = 0;
    if (strict && failures.length) {
      throw new Error(`${failures.length} record(s) could not be removed:\n  ${failures.join('\n  ')}`);
    }
  }
}
