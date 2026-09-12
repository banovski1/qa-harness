// GENERATED — rewritten on every run. Put nothing here you want to keep.
// Source: analysis/orangehrm/app-model.json (56e23b3b09)

import { ApiClient, fillPath, idOf } from './ApiClient.ts';
import type { APIRequestContext } from '@playwright/test';
import { BASE_URL } from '../config/constants.ts';

/** Read-only: this API declares no create for About.
 */
export class AboutApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Basic Organization Details. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/core/about', params);
  }
}

/** Read-only: this API declares no create for ActionSummary.
 */
export class ActionSummaryApi {
  constructor(private readonly api: ApiClient) {}

  /** Get My Action Summary. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/dashboard/employees/action-summary', params);
  }
}

/** Read-only: this API declares no create for ActivityName.
 */
export class ActivityNameApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Project Activity Name Uniqueness. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/time/validation/activity-name/{id}', params));
  }
}

/** Read-only: this API declares no create for Anniversary.
 */
export class AnniversaryApi {
  constructor(private readonly api: ApiClient) {}

  /** List Upcoming Employee Anniversaries. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/buzz/anniversaries', params);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 *  Requires: Candidate — create those first. */
export class AttachmentApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Add an Attachment to a Candidate.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: candidateId, attachment.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/recruitment/candidate/attachments', data);
  }

  /** Delete Vacancy Attachments. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/recruitment/vacancy/attachments', params));
  }
}

/** Read-only: this API declares no create for Bulk.
 */
export class BulkApi {
  constructor(private readonly api: ApiClient) {}

  /** Bulk Approve/Cancel/Reject Leave Requests. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/employees/leave-requests/bulk', params), data);
  }
}

/** Creating one makes true: a Candidate exists.
 *  Requires: Vacancy — create those first. */
export class CandidateApi {
  constructor(private readonly api: ApiClient) {}

  /** List Purgeable Candidates for a Vacancy. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/maintenance/candidates', params);
  }

  /** Get a Candidate. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/recruitment/candidates/{id}', params));
  }

  /**
   * Create a Candidate.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: firstName, middleName, lastName, email, contactNumber, vacancyId, keywords, comment, dateOfApplication, consentToKeepData.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/recruitment/candidates', data);
  }

  /** Update a Candidate. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/recruitment/candidates/{id}', params), data);
  }

  /** Delete Candidates. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/recruitment/candidates', params));
  }

  /** Get a Candidate's Attachment. */
  async getAttachment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidate/{candidateId}/attachment', params), { data });
  }

  /** Update a Candidate's Attachment. */
  async putAttachment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidate/{candidateId}/attachment', params), { data });
  }

  /** Update a Candidate's Interview. */
  async putInterview<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidate/{candidateId}/interview/{interviewId}', params), { data });
  }

  /** Get Allowed Actions for Candidate. */
  async getAllowed<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/actions/allowed', params), { data });
  }

  /** Hire Candidate. */
  async putHire<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/hire', params), { data });
  }

  /** List a Candidate's History. */
  async getHistory<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/history', params), { data });
  }

  /** Get a Candidate's History Record. */
  async getHistory<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/history/{historyId}', params), { data });
  }

  /** Update a Candidate's History Record. */
  async putHistory<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/history/{historyId}', params), { data });
  }

  /** Get a Candidate's Inteview. */
  async getInterview<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/interview/{interviewId}', params), { data });
  }

  /** Mark Candidate Interview as Failed. */
  async putFail<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/fail', params), { data });
  }

  /** Mark Candidate Interview as Passed. */
  async putPass<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/interviews/{interviewId}/pass', params), { data });
  }

  /** Decline Job Offer for Candidate. */
  async putDecline<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/candidates/{candidateId}/job/decline', params), { data });
  }
}

/** Read-only: this API declares no create for Comment.
 */
export class CommentApi {
  constructor(private readonly api: ApiClient) {}

  /** Unlike a Liked Comment. */
  async deleteLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/buzz/comments/{commentId}/likes', params), { data });
  }

  /** List Likes on a Comment. */
  async getLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/comments/{commentId}/likes', params), { data });
  }

  /** Like a Comment. */
  async postLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/buzz/comments/{commentId}/likes', params), { data });
  }
}

/** Read-only: this API declares no create for Config.
 */
export class ConfigApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Workspace notification config. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/workspace-notification/config', params);
  }

  /** Update Workspace notification config. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/workspace-notification/config', params), data);
  }
}

/** Read-only: this API declares no create for Count.
 */
export class CountApi {
  constructor(private readonly api: ApiClient) {}

  /** Get the Number of Employees. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/employees/count', params);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class CsvImportApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Import Employee Records.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: attachment.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/csv-import', data);
  }
}

/** Read-only: this API declares no create for CurrentDatetime.
 */
export class CurrentDatetimeApi {
  constructor(private readonly api: ApiClient) {}

  /** Get the Current Date & Time. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/current-datetime', params);
  }
}

/** Creating one makes true: a Customer exists.
 */
export class CustomerApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Customers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/customers', params);
  }

  /** Get a Customer. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/time/customers/{id}', params));
  }

  /**
   * Create a Customer.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, description.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/time/customers', data);
  }

  /** Update a Customer. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/time/customers/{id}', params), data);
  }

  /** Delete Customers. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/time/customers', params));
  }
}

/** Read-only: this API declares no create for CustomerName.
 */
export class CustomerNameApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Customer Name Uniqueness. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/validation/customer-name', params);
  }
}

/** Creating one makes true: a CustomField exists.
 */
export class CustomFieldApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Custom Fields. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/custom-fields', params);
  }

  /** Get a Custom Field. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/pim/custom-fields/{id}', params));
  }

  /**
   * Create a Custom Field.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: fieldName, fieldType, screen, extraData.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/custom-fields', data);
  }

  /** Update a Custom Field. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/custom-fields/{id}', params), data);
  }

  /** Delete Custom Fields. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/custom-fields', params));
  }
}

/** Read-only: this API declares no create for Datum.
 */
export class DatumApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Leave Report Data. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/reports/data', params);
  }
}

/** Read-only: this API declares no create for Default.
 */
export class DefaultApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Default Timesheet. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/timesheets/default', params);
  }
}

/** Creating one makes true: a Defined exists.
 */
export class DefinedApi {
  constructor(private readonly api: ApiClient) {}

  /** List All PIM Reports. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/reports/defined', params);
  }

  /**
   * Create a PIM Report.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, include, criteria, y, operator, fieldGroup, includeHeader.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/reports/defined', data);
  }

  /** Update a PIM Report. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/reports/defined/{id}', params), data);
  }

  /** Delete PIM Reports. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/reports/defined', params));
  }
}

/** Creating one makes true: an Education exists.
 */
export class EducationApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Education Records. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/educations', params);
  }

  /** Get an Education Record. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/educations/{id}', params));
  }

  /**
   * Create an Education Record.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/educations', data);
  }

  /** Update an Education Record. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/educations/{id}', params), data);
  }

  /** Delete Education Records. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/educations', params));
  }
}

/** Read-only: this API declares no create for Eligible.
 */
