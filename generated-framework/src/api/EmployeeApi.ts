// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

import { fillPath, type ApiClient } from './ApiClient.ts';

/** Creating one makes true: an Employee exists. */
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
  async getRequestsById<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
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
  async getContactDetailsValidationOtherEmails<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employees/{empNumber}/contact-details/validation/other-emails', params), { data });
  }

  /** Validate an Employee's Work Email. */
  async getContactDetailsValidationWorkEmails<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employees/{empNumber}/contact-details/validation/work-emails', params), { data });
  }

  /** List an Employee's Custom Fields. */
  async getCustomFields<T = any>(params: Record<string, string | number>, data?: Record<string, unknown>): Promise<T> {
    return this.api.call<T>('GET', fillPath('/web/index.php/api/v2/pim/employees/{empNumber}/custom-fields', params), { data });
  }
}
