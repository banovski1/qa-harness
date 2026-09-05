# Generation report

Generated from `analysis` for `typescript`.

| | |
|---|---|
| Routes read | 229 |
| Page objects | 153 |
| Routes without a component | 45 |
| API routes skipped | 0 |
| Elements read | 1268 |
| Skipped (no locator) | 0 |
| Shared navigation elements | 15 |
| Tables | 64 |
| Unstable locators | 208 |
| Accessors via component factory | 825 of 1055 |

## Locator ladder

Where each element landed, best first. See `scripts/framework-generator/locator-ladder.mjs`.

| Rung | Signal | Elements |
|---|---|---|
| 2 | ARIA role + accessible name | 564 |
| 4 | label, not associated | 670 |
| 5 | placeholder text | 20 |
| 6 | id / name attribute | 11 |
| 8 | CSS path | 3 |

## API layer

Generated from `analysis/api-map`.

| | |
|---|---|
| Resources | 143 |
| Operations | 491 |
| Dropped fields | 575 |
| Source(s) | openapi |

## Locator ownership

A factory accessor names only its label; the selector lives in the component,
from `locatorTemplates:` in the generator config. The rest keep the locator the
mapper verified, which is what a genuine one-off needs.

| Resolved by | Accessors |
|---|---|
| `ButtonComponent.byLabel` | 396 |
| `InputComponent.byLabel` | 220 |
| `DropdownComponent.byLabel` | 108 |
| `TableComponent.byColumn` | 56 |
| `InputComponent.textareaByLabel` | 26 |
| `LinkComponent.byLabel` | 19 |
| its own locator | 230 |

## Unstable locators

These resolve by position, so they break when the page layout changes. Replace
them with a stable locator in the page object's protected file as you touch them.

| Page | Element | Component | Why |
|---|---|---|---|
| AddThemePage | `keepCurrentRadio` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `deleteCurrentRadio` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `replaceCurrentRadio` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `noFileSelectedInput` | input | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `keepCurrentRadio2` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `deleteCurrentRadio2` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `replaceCurrentRadio2` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `noFileSelectedInput2` | input | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `keepCurrentRadio3` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `deleteCurrentRadio3` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `replaceCurrentRadio3` | radio | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddThemePage | `noFileSelectedInput3` | input | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| WorkspaceNotificationConfigurationPage | `notificationRegistrationsButton` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| WorkspaceNotificationConfigurationPage | `notificationRegistrationsButton2` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| WorkspaceNotificationConfigurationPage | `notificationRegistrationsButton3` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `timeInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `noteLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `timeInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `noteLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `dateInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `timezoneDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `dateInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EditAttendanceRecordPage | `timezoneDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ResetPasswordPage | `resetPasswordInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ResetPasswordPage | `resetPasswordInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ClaimAssignClaimPage | `assignClaimButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ClaimAssignClaimPage | `assignClaimButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ClaimSubmitClaimPage | `submitClaimButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ClaimSubmitClaimPage | `submitClaimButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveSubscriberPage | `nameInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveSubscriberPage | `emailInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveSubscriberPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveSubscriberPage | `nameInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveSubscriberPage | `emailInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveSubscriberPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveWorkShiftsPage | `hhMmInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveWorkShiftsPage | `hhMmInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ApplyLeavePage | `durationDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ApplyLeavePage | `durationDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AssignLeavePage | `durationDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AssignLeavePage | `durationDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `statusButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `ratingInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `commentLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `statusButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `ratingInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluateByAdminPage | `commentLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `logInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `commentLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `saveButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `logInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `commentLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| AddPerformanceTrackerLogPage | `saveButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `statusButton` | button | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `ratingInput` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `commentLongInput` | longInput | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `statusButton2` | button | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `ratingInput2` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `commentLongInput2` | longInput | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `statusButton3` | button | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `ratingInput3` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `commentLongInput3` | longInput | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `statusButton4` | button | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `ratingInput4` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| ReviewEvaluatePage | `commentLongInput4` | longInput | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `nameInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `relationshipDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `pleaseSpecifyInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `nameInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `relationshipDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `pleaseSpecifyInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| DependentsPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `nameInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `relationshipInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `homeTelephoneInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `mobileInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `workTelephoneInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `nameInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `relationshipInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `homeTelephoneInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `mobileInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `workTelephoneInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmergencyContactsPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `passportRadio` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `visaRadio` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `numberInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `eligibleStatusInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `issuedByDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `commentsLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `passportRadio2` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `visaRadio2` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `numberInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `eligibleStatusInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `issuedByDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `commentsLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| ImmigrationPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `membershipDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `subscriptionPaidByDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `subscriptionAmountInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `currencyDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `membershipDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `subscriptionPaidByDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `subscriptionAmountInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `currencyDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MembershipsPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| QualificationsPage | `qualificationsTable` | table | 5 elements on this page resolve to this same locator — it needs scoping to one of them |
| QualificationsPage | `qualificationsTable2` | table | 5 elements on this page resolve to this same locator — it needs scoping to one of them |
| QualificationsPage | `qualificationsTable3` | table | 5 elements on this page resolve to this same locator — it needs scoping to one of them |
| QualificationsPage | `qualificationsTable4` | table | 5 elements on this page resolve to this same locator — it needs scoping to one of them |
| QualificationsPage | `qualificationsTable5` | table | 5 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `salaryComponentInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `payGradeDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `payFrequencyDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `currencyDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `amountInput` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `commentsLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `accountNumberInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `accountTypeDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `pleaseSpecifyInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `routingNumberInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `amountInput2` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `salaryComponentInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `payGradeDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `payFrequencyDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `currencyDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `amountInput3` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `commentsLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `accountNumberInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `accountTypeDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `pleaseSpecifyInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `routingNumberInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `amountInput22` | input | 4 elements on this page resolve to this same locator — it needs scoping to one of them |
| SalaryListPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| UsTaxExemptionsPage | `statusDropdown` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| UsTaxExemptionsPage | `exemptionsInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| UsTaxExemptionsPage | `statusDropdown2` | dropdown | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| UsTaxExemptionsPage | `exemptionsInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `cancelButton` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `commentLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `cancelButton2` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `commentLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `cancelButton3` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `saveButton` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `keepCurrentRadio` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `deleteCurrentRadio` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `replaceCurrentRadio` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `noFileSelectedInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `saveButton2` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `keepCurrentRadio2` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `deleteCurrentRadio2` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `replaceCurrentRadio2` | radio | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `noFileSelectedInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| RecruitmentAddJobVacancyPage | `saveButton3` | button | 3 elements on this page resolve to this same locator — it needs scoping to one of them |
| InterviewAttachmentsPage | `commentLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| InterviewAttachmentsPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| InterviewAttachmentsPage | `commentLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| InterviewAttachmentsPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `nameInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `descriptionLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `saveButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `nameInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `descriptionLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| SaveProjectPage | `saveButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmployeeTimesheetPage | `timesheetPeriodButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| EmployeeTimesheetPage | `timesheetPeriodButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MyTimesheetPage | `timesheetPeriodButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| MyTimesheetPage | `timesheetPeriodButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `unitIdInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `nameInput` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `descriptionLongInput` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `cancelButton` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `unitIdInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `nameInput2` | input | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `descriptionLongInput2` | longInput | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
| CompanyStructurePage | `cancelButton2` | button | 2 elements on this page resolve to this same locator — it needs scoping to one of them |