export class EligibleApi {
  constructor(private readonly api: ApiClient) {}

  /** Get My Eligible Leave Types. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/leave-types/eligible', params);
  }
}

/** Read-only: this API declares no create for EmailConfiguration.
 */
export class EmailConfigurationApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Email Configuration. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/email-configuration', params);
  }

  /** Update Email Configuration. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/email-configuration', params), data);
  }
}

/** Read-only: this API declares no create for EmailSubscription.
 */
export class EmailSubscriptionApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Email Subscriptions. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/email-subscriptions', params);
  }

  /** Update an Email Subscription. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/email-subscriptions/{id}', params), data);
  }

  /** Delete Email Subscribers. */
  async deleteSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', params), { data });
  }

  /** List All Email Subscribers. */
  async getSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', params), { data });
  }

  /** Create an Email Subscriber. */
  async postSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers', params), { data });
  }

  /** Get an Email Subscriber. */
  async getSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}', params), { data });
  }

  /** Update an Email Susbcriber. */
  async putSubscribers<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/admin/email-subscriptions/{emailSubscriptionId}/subscribers/{id}', params), { data });
  }
}

/** Creating one makes true: an Employee exists.
 */
export class EmployeeApi {
  constructor(private readonly api: ApiClient) {}

  /** List Employees Unassigned to Work Shift. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/work-shifts/employees', params);
  }

  /** Get an Employee Directory Listing. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/directory/employees/{empNumber}', params));
  }

  /**
   * Create an Employee.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: lastName, firstName, middleName, employeeId, empPicture.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/employees', data);
  }

  /** Delete Employees. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/employees', params));
  }

  /** Delete an Employee's Attendance Records. */
  async deleteRecords<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/attendance/employees/{empNumber}/records', params), { data });
  }

  /** List an Employee's Attendance Records. */
  async getRecords<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/attendance/employees/{empNumber}/records', params), { data });
  }

  /** Create an Employee's Attendance Record. */
  async postRecords<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/attendance/employees/{empNumber}/records', params), { data });
  }

  /** Update an Employee's Attendance Record. */
  async putRecords<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/attendance/employees/{empNumber}/records', params), { data });
  }

  /** List an Employee's Claim Requests. */
  async postRequests<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/claim/employees/{empNumber}/requests', params), { data });
  }

  /** Get an Employee's Claim Request. */
  async getRequests<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/employees/{empNumber}/requests/{id}', params), { data });
  }

  /** Get an Employee's Leave Entitlement. */
  async getLeaveEntitlements<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/employees/{empNumber}/leave-entitlements', params), { data });
  }

  /** Get an Employee's Contact Details. */
  async getContactDetails<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employee/{empNumber}/contact-details', params), { data });
  }

  /** Update an Employee's Contact Details. */
  async putContactDetails<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/pim/employee/{empNumber}/contact-details', params), { data });
  }

  /** Validate an Employee's Other Email. */
  async getOtherEmails<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employees/{empNumber}/contact-details/validation/other-emails', params), { data });
  }

  /** Validate an Employee's Work Email. */
  async getWorkEmails<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employees/{empNumber}/contact-details/validation/work-emails', params), { data });
  }

  /** List an Employee's Custom Fields. */
  async getCustomFields<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employees/{empNumber}/custom-fields', params), { data });
  }
}

/** Read-only: this API declares no create for EmployeeOnLeaveToday.
 */
export class EmployeeOnLeaveTodayApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Employees on Leave Today Configuration. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/dashboard/config/employee-on-leave-today', params);
  }

  /** Configure Employees on Leave Today. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/dashboard/config/employee-on-leave-today', params), data);
  }
}

/** Creating one makes true: an EmploymentStatus exists.
 */
export class EmploymentStatusApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Employment Statuses. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/employment-statuses', params);
  }

  /** Get an Employment Status. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/employment-statuses/{id}', params));
  }

  /**
   * Create an Employment Status.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/employment-statuses', data);
  }

  /** Update an Employment Status. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/employment-statuses/{id}', params), data);
  }

  /** Delete Employment Statuses. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/employment-statuses', params));
  }
}

/** Creating one makes true: an Event exists.
 */
export class EventApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Claim Events. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/claim/events', params);
  }

  /** Get a Claim Event. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/claim/events/{id}', params));
  }

  /**
   * Create a Claim Event.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, description, status.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/claim/events', data);
  }

  /** Update a Claim Event. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/claim/events/{id}', params), data);
  }

  /** Delete Claim Events. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/claim/events', params));
  }
}

/** Read-only: this API declares no create for Feed.
 */
export class FeedApi {
  constructor(private readonly api: ApiClient) {}

  /** List the Buzz Feed. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/buzz/feed', params);
  }
}

/** Read-only: this API declares no create for Group.
 */
export class GroupApi {
  constructor(private readonly api: ApiClient) {}

  /** List All I18N Groups. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/i18n/groups', params);
  }
}

/** Read-only: this API declares no create for HiringManager.
 */
export class HiringManagerApi {
  constructor(private readonly api: ApiClient) {}

  /** List Available Employees for Hiring Manager. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/recruitment/hiring-managers', params);
  }
}

/** Creating one makes true: a Holiday exists.
 */
export class HolidayApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Holidays. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/holidays', params);
  }

  /** Get a Holiday. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/holidays/{id}', params));
  }

  /**
   * Create a Holiday.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: date, length, name, recurring.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/holidays', data);
  }

  /** Update a Holiday. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/holidays/{id}', params), data);
  }

  /** Delete Holidays. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/leave/holidays', params));
  }
}

/** Read-only: this API declares no create for Interview.
 */
export class InterviewApi {
  constructor(private readonly api: ApiClient) {}

  /** Delete Interview Attachments. */
  async deleteAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments', params), { data });
  }

  /** List All Interview Attachments. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments', params), { data });
  }

  /** Add an Attachment to an Interview. */
  async postAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments', params), { data });
  }

  /** Get an Interview Attachment. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}', params), { data });
  }

  /** Update an Interview Attachment. */
  async putAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/interviews/{interviewId}/attachments/{attachmentId}', params), { data });
  }
}

/** Read-only: this API declares no create for Interviwer.
 */
export class InterviwerApi {
  constructor(private readonly api: ApiClient) {}

  /** List Employees Available for Interviewing. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/recruitment/interviwers', params);
  }
}

/** Creating one makes true: a JobCategory exists.
 */
export class JobCategoryApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Job Categories. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/job-categories', params);
  }

  /** Get a Job Category. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/job-categories/{id}', params));
  }

  /**
   * Create a Job Category.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/job-categories', data);
  }

  /** Update a Job Category. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/job-categories/{id}', params), data);
  }

  /** Delete Job Categories. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/job-categories', params));
  }
}

/** Creating one makes true: a JobTitle exists.
 */
export class JobTitleApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Job Titles. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/job-titles', params);
  }

  /** Get a Job Title. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/job-titles/{id}', params));
  }

  /**
   * Create a Job Title.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: title, description, note, specification.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/job-titles', data);
  }

  /** Update a Job Title. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/job-titles/{id}', params), data);
  }

  /** Delete Job Titles. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/job-titles', params));
  }

  /** Get Job Specification. */
  async getSpecification<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/job-titles/{id}/specification', params), { data });
  }
}

/** Creating one makes true: a Kpis exists.
 *  Requires: JobTitle — create those first. */
export class KpisApi {
  constructor(private readonly api: ApiClient) {}

  /** List All KPIs. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/kpis', params);
  }

  /** Get a KPI. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/performance/kpis/{id}', params));
  }

  /**
   * Create a KPI.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: title, jobTitleId, minRating, maxRating, isDefault.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/performance/kpis', data);
  }

  /** Update a KPI. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/performance/kpis/{id}', params), data);
  }

  /** Delete KPIs. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/performance/kpis', params));
  }
}

/** Creating one makes true: a Language exists.
 */
export class LanguageApi {
  constructor(private readonly api: ApiClient) {}

  /** List All I18N Languages. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/i18n/languages', params);
  }

  /** Get an I18N Language. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/i18n/languages/{id}', params));
  }

  /**
   * Create a Language Record.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/languages', data);
  }

  /** Update an I18N Language. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/i18n/languages/{id}', params), data);
  }

  /** Delete an I18N Language. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/i18n/languages', params));
  }

  /** Import I18N language. */
  async postImport<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/import', params), { data });
  }

  /** List All I18N Translations. */
  async getTranslations<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/translations', params), { data });
  }

  /** Bulk Update I18N Translations. */
  async putBulk<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/translations/bulk', params), { data });
  }

  /** List I18N Import Errors. */
  async getErrors<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/i18n/languages/{languageId}/translations/errors', params), { data });
  }
}

/** Read-only: this API declares no create for Latest.
 */
export class LatestApi {
  constructor(private readonly api: ApiClient) {}

  /** Get the Latest Attendance Record. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/records/latest', params);
  }
}

/** Read-only: this API declares no create for LdapConfig.
 */
export class LdapConfigApi {
  constructor(private readonly api: ApiClient) {}

  /** Get LDAP Configuration. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/ldap-config', params);
  }

  /** Update LDAP Configuration. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/ldap-config', params), data);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 *  Requires: Employee — create those first. */
export class LdapTestConnectionApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Test LDAP Connection.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: hostname, port, encryption, ldapImplementation, bindAnonymously, bindUserDN, bindUserPassword, userLookupSettings, searchScope, userNameAttribute, userSearchFilter, userUniqueIdAttribute, employeeSelectorMapping, dataMapping, middleName, lastName, userStatus, workEmail, employeeId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/ldap-test-connection', data);
  }
}

/** Read-only: this API declares no create for Leave.
 */
export class LeaveApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Employees on Leave Today. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/dashboard/employees/leaves', params);
  }

  /** Update a Leave. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leaves/{leaveId}', params), data);
  }

  /** List All Comments for a Leave. */
  async getLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leaves/{leaveId}/leave-comments', params), { data });
  }

  /** Comment on a Leave. */
  async postLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/leave/leaves/{leaveId}/leave-comments', params), { data });
  }
}

/** Read-only: this API declares no create for LeaveBalance.
 */
export class LeaveBalanceApi {
  constructor(private readonly api: ApiClient) {}

  /** Get an Employee's Leave Balance. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/employees/leave-balances', params);
  }
}

/** Creating one makes true: a LeaveEntitlement exists.
 *  Requires: Employee, LeaveType, Location — create those first. */
export class LeaveEntitlementApi {
  constructor(private readonly api: ApiClient) {}

  /** List an Employee's Leave Entitlements. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/employees/leave-entitlements', params);
  }

  /** Get a Leave Entitlement. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/leave-entitlements/{id}', params));
  }

  /**
   * Assign Leave Entitlements to Employees.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: empNumber, entitlement, fromDate, toDate, leaveTypeId, bulkAssign, locationId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/leave-entitlements', data);
  }

  /** Update a Leave Entitlement. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leave-entitlements/{id}', params), data);
  }

  /** Delete Leave Entitlements. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/leave/leave-entitlements', params));
  }

  /** Validate Leave Entitlement. */
  async getEntitlements<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leave-entitlements/{id}/validation/entitlements', params), { data });
  }
}

/** Read-only: this API declares no create for LeavePeriod.
 */
export class LeavePeriodApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Current Leave Period. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/leave-period', params);
  }

  /** Update Leave Period. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leave-period', params), data);
  }
}

/** Creating one makes true: a LeaveRequest exists.
 *  Requires: Employee, LeaveType — create those first. */
export class LeaveRequestApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Leave Requests. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/employees/leave-requests', params);
  }

  /** Get a Leave Request. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/employees/leave-requests/{leaveRequestId}', params));
  }

  /**
   * Create a Leave Request.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: empNumber, leaveTypeId, fromDate, toDate, comment, partialOption, duration.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/employees/leave-requests', data);
  }

  /** Update a Leave Request. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/employees/leave-requests/{leaveRequestId}', params), data);
  }

  /** List Comments for a Leave Request. */
  async getLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leave-requests/{leaveRequestId}/leave-comments', params), { data });
  }

  /** Comment on a Leave Request. */
  async postLeaveComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/leave/leave-requests/{leaveRequestId}/leave-comments', params), { data });
  }

  /** List All Leaves in a Leave Request. */
  async getLeaves<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/leave/leave-requests/{leaveRequestId}/leaves', params), { data });
  }
}

/** Creating one makes true: a LeaveType exists.
 */
export class LeaveTypeApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Leave Types. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/leave-types', params);
  }

  /** Get Leave Balance for a Leave Type. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/leave/leave-balance/leave-type/{leaveTypeId}', params));
  }

  /**
   * Create a Leave Type.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, situational.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/leave/leave-types', data);
  }

  /** Update a Leave Type. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/leave-types/{id}', params), data);
  }

  /** Delete Leave Types. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/leave/leave-types', params));
  }
}

/** Creating one makes true: a Licens exists.
 */
export class LicensApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Licenses. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/licenses', params);
  }

  /** Get a License. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/licenses/{id}', params));
  }

  /**
   * Create a License.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/licenses', data);
  }

  /** Update a License. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/licenses/{id}', params), data);
  }

  /** Delete Licenses. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/licenses', params));
  }
}

/** Read-only: this API declares no create for Link.
 */
export class LinkApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Video Link. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/buzz/validation/links', params);
  }
}

/** Read-only: this API declares no create for List.
 */
export class ListApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Employee Timesheets. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/employees/timesheets/list', params);
  }
}

/** Read-only: this API declares no create for Localization.
 */
export class LocalizationApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Localization Settings. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/localization', params);
  }

  /** Update Localization Settings. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/localization}', params), data);
  }
}

/** Creating one makes true: a Location exists.
 */
export class LocationApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Locations. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/locations', params);
  }

  /** Get a Location. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/locations/{id}', params));
  }

  /**
   * Create a Location.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, countryCode, province, city, address, zipCode, phone, fax, note.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/locations', data);
  }

  /** Update a Location. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/locations/{id}', params), data);
  }

  /** Delete Locations. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/locations', params));
  }
}

/** Creating one makes true: a Membership exists.
 */
export class MembershipApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Memberships. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/memberships', params);
  }

  /** Get a Membership. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/memberships/{id}', params));
  }

  /**
   * Create a Membership.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/memberships', data);
  }

  /** Update a Membership. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/memberships/{id}', params), data);
  }

  /** Delete Memberships. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/memberships', params));
  }
}

/** Read-only: this API declares no create for Menus.
 */
export class MenusApi {
  constructor(private readonly api: ApiClient) {}

  /** List Mobile Menu Items. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/mobile/menus', params);
  }
}

/** Read-only: this API declares no create for Module.
 */
export class ModuleApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Modules. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/modules', params);
  }

  /** Update a Module. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/modules', params), data);
  }
}

/** Read-only: this API declares no create for Myself.
 */
export class MyselfApi {
  constructor(private readonly api: ApiClient) {}

  /** Get My Details. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/myself', params);
  }
}

/** Creating one makes true: a Nationality exists.
 */
export class NationalityApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Nationalities. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/nationalities', params);
  }

  /** Get a Nationality. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/nationalities/{id}', params));
  }

  /**
   * Create a Nationality.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/nationalities', data);
  }

  /** Update a Nationality. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/nationalities/{id}', params), data);
  }

  /** Delete Nationalities. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/nationalities', params));
  }
}

/** Creating one makes true: an OauthClient exists.
 */
export class OauthClientApi {
  constructor(private readonly api: ApiClient) {}

  /** List All OAuth Clients. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/oauth-clients', params);
  }

  /** Get an OAuth Client. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/oauth-client/{id}', params));
  }

  /**
   * Create an OAuth Client.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, redirectUri, enabled.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/oauth-clients', data);
  }

  /** Update an OAuth Client. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/oauth-client/{id}', params), data);
  }

  /** Delete OAuth Clients. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/oauth-clients', params));
  }
}

/** Creating one makes true: an OpenidProvider exists.
 */
export class OpenidProviderApi {
  constructor(private readonly api: ApiClient) {}

  /** List All OpenID Providers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/auth/openid-providers', params);
  }

  /** Get an OpenID Provider. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/auth/openid-providers/{id}', params));
  }

  /**
   * Create OpenID Provider.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, url, status, clientId, clientSecret.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/auth/openid-providers', data);
  }

  /** Update a OpenID Provider. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/auth/openid-providers/{id}', params), data);
  }

  /** Update OpenID Providers. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/auth/openid-providers', params));
  }
}

/** Read-only: this API declares no create for OptionalField.
 */
export class OptionalFieldApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Optional Field Configuration. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/optional-field', params);
  }

  /** Update Optional Field Configuration. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/optional-field', params), data);
  }
}

/** Read-only: this API declares no create for Organization.
 */
export class OrganizationApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Organization Details. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/organization', params);
  }

  /** Update Organization Details. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/organization', params), data);
  }
}

/** Read-only: this API declares no create for Overlap.
 */
export class OverlapApi {
  constructor(private readonly api: ApiClient) {}

  /** Check Punch In Overlap. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/punch-in/overlaps', params);
  }
}

/** Read-only: this API declares no create for OverlapLeave.
 */
export class OverlapLeaveApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Overlapping Leaves. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/overlap-leaves', params);
  }
}

/** Creating one makes true: a PayGrade exists.
 */
export class PayGradeApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Pay Grades. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/pay-grades', params);
  }

  /** Get a Pay Grade. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/pay-grades/{id}', params));
  }

  /**
   * Create a Pay Grade.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/pay-grades', data);
  }

  /** Update a Pay Grade. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/pay-grades/{id}', params), data);
  }

  /** Delete Pay Grades. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/pay-grades', params));
  }

  /** Delete Pay Grade Currencies. */
  async deleteCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies', params), { data });
  }

  /** List All Pay Grade Currencies. */
  async getCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies', params), { data });
  }

  /** Create a Pay Grade Currency. */
  async postCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies', params), { data });
  }

  /** List Allowed Currencies for Pay Grade. */
  async getAllowed<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies/allowed', params), { data });
  }

  /** Get a Pay Grade Currency. */
  async getCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies/{id}', params), { data });
  }

  /** Update a Pay Grade Currency. */
  async putCurrencies<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/admin/pay-grades/{payGradeId}/currencies/{id}', params), { data });
  }
}

/** Creating one makes true: a Post exists.
 */
export class PostApi {
  constructor(private readonly api: ApiClient) {}

  /** Get a Post. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/buzz/posts/{id}', params));
  }

  /**
   * Post Text, Photos or Video.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/buzz/posts', data);
  }

  /** Edit a Post. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/buzz/posts/{id}', params), data);
  }

  /** List All Shares of a Post. */
  async getShares<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/posts/{id}/shares', params), { data });
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class PreviewApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Preview Theme.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: primaryColor, primaryFontColor, secondaryColor, secondaryFontColor, primaryGradientStartColor, primaryGradientEndColor.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/theme/preview', data);
  }
}

/** Creating one makes true: a Project exists.
 *  Requires: Customer — create those first. */
export class ProjectApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Projects. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/projects', params);
  }

  /** Get a Project. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/time/projects/{id}', params));
  }

  /**
   * Crete a Project.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: customerId, name, description, projectAdminsEmpNumbers.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/time/projects', data);
  }

  /** Update a Project. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/time/projects/{id}', params), data);
  }

  /** Delete Projects. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/time/projects', params));
  }

  /** Delete a Project's Activities. */
  async deleteActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities', params), { data });
  }

  /** List a Project's Activities. */
  async getActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities', params), { data });
  }

  /** Add an Activity to a Project. */
  async postActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities', params), { data });
  }

  /** Get a Project's Activity. */
  async getActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities/{id}', params), { data });
  }

  /** Update a Project's Activity. */
  async putActivities<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/project/{projectId}/activities/{id}', params), { data });
  }

  /** List Copyable Activities Between Two Projects. */
  async getCopy<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}', params), { data });
  }

  /** Copy Activities From One Project. */
  async postCopy<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/time/projects/{toProjectId}/activities/copy/{fromProjectId}', params), { data });
  }
}

/** Read-only: this API declares no create for ProjectAdmin.
 */
export class ProjectAdminApi {
  constructor(private readonly api: ApiClient) {}

  /** List Available Employees for Project Admin. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/project-admins', params);
  }
}

/** Read-only: this API declares no create for ProjectName.
 */
export class ProjectNameApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Project Name Uniqueness. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/validation/project-name', params);
  }
}

/** Read-only: this API declares no create for PunchInOverlap.
 */
export class PunchInOverlapApi {
  constructor(private readonly api: ApiClient) {}

  /** Check Punch In Overlap (Editing). */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/records/punch-in-overlaps', params);
  }
}

/** Read-only: this API declares no create for PunchOutOverlap.
 */
export class PunchOutOverlapApi {
  constructor(private readonly api: ApiClient) {}

  /** Check Punch Out Overlap (Editing). */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/records/punch-out-overlaps', params);
  }
}

/** Read-only: this API declares no create for Purge.
 */
export class PurgeApi {
  constructor(private readonly api: ApiClient) {}

  /** Purge Candidate. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/maintenance/candidates/purge', params));
  }
}

/** Read-only: this API declares no create for Record.
 */
export class RecordApi {
  constructor(private readonly api: ApiClient) {}

  /** List an Attendance Record. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/attendance/records/{id}', params));
  }

  /** Update an Attendance Record. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/attendance/records/{id}', params), data);
  }
}

/** Creating one makes true: a Registration exists.
 *  Requires: Subunit — create those first. */
export class RegistrationApi {
  constructor(private readonly api: ApiClient) {}

  /** List Workspace notification registrations. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/workspace-notification/registrations', params);
  }

  /** Get one Workspace notification registration. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations/{id}', params));
  }

  /**
   * Create a Workspace notification registration.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: eventType, provider, webhookUrl, channelLabel, subunitIds, timezone, dailySendTime, active.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/workspace-notification/registrations', data);
  }

  /** Update a Workspace notification registration (partial update supported). */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations/{id}', params), data);
  }

  /** Delete one or more Workspace notification registrations. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations', params));
  }

  /** Send a test Slack notification using a saved registration's stored webhook. */
  async postTest<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/admin/workspace-notification/registrations/{id}/test', params), { data });
  }
}

/** Read-only: this API declares no create for Report.
 */
export class ReportApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Leave Report. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/reports', params);
  }
}

/** Creating one makes true: a ReportingMethod exists.
 */
export class ReportingMethodApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Reporting Methods. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/reporting-methods', params);
  }

  /** Get a Reporting Method. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/pim/reporting-methods/{id}', params));
  }

  /**
   * Create a Reporting Method.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/reporting-methods', data);
  }

  /** Update a Reporting Method. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/reporting-methods/{id}', params), data);
  }

  /** Delete Reporting Methods. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/reporting-methods', params));
  }
}

/** Creating one makes true: a Request exists.
 */
export class RequestApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Claim Requests. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/claim/employees/requests', params);
  }

  /** Get My Claim Request. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/claim/requests/{id}', params));
  }

  /**
   * Create My Claim Request.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: claimEventId, currencyId, remarks.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/claim/requests', data);
  }

  /** Perform an Action on a Claim Request. */
  async putAction<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/action', params), { data });
  }

  /** Remove Attachments from a Claim. */
  async deleteAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments', params), { data });
  }

  /** List Attachements on a Claim. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments', params), { data });
  }

  /** Add Attachments to a Claim. */
  async postAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments', params), { data });
  }

  /** View an Attachment on a Claim. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments/{id}', params), { data });
  }

  /** Update an Attachment on a Claim. */
  async putAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/attachments/{id}', params), { data });
  }

  /** Remove an Expense from a Claim. */
  async deleteExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses', params), { data });
  }

  /** List All Expenses from a Claim. */
  async getExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses', params), { data });
  }

  /** Add an Expense to a Claim. */
  async postExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses', params), { data });
  }

  /** Get an Expense from a Claim. */
  async getExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses/{id}', params), { data });
  }

  /** Update an Expense from a Claim. */
  async putExpenses<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/claim/requests/{requestId}/expenses/{id}', params), { data });
  }
}

/** Creating one makes true: a Review exists.
 *  Requires: Employee — create those first. */
export class ReviewApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Reviews. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/employees/reviews', params);
  }

  /** Get a Performance Review. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/performance/manage/reviews/{id}', params));
  }

  /**
   * Create a Performance Review.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: empNumber, reviewerEmpNumber, startDate, endDate, dueDate, activate.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/performance/manage/reviews', data);
  }

  /** Update a Performance Review. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/performance/manage/reviews/{id}', params), data);
  }

  /** Delete Performance Reviews. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/performance/manage/reviews', params));
  }

  /** Get Allowed Actions for Review. */
  async getAllowed<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/actions/allowed', params), { data });
  }

  /** Get the Employee's Evaluation in a Review. */
  async getEmployee<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/employee', params), { data });
  }

  /** Update the Employee's Evaluation in a Review. */
  async putEmployee<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/employee', params), { data });
  }

  /** Get a Finalized Performance Review. */
  async getFinal<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/final', params), { data });
  }

  /** Finalize Performance Review. */
  async putFinal<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/final', params), { data });
  }

  /** Get the Supervisor's Evaluation in a Review. */
  async getSupervisor<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/supervisor', params), { data });
  }

  /** Update the Supervisor's Evaluation in a Review. */
  async putSupervisor<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/evaluation/supervisor', params), { data });
  }

  /** List KPIs for a Review. */
  async getKpis<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/reviews/{reviewId}/kpis', params), { data });
  }
}

/** Read-only: this API declares no create for Reviewer.
 */
export class ReviewerApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Available Tracker Reviewers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/trackers/reviewers', params);
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class ShareApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Share a Post.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: text, shareId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/buzz/shares', data);
  }

  /** Edit a Share. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/buzz/shares/{id}', params), data);
  }

  /** Delete a Share. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/buzz/shares/{id}', params));
  }

  /** List All Comments on a Post. */
  async getComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments', params), { data });
  }

  /** Comment on a Post. */
  async postComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments', params), { data });
  }

  /** Delete a Comment on a Post. */
  async deleteComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments/{commentId}', params), { data });
  }

  /** Get a Comment on a Post. */
  async getComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments/{commentId}', params), { data });
  }

  /** Edit a Comment on a Post. */
  async putComments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/comments/{commentId}', params), { data });
  }

  /** Unlike a Liked Share/Post. */
  async deleteLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/likes', params), { data });
  }

  /** List Likes on a Share/Post. */
  async getLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/likes', params), { data });
  }

  /** Like a Share/Post. */
  async postLikes<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/buzz/shares/{shareId}/likes', params), { data });
  }
}

/** Read-only: this API declares no create for Shortcut.
 */
export class ShortcutApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Quick Launch Shortcuts. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/dashboard/shortcuts', params);
  }
}

/** Creating one makes true: a Skill exists.
 */
export class SkillApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Skills. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/skills', params);
  }

  /** Get a Skill. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/skills/{id}', params));
  }

  /**
   * Create a Skill.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, description.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/skills', data);
  }

  /** Update a Skill. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/skills/{id}', params), data);
  }

  /** Delete Skills. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/skills', params));
  }
}

/** Read-only: this API declares no create for Status.
 */
export class StatusApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Statuses. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/recruitment/candidates/status', params);
  }
}

/** Creating one makes true: a Subunit exists.
 */
export class SubunitApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Subunits. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/subunits', params);
  }

  /** Get a Subunit. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/subunits/{id}', params));
  }

  /**
   * Create a Subunit.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, description, parentId, unitId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/subunits', data);
  }

  /** Update a Subunit. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/subunits/{id}', params), data);
  }

  /** Delete Subunits. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/subunits/{id}', params));
  }
}

/** Read-only: this API declares no create for Summary.
 */
export class SummaryApi {
  constructor(private readonly api: ApiClient) {}

  /** Summarize Employee Attendance. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/employees/summary', params);
  }
}

/** Read-only: this API declares no create for Supervisor.
 */
export class SupervisorApi {
  constructor(private readonly api: ApiClient) {}

  /** List an Employee's Supervisors. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/supervisors', params);
  }
}

/** Creating one makes true: a TerminationReason exists.
 */
export class TerminationReasonApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Termination Reasons. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/pim/termination-reasons', params);
  }

  /** Get a Termination Reason. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/pim/termination-reasons/{id}', params));
  }

  /**
   * Create a Termination Reason.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/pim/termination-reasons', data);
  }

  /** Update a Termination Reason. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/termination-reasons/{id}', params), data);
  }

  /** Delete Termination Reasons. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/pim/termination-reasons', params));
  }
}

/** Action endpoints only: a POST here leaves nothing to read back.
 */
export class TestApi {
  constructor(private readonly api: ApiClient) {}

  /**
   * Send a test Slack notification using a provided webhook URL.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: eventType, webhookUrl, provider.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/workspace-notification/registrations/test', data);
  }
}

/** Read-only: this API declares no create for Theme.
 */
export class ThemeApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Theme Details. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/theme', params);
  }

  /** Edit Theme. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/theme', params), data);
  }

  /** Reset Theme. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/theme', params));
  }
}

/** Read-only: this API declares no create for TimeAtWork.
 */
export class TimeAtWorkApi {
  constructor(private readonly api: ApiClient) {}

  /** Get My Time at Work. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/dashboard/employees/time-at-work', params);
  }
}

/** Read-only: this API declares no create for TimeFormat.
 */
export class TimeFormatApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Timesheet Time Format. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/config/time-format', params);
  }
}

/** Read-only: this API declares no create for Timesheet.
 */
export class TimesheetApi {
  constructor(private readonly api: ApiClient) {}

  /** Get a Timesheet's Entries. */
  async getEntries<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/employees/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Update a Timesheet's Entries. */
  async putEntries<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/employees/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Get a Timesheet's Action Logs. */
  async getActionLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/action-logs', params), { data });
  }

  /** List My Timesheet Entries. */
  async getEntries<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Update My Timesheet Entries. */
  async putEntries<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries', params), { data });
  }

  /** Update a Timesheet Comment. */
  async putComment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries/comment', params), { data });
  }

  /** Get a Timesheet Comment. */
  async getComment<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/timesheets/{timesheetId}/entries/{id}/comment', params), { data });
  }
}

/** Read-only: this API declares no create for TimeSheetPeriod.
 */
export class TimeSheetPeriodApi {
  constructor(private readonly api: ApiClient) {}

  /** Get the Timesheet Period. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/time/time-sheet-period', params);
  }

  /** Update the Timesheet Period. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/time/time-sheet-period', params), data);
  }
}

/** Read-only: this API declares no create for Timezone.
 */
export class TimezoneApi {
  constructor(private readonly api: ApiClient) {}

  /** List Timezones. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/attendance/timezones', params);
  }
}

/** Creating one makes true: a Tracker exists.
 *  Requires: Employee — create those first. */
export class TrackerApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Performance Trackers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/config/trackers', params);
  }

  /** Get a Performance Tracker. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/performance/config/trackers/{id}', params));
  }

  /**
   * Create a Performance Tracker.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: trackerName, empNumber, reviewers.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/performance/config/trackers', data);
  }

  /** Update a Performance Tracker. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/performance/config/trackers/{id}', params), data);
  }

  /** Delete Performance Trackers. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/performance/config/trackers', params));
  }

  /** Remove Logs from a Performance Tracker. */
  async deleteLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('DELETE', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs', params), { data });
  }

  /** List Logs for a Performance Tracker. */
  async getLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs', params), { data });
  }

  /** Create a Log for a Performance Tracker. */
  async postLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('POST', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs', params), { data });
  }

  /** Get a Log from a Performance Tracker. */
  async getLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs/{id}', params), { data });
  }

  /** Update a Log from a Performance Tracker. */
  async putLogs<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/performance/trackers/{trackerId}/logs/{id}', params), { data });
  }
}

/** Read-only: this API declares no create for Trackers.
 */
export class TrackersApi {
  constructor(private readonly api: ApiClient) {}

  /** List My Performance Trackers. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/performance/trackers}', params);
  }
}

/** Read-only: this API declares no create for Translation.
 */
export class TranslationApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate I18N Translation. */
  async getValidate<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/admin/i18n/translation/{langStringId}/validate', params), { data });
  }
}

/** Creating one makes true: a Type exists.
 */
export class TypeApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Expense Types. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/claim/expenses/types', params);
  }

  /** Get an Expense Type. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/claim/expenses/types/{id}', params));
  }

  /**
   * Create an Expense Type.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, description, status.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/claim/expenses/types', data);
  }

  /** Update an Expense Type. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/claim/expenses/types/{id}', params), data);
  }

  /** Delete Expense Types. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/claim/expenses/types', params));
  }
}

/** Read-only: this API declares no create for Unique.
 */
export class UniqueApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Uniqueness. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/core/validation/unique', params);
  }
}

/** Read-only: this API declares no create for UpdatePassword.
 */
export class UpdatePasswordApi {
  constructor(private readonly api: ApiClient) {}

  /** Update Password. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/pim/update-password', params), data);
  }
}

/** Creating one makes true: a User exists.
 *  Requires: Employee — create those first. */
export class UserApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Users. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/users', params);
  }

  /** Get a User. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/users/{id}', params));
  }

  /**
   * Create a User.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: username, password, status, userRoleId, empNumber.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/users', data);
  }

  /** Update a User. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/users/{id}', params), data);
  }

  /** Delete Users. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/users', params));
  }
}

/** Read-only: this API declares no create for UserName.
 */
export class UserNameApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Username Uniqueness. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/validation/user-name', params);
  }
}

/** Creating one makes true: a UserSync exists.
 */
export class UserSyncApi {
  constructor(private readonly api: ApiClient) {}

  /** Get User Sync Details. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/ldap/user-sync', params);
  }

  /**
   * Sync LDAP User.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/ldap/user-sync', data);
  }
}

/** Creating one makes true: a Vacancy exists.
 *  Requires: Employee, JobTitle — create those first. */
export class VacancyApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Vacancies. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/recruitment/vacancies', params);
  }

  /** Get a Vacancy. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/recruitment/vacancies/{id}', params));
  }

  /**
   * Create a Vacancy.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, status, jobTitleId, isPublished, description, numOfPositions, employeeId.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/recruitment/vacancies', data);
  }

  /** Update a Vacancy. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/recruitment/vacancies/{id}', params), data);
  }

  /** Delete Vacancies. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/recruitment/vacancies', params));
  }

  /** Get a Vacancy Attachment. */
  async getAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/recruitment/vacancies/{vacancyId}/attachments', params), { data });
  }

  /** Update a Vacancy Attachment. */
  async putAttachments<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('PUT', fillPath('/web/index.php/api/v2/recruitment/vacancies/{vacancyId}/attachments/{attachmentId}', params), { data });
  }
}

/** Read-only: this API declares no create for Validation.
 */
export class ValidationApi {
  constructor(private readonly api: ApiClient) {}

  /** Validate Project Acitvity Uniqueness in Timesheet. */
  async getProjectActivity<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/time/validation/{timesheetId}/project-activity', params), { data });
  }
}

/** Creating one makes true: a WorkShift exists.
 *  Requires: Employee — create those first. */
export class WorkShiftApi {
  constructor(private readonly api: ApiClient) {}

  /** List All Work Shifts. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/admin/work-shifts', params);
  }

  /** Get a Work Shift. */
  async get<T = any>(params: Record<string, string | number>): Promise<T> {
    return this.api.get<T>(fillPath('/web/index.php/api/v2/admin/work-shifts/{id}', params));
  }

  /**
   * Create a Work Shift.
   *
   * The spec declares fields but not which are mandatory, so nothing is defaulted here.
   * Fields the spec declares: name, hoursPerDay, startTime, endTime, empNumbers.
   */
  async create<T = any>(data: Record<string, unknown>): Promise<T> {
    return this.api.post<T>('/web/index.php/api/v2/admin/work-shifts', data);
  }

  /** Update a Work Shift. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/admin/work-shifts/{id}', params), data);
  }

  /** Delete Work Shifts. */
  async remove(params: Record<string, string | number>): Promise<void> {
    await this.api.delete(fillPath('/web/index.php/api/v2/admin/work-shifts', params));
  }
}

/** Read-only: this API declares no create for Workweek.
 */
export class WorkweekApi {
  constructor(private readonly api: ApiClient) {}

  /** Get Work Week. */
  async list<T = any>(params?: Record<string, string | number | boolean>): Promise<T> {
    return this.api.get<T>('/web/index.php/api/v2/leave/workweek', params);
  }

  /** Update Work Week. */
  async update<T = any>(params: Record<string, string | number>, data: Record<string, unknown>): Promise<T> {
    return this.api.put<T>(fillPath('/web/index.php/api/v2/leave/workweek', params), data);
  }
}

/** Every resource the API declares, on one object. */
export class Api {
  readonly client: ApiClient;
  readonly about: AboutApi;
  readonly actionSummary: ActionSummaryApi;
  readonly activityName: ActivityNameApi;
  readonly anniversary: AnniversaryApi;
  readonly attachment: AttachmentApi;
  readonly bulk: BulkApi;
  readonly candidate: CandidateApi;
  readonly comment: CommentApi;
  readonly config: ConfigApi;
  readonly count: CountApi;
  readonly csvImport: CsvImportApi;
  readonly currentDatetime: CurrentDatetimeApi;
  readonly customer: CustomerApi;
  readonly customerName: CustomerNameApi;
  readonly customField: CustomFieldApi;
  readonly datum: DatumApi;
  readonly default: DefaultApi;
  readonly defined: DefinedApi;
  readonly education: EducationApi;
  readonly eligible: EligibleApi;
  readonly emailConfiguration: EmailConfigurationApi;
  readonly emailSubscription: EmailSubscriptionApi;
  readonly employee: EmployeeApi;
  readonly employeeOnLeaveToday: EmployeeOnLeaveTodayApi;
  readonly employmentStatus: EmploymentStatusApi;
  readonly event: EventApi;
  readonly feed: FeedApi;
  readonly group: GroupApi;
  readonly hiringManager: HiringManagerApi;
  readonly holiday: HolidayApi;
  readonly interview: InterviewApi;
  readonly interviwer: InterviwerApi;
  readonly jobCategory: JobCategoryApi;
  readonly jobTitle: JobTitleApi;
  readonly kpis: KpisApi;
  readonly language: LanguageApi;
  readonly latest: LatestApi;
  readonly ldapConfig: LdapConfigApi;
  readonly ldapTestConnection: LdapTestConnectionApi;
  readonly leave: LeaveApi;
  readonly leaveBalance: LeaveBalanceApi;
  readonly leaveEntitlement: LeaveEntitlementApi;
  readonly leavePeriod: LeavePeriodApi;
  readonly leaveRequest: LeaveRequestApi;
  readonly leaveType: LeaveTypeApi;
  readonly licens: LicensApi;
  readonly link: LinkApi;
  readonly list: ListApi;
  readonly localization: LocalizationApi;
  readonly location: LocationApi;
  readonly membership: MembershipApi;
  readonly menus: MenusApi;
  readonly module: ModuleApi;
  readonly myself: MyselfApi;
  readonly nationality: NationalityApi;
  readonly oauthClient: OauthClientApi;
  readonly openidProvider: OpenidProviderApi;
  readonly optionalField: OptionalFieldApi;
  readonly organization: OrganizationApi;
  readonly overlap: OverlapApi;
  readonly overlapLeave: OverlapLeaveApi;
  readonly payGrade: PayGradeApi;
  readonly post: PostApi;
  readonly preview: PreviewApi;
  readonly project: ProjectApi;
  readonly projectAdmin: ProjectAdminApi;
  readonly projectName: ProjectNameApi;
  readonly punchInOverlap: PunchInOverlapApi;
  readonly punchOutOverlap: PunchOutOverlapApi;
  readonly purge: PurgeApi;
  readonly record: RecordApi;
  readonly registration: RegistrationApi;
  readonly report: ReportApi;
  readonly reportingMethod: ReportingMethodApi;
  readonly request: RequestApi;
  readonly review: ReviewApi;
  readonly reviewer: ReviewerApi;
  readonly share: ShareApi;
  readonly shortcut: ShortcutApi;
  readonly skill: SkillApi;
  readonly status: StatusApi;
  readonly subunit: SubunitApi;
  readonly summary: SummaryApi;
  readonly supervisor: SupervisorApi;
  readonly terminationReason: TerminationReasonApi;
  readonly test: TestApi;
  readonly theme: ThemeApi;
  readonly timeAtWork: TimeAtWorkApi;
  readonly timeFormat: TimeFormatApi;
  readonly timesheet: TimesheetApi;
  readonly timeSheetPeriod: TimeSheetPeriodApi;
  readonly timezone: TimezoneApi;
  readonly tracker: TrackerApi;
  readonly trackers: TrackersApi;
  readonly translation: TranslationApi;
  readonly type: TypeApi;
  readonly unique: UniqueApi;
  readonly updatePassword: UpdatePasswordApi;
  readonly user: UserApi;
  readonly userName: UserNameApi;
  readonly userSync: UserSyncApi;
  readonly vacancy: VacancyApi;
  readonly validation: ValidationApi;
  readonly workShift: WorkShiftApi;
  readonly workweek: WorkweekApi;

  constructor(request: APIRequestContext, baseUrl = BASE_URL) {
    this.client = new ApiClient(request, baseUrl);
    this.about = new AboutApi(this.client);
    this.actionSummary = new ActionSummaryApi(this.client);
    this.activityName = new ActivityNameApi(this.client);
    this.anniversary = new AnniversaryApi(this.client);
    this.attachment = new AttachmentApi(this.client);
    this.bulk = new BulkApi(this.client);
    this.candidate = new CandidateApi(this.client);
    this.comment = new CommentApi(this.client);
    this.config = new ConfigApi(this.client);
    this.count = new CountApi(this.client);
    this.csvImport = new CsvImportApi(this.client);
    this.currentDatetime = new CurrentDatetimeApi(this.client);
    this.customer = new CustomerApi(this.client);
    this.customerName = new CustomerNameApi(this.client);
    this.customField = new CustomFieldApi(this.client);
    this.datum = new DatumApi(this.client);
    this.default = new DefaultApi(this.client);
    this.defined = new DefinedApi(this.client);
    this.education = new EducationApi(this.client);
    this.eligible = new EligibleApi(this.client);
    this.emailConfiguration = new EmailConfigurationApi(this.client);
    this.emailSubscription = new EmailSubscriptionApi(this.client);
    this.employee = new EmployeeApi(this.client);
    this.employeeOnLeaveToday = new EmployeeOnLeaveTodayApi(this.client);
    this.employmentStatus = new EmploymentStatusApi(this.client);
    this.event = new EventApi(this.client);
    this.feed = new FeedApi(this.client);
    this.group = new GroupApi(this.client);
    this.hiringManager = new HiringManagerApi(this.client);
    this.holiday = new HolidayApi(this.client);
    this.interview = new InterviewApi(this.client);
    this.interviwer = new InterviwerApi(this.client);
    this.jobCategory = new JobCategoryApi(this.client);
    this.jobTitle = new JobTitleApi(this.client);
    this.kpis = new KpisApi(this.client);
    this.language = new LanguageApi(this.client);
    this.latest = new LatestApi(this.client);
    this.ldapConfig = new LdapConfigApi(this.client);
    this.ldapTestConnection = new LdapTestConnectionApi(this.client);
    this.leave = new LeaveApi(this.client);
    this.leaveBalance = new LeaveBalanceApi(this.client);
    this.leaveEntitlement = new LeaveEntitlementApi(this.client);
    this.leavePeriod = new LeavePeriodApi(this.client);
    this.leaveRequest = new LeaveRequestApi(this.client);
    this.leaveType = new LeaveTypeApi(this.client);
    this.licens = new LicensApi(this.client);
    this.link = new LinkApi(this.client);
    this.list = new ListApi(this.client);
    this.localization = new LocalizationApi(this.client);
    this.location = new LocationApi(this.client);
    this.membership = new MembershipApi(this.client);
    this.menus = new MenusApi(this.client);
    this.module = new ModuleApi(this.client);
    this.myself = new MyselfApi(this.client);
    this.nationality = new NationalityApi(this.client);
    this.oauthClient = new OauthClientApi(this.client);
    this.openidProvider = new OpenidProviderApi(this.client);
    this.optionalField = new OptionalFieldApi(this.client);
    this.organization = new OrganizationApi(this.client);
    this.overlap = new OverlapApi(this.client);
    this.overlapLeave = new OverlapLeaveApi(this.client);
    this.payGrade = new PayGradeApi(this.client);
    this.post = new PostApi(this.client);
    this.preview = new PreviewApi(this.client);
    this.project = new ProjectApi(this.client);
    this.projectAdmin = new ProjectAdminApi(this.client);
    this.projectName = new ProjectNameApi(this.client);
    this.punchInOverlap = new PunchInOverlapApi(this.client);
    this.punchOutOverlap = new PunchOutOverlapApi(this.client);
    this.purge = new PurgeApi(this.client);
    this.record = new RecordApi(this.client);
    this.registration = new RegistrationApi(this.client);
    this.report = new ReportApi(this.client);
    this.reportingMethod = new ReportingMethodApi(this.client);
    this.request = new RequestApi(this.client);
    this.review = new ReviewApi(this.client);
    this.reviewer = new ReviewerApi(this.client);
    this.share = new ShareApi(this.client);
    this.shortcut = new ShortcutApi(this.client);
    this.skill = new SkillApi(this.client);
    this.status = new StatusApi(this.client);
    this.subunit = new SubunitApi(this.client);
    this.summary = new SummaryApi(this.client);
    this.supervisor = new SupervisorApi(this.client);
    this.terminationReason = new TerminationReasonApi(this.client);
    this.test = new TestApi(this.client);
    this.theme = new ThemeApi(this.client);
    this.timeAtWork = new TimeAtWorkApi(this.client);
    this.timeFormat = new TimeFormatApi(this.client);
    this.timesheet = new TimesheetApi(this.client);
    this.timeSheetPeriod = new TimeSheetPeriodApi(this.client);
    this.timezone = new TimezoneApi(this.client);
    this.tracker = new TrackerApi(this.client);
    this.trackers = new TrackersApi(this.client);
    this.translation = new TranslationApi(this.client);
    this.type = new TypeApi(this.client);
    this.unique = new UniqueApi(this.client);
    this.updatePassword = new UpdatePasswordApi(this.client);
    this.user = new UserApi(this.client);
    this.userName = new UserNameApi(this.client);
    this.userSync = new UserSyncApi(this.client);
    this.vacancy = new VacancyApi(this.client);
    this.validation = new ValidationApi(this.client);
    this.workShift = new WorkShiftApi(this.client);
    this.workweek = new WorkweekApi(this.client);
  }
}

export { idOf };
