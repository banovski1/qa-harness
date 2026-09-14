# orangehrm — proposed test framework

Compiled from `analysis.json` at commit `56e23b3b09`.

**This is a proposal. Nothing has been written.** Read it, then approve with:

```
npm run draft -- --approve
```

The generator runs exactly once against an approved draft. After that the framework
is yours: no command in this repository will rewrite it.

## Summary

| | |
| --- | --- |
| screens | 216 (22 crawled, 194 declared only) |
| components | 10 |
| API resources | 105 |
| ready to write tests against (≥ 0.7) | 18 |
| record the flow first (0.3–0.7) | 2 |
| a URL and little else (< 0.3) | 196 |

## Files

```
src/api/AboutApi.ts                                 the About endpoints
src/api/ActionSummaryApi.ts                         the ActionSummary endpoints
src/api/ActivityNameApi.ts                          the ActivityName endpoints
src/api/AnniversaryApi.ts                           the Anniversary endpoints
src/api/AttachmentApi.ts                            the Attachment endpoints
src/api/BulkApi.ts                                  the Bulk endpoints
src/api/CandidateApi.ts                             the Candidate endpoints
src/api/CommentApi.ts                               the Comment endpoints
src/api/ConfigApi.ts                                the Config endpoints
src/api/CountApi.ts                                 the Count endpoints
src/api/CsvImportApi.ts                             the CsvImport endpoints
src/api/CurrentDatetimeApi.ts                       the CurrentDatetime endpoints
src/api/CustomerApi.ts                              the Customer endpoints
src/api/CustomerNameApi.ts                          the CustomerName endpoints
src/api/CustomFieldApi.ts                           the CustomField endpoints
src/api/DatumApi.ts                                 the Datum endpoints
src/api/DefaultApi.ts                               the Default endpoints
src/api/DefinedApi.ts                               the Defined endpoints
src/api/EducationApi.ts                             the Education endpoints
src/api/EligibleApi.ts                              the Eligible endpoints
src/api/EmailConfigurationApi.ts                    the EmailConfiguration endpoints
src/api/EmailSubscriptionApi.ts                     the EmailSubscription endpoints
src/api/EmployeeApi.ts                              the Employee endpoints
src/api/EmployeeOnLeaveTodayApi.ts                  the EmployeeOnLeaveToday endpoints
src/api/EmploymentStatusApi.ts                      the EmploymentStatus endpoints
src/api/EventApi.ts                                 the Event endpoints
src/api/FeedApi.ts                                  the Feed endpoints
src/api/GroupApi.ts                                 the Group endpoints
src/api/HiringManagerApi.ts                         the HiringManager endpoints
src/api/HolidayApi.ts                               the Holiday endpoints
src/api/InterviewApi.ts                             the Interview endpoints
src/api/InterviwerApi.ts                            the Interviwer endpoints
src/api/JobCategoryApi.ts                           the JobCategory endpoints
src/api/JobTitleApi.ts                              the JobTitle endpoints
src/api/KpisApi.ts                                  the Kpis endpoints
src/api/LanguageApi.ts                              the Language endpoints
src/api/LatestApi.ts                                the Latest endpoints
src/api/LdapConfigApi.ts                            the LdapConfig endpoints
src/api/LdapTestConnectionApi.ts                    the LdapTestConnection endpoints
src/api/LeaveApi.ts                                 the Leave endpoints
src/api/LeaveBalanceApi.ts                          the LeaveBalance endpoints
src/api/LeaveEntitlementApi.ts                      the LeaveEntitlement endpoints
src/api/LeavePeriodApi.ts                           the LeavePeriod endpoints
src/api/LeaveRequestApi.ts                          the LeaveRequest endpoints
src/api/LeaveTypeApi.ts                             the LeaveType endpoints
src/api/LicensApi.ts                                the Licens endpoints
src/api/LinkApi.ts                                  the Link endpoints
src/api/ListApi.ts                                  the List endpoints
src/api/LocalizationApi.ts                          the Localization endpoints
src/api/LocationApi.ts                              the Location endpoints
src/api/MembershipApi.ts                            the Membership endpoints
src/api/MenusApi.ts                                 the Menus endpoints
src/api/ModuleApi.ts                                the Module endpoints
src/api/MyselfApi.ts                                the Myself endpoints
src/api/NationalityApi.ts                           the Nationality endpoints
src/api/OauthClientApi.ts                           the OauthClient endpoints
src/api/OpenidProviderApi.ts                        the OpenidProvider endpoints
src/api/OptionalFieldApi.ts                         the OptionalField endpoints
src/api/OrganizationApi.ts                          the Organization endpoints
src/api/OverlapApi.ts                               the Overlap endpoints
src/api/OverlapLeaveApi.ts                          the OverlapLeave endpoints
src/api/PayGradeApi.ts                              the PayGrade endpoints
src/api/PostApi.ts                                  the Post endpoints
src/api/PreviewApi.ts                               the Preview endpoints
src/api/ProjectAdminApi.ts                          the ProjectAdmin endpoints
src/api/ProjectApi.ts                               the Project endpoints
src/api/ProjectNameApi.ts                           the ProjectName endpoints
src/api/PunchInOverlapApi.ts                        the PunchInOverlap endpoints
src/api/PunchOutOverlapApi.ts                       the PunchOutOverlap endpoints
src/api/PurgeApi.ts                                 the Purge endpoints
src/api/RecordApi.ts                                the Record endpoints
src/api/RegistrationApi.ts                          the Registration endpoints
src/api/ReportApi.ts                                the Report endpoints
src/api/ReportingMethodApi.ts                       the ReportingMethod endpoints
src/api/RequestApi.ts                               the Request endpoints
src/api/ReviewApi.ts                                the Review endpoints
src/api/ReviewerApi.ts                              the Reviewer endpoints
src/api/ShareApi.ts                                 the Share endpoints
src/api/ShortcutApi.ts                              the Shortcut endpoints
src/api/SkillApi.ts                                 the Skill endpoints
src/api/StatusApi.ts                                the Status endpoints
src/api/SubunitApi.ts                               the Subunit endpoints
src/api/SummaryApi.ts                               the Summary endpoints
src/api/SupervisorApi.ts                            the Supervisor endpoints
src/api/TerminationReasonApi.ts                     the TerminationReason endpoints
src/api/TestApi.ts                                  the Test endpoints
src/api/ThemeApi.ts                                 the Theme endpoints
src/api/TimeAtWorkApi.ts                            the TimeAtWork endpoints
src/api/TimeFormatApi.ts                            the TimeFormat endpoints
src/api/TimesheetApi.ts                             the Timesheet endpoints
src/api/TimeSheetPeriodApi.ts                       the TimeSheetPeriod endpoints
src/api/TimezoneApi.ts                              the Timezone endpoints
src/api/TrackerApi.ts                               the Tracker endpoints
src/api/TrackersApi.ts                              the Trackers endpoints
src/api/TranslationApi.ts                           the Translation endpoints
src/api/TypeApi.ts                                  the Type endpoints
src/api/UniqueApi.ts                                the Unique endpoints
src/api/UpdatePasswordApi.ts                        the UpdatePassword endpoints
src/api/UserApi.ts                                  the User endpoints
src/api/UserNameApi.ts                              the UserName endpoints
src/api/UserSyncApi.ts                              the UserSync endpoints
src/api/VacancyApi.ts                               the Vacancy endpoints
src/api/ValidationApi.ts                            the Validation endpoints
src/api/WorkShiftApi.ts                             the WorkShift endpoints
src/api/WorkweekApi.ts                              the Workweek endpoints
src/components/NavigationBar.ts                     navigation region — 15 controls shared across 21 screens (region)
src/pages/web/AddAuthProviderPage.ts                /web/index.phpadmin/addAuthProvider (declared, never crawled)
src/pages/web/AddEmployeePage.ts                    /web/index.php/pim/addEmployee
src/pages/web/AddLeaveEntitlementPage.ts            /web/index.php/leave/addLeaveEntitlement (declared, never crawled)
src/pages/web/AddThemePage.ts                       /web/index.php/admin/addTheme (declared, never crawled)
src/pages/web/ApplyLeavePage.ts                     /web/index.php/leave/applyLeave (declared, never crawled)
src/pages/web/ApplyVacancyIdPage.ts                 /web/index.php/recruitmentApply/applyVacancy/id/{id} (declared, never crawled)
src/pages/web/AssignClaimIdPage.ts                  /web/index.php/claim/assignClaim/id/{id} (declared, never crawled)
src/pages/web/AssignClaimPage.ts                    /web/index.php/claim/assignClaim (declared, never crawled)
src/pages/web/AssignLeavePage.ts                    /web/index.php/leave/assignLeave (declared, never crawled)
src/pages/web/AttachmentPage.ts                     /web/index.php/recruitment/viewInterviewAttachment/interview/{interviewId}/attachment/{attachmentId} (declared, never crawled)
src/pages/web/AttachmentsImagePage.ts               /web/index.php/admin/theme/attachments/image/{imageName} (declared, never crawled)
src/pages/web/AuthorizePage.ts                      /web/index.php/oauth2/authorize (declared, never crawled)
src/pages/web/CandidateHistoryPage.ts               /web/index.php/recruitment/candidateHistory/{candidateId}/{historyId} (declared, never crawled)
src/pages/web/CandidateIdPage.ts                    /web/index.php/recruitment/viewCandidateAttachment/candidateId/{candidateId} (declared, never crawled)
src/pages/web/ChangeCandidateVacancyStatusPage.ts   /web/index.php/recruitment/changeCandidateVacancyStatus (declared, never crawled)
src/pages/web/ChangeWeakPasswordResetCodePage.ts    /web/index.php/auth/changeWeakPassword/resetCode/{resetCode} (declared, never crawled)
src/pages/web/ConfigurePage.ts                      /web/index.php/attendance/configure (declared, never crawled)
src/pages/web/ConfigurePimPage.ts                   /web/index.php/pim/configurePim (declared, never crawled)
src/pages/web/ConsentPage.ts                        /web/index.php/oauth2/authorize/consent (declared, never crawled)
src/pages/web/ContactDetailsEmpNumberPage.ts        /web/index.php/pim/contactDetails/empNumber/{empNumber}
src/pages/web/DefineLeavePeriodPage.ts              /web/index.php/leave/defineLeavePeriod (declared, never crawled)
src/pages/web/DefineTimesheetPeriodPage.ts          /web/index.php/time/defineTimesheetPeriod (declared, never crawled)
src/pages/web/DefineWorkWeekPage.ts                 /web/index.php/leave/defineWorkWeek (declared, never crawled)
src/pages/web/DisplayAttendanceSummaryReportCriteriaPage.ts /web/index.php/time/displayAttendanceSummaryReportCriteria (declared, never crawled)
src/pages/web/DisplayEmployeeReportCriteriaPage.ts  /web/index.php/time/displayEmployeeReportCriteria (declared, never crawled)
src/pages/web/DisplayPredefinedReportPage.ts        /web/index.php/pim/displayPredefinedReport/{id} (declared, never crawled)
src/pages/web/DisplayProjectActivityDetailsReportPage.ts /web/index.php/time/displayProjectActivityDetailsReport (declared, never crawled)
src/pages/web/DisplayProjectReportCriteriaPage.ts   /web/index.php/time/displayProjectReportCriteria (declared, never crawled)
src/pages/web/EditAttendanceRecordPage.ts           /web/index.php/attendance/editAttendanceRecord/{id} (declared, never crawled)
src/pages/web/EditAuthProviderPage.ts               /web/index.phpadmin/editAuthProvider/{id} (declared, never crawled)
src/pages/web/EditEmployeeAttendanceRecordPage.ts   /web/index.php/attendance/editEmployeeAttendanceRecord/{id} (declared, never crawled)
src/pages/web/EditLeaveEntitlementPage.ts           /web/index.php/leave/editLeaveEntitlement/{id} (declared, never crawled)
src/pages/web/EditOAuthClientPage.ts                /web/index.php/admin/editOAuthClient (declared, never crawled)
src/pages/web/EditTimesheetPage.ts                  /web/index.php/time/editTimesheet/{id} (declared, never crawled)
src/pages/web/EmployeeIdPage.ts                     /web/index.php/time/viewTimesheet/employeeId/{id} (declared, never crawled)
src/pages/web/EmploymentStatusPage.ts               /web/index.php/admin/employmentStatus (declared, never crawled)
src/pages/web/EmpNumberAttachIdPage.ts              /web/index.php/pim/viewAttachment/empNumber/{empNumber}/attachId/{attachId} (declared, never crawled)
src/pages/web/FixLanguageStringErrorsPage.ts        /web/index.php/admin/fixLanguageStringErrors/{languageId} (declared, never crawled)
src/pages/web/HelpPage.ts                           /web/index.php/help/help (declared, never crawled)
src/pages/web/IndexPage.ts                          /web/index.php/dashboard/index
src/pages/web/IndexPhpPage.ts                       /web/index.php/ (declared, never crawled)
src/pages/web/InterviewAttachmentsPage.ts           /web/index.php/recruitment/interviewAttachments/{interviewId} (declared, never crawled)
src/pages/web/JobCategoryPage.ts                    /web/index.php/admin/jobCategory (declared, never crawled)
src/pages/web/JobsHtmlPage.ts                       /web/index.php/recruitmentApply/jobs.html (declared, never crawled)
src/pages/web/JobsRssPage.ts                        /web/index.php/recruitmentApply/jobs.rss (declared, never crawled)
src/pages/web/LanguageCustomizationPage.ts          /web/index.php/admin/languageCustomization/{languageId} (declared, never crawled)
src/pages/web/LanguageIdPage.ts                     /web/index.php/admin/viewLanguagePackage/languageId/{languageId} (declared, never crawled)
src/pages/web/LanguageImportPage.ts                 /web/index.php/admin/languageImport/{languageId} (declared, never crawled)
src/pages/web/LanguagePackagePage.ts                /web/index.php/admin/languagePackage (declared, never crawled)
src/pages/web/LdapConfigurationPage.ts              /web/index.php/admin/ldapConfiguration (declared, never crawled)
src/pages/web/LeaveTypeListPage.ts                  /web/index.php/leave/leaveTypeList (declared, never crawled)
src/pages/web/ListCustomFieldsPage.ts               /web/index.php/pim/listCustomFields (declared, never crawled)
src/pages/web/ListMailConfigurationPage.ts          /web/index.php/admin/listMailConfiguration (declared, never crawled)
src/pages/web/LocalizationPage.ts                   /web/index.php/admin/localization (declared, never crawled)
src/pages/web/LoginPage.ts                          /web/index.php/auth/login (declared, never crawled)
src/pages/web/LogoutPage.ts                         /web/index.php/auth/logout (declared, never crawled)
src/pages/web/LogsPage.ts                           /web/index.phpapi/v2/performance/trackers/{trackerId}/logs/{id} (declared, never crawled)
src/pages/web/MembershipPage.ts                     /web/index.php/admin/membership (declared, never crawled)
src/pages/web/MessagesPage.ts                       /web/index.php/core/i18n/messages (declared, never crawled)
src/pages/web/MyPerformanceReviewPage.ts            /web/index.php/performance/myPerformanceReview (declared, never crawled)
src/pages/web/NationalityPage.ts                    /web/index.php/admin/nationality (declared, never crawled)
src/pages/web/OpenIdProviderPage.ts                 /web/index.php/admin/openIdProvider (declared, never crawled)
src/pages/web/PhotoPage.ts                          /web/index.php/buzz/photo/{id} (declared, never crawled)
src/pages/web/PimCsvImportPage.ts                   /web/index.php/pim/pimCsvImport (declared, never crawled)
src/pages/web/ProxyPunchInPunchOutPage.ts           /web/index.php/attendance/proxyPunchInPunchOut (declared, never crawled)
src/pages/web/PunchInPage.ts                        /web/index.php/attendance/punchIn (declared, never crawled)
src/pages/web/PunchOutPage.ts                       /web/index.php/attendance/punchOut (declared, never crawled)
src/pages/web/PurgeCandidateDataPage.ts             /web/index.php/maintenance/purgeCandidateData (declared, never crawled)
src/pages/web/PurgeEmployeePage.ts                  /web/index.php/maintenance/purgeEmployee
src/pages/web/RegisterOAuthClientPage.ts            /web/index.php/admin/registerOAuthClient (declared, never crawled)
src/pages/web/RequestPasswordResetCodePage.ts       /web/index.php/auth/requestPasswordResetCode (declared, never crawled)
src/pages/web/RequestsAttachIdPage.ts               /web/index.php/claim/requests/{requestId}/attachId/{attachId} (declared, never crawled)
src/pages/web/ResetPasswordResetCodePage.ts         /web/index.php/auth/resetPassword/resetCode/{resetCode} (declared, never crawled)
src/pages/web/ReviewEvaluateByAdminPage.ts          /web/index.php/performance/reviewEvaluateByAdmin/{id} (declared, never crawled)
src/pages/web/ReviewEvaluateIdPage.ts               /web/index.php/performance/reviewEvaluate/id/{id} (declared, never crawled)
src/pages/web/SampleCsvDownloadPage.ts              /web/index.php/pim/sampleCsvDownload (declared, never crawled)
src/pages/web/SaveOAuthClientPage.ts                /web/index.php/admin/saveOAuthClient (declared, never crawled)
src/pages/web/SaveSubscriberPage.ts                 /web/index.php/admin/saveSubscriber/{id} (declared, never crawled)
src/pages/web/SearchEvaluatePerformanceReviewPage.ts /web/index.php/performance/searchEvaluatePerformanceReview
src/pages/web/SearchKpiPage.ts                      /web/index.php/performance/searchKpi (declared, never crawled)
src/pages/web/SearchPerformanceReviewPage.ts        /web/index.php/performance/searchPerformanceReview (declared, never crawled)
src/pages/web/SendPasswordResetFailurePage.ts       /web/index.php/auth/sendPasswordResetFailure (declared, never crawled)
src/pages/web/SendPasswordResetPage.ts              /web/index.php/auth/sendPasswordReset (declared, never crawled)
src/pages/web/SubmitClaimIdPage.ts                  /web/index.php/claim/submitClaim/id/{id} (declared, never crawled)
src/pages/web/SubmitClaimPage.ts                    /web/index.php/claim/submitClaim (declared, never crawled)
src/pages/web/SupportPage.ts                        /web/index.php/help/support (declared, never crawled)
src/pages/web/SystemCheckPage.ts                    /web/index.php/core/system-check (declared, never crawled)
src/pages/web/ThemeImagePage.ts                     /web/index.php/admin/theme/image/{imageName} (declared, never crawled)
src/pages/web/TrackIdPage.ts                        /web/index.php/performance/addPerformanceTrackerLog/trackId/{id} (declared, never crawled)
src/pages/web/UpdatePasswordPage.ts                 /web/index.php/pim/updatePassword (declared, never crawled)
src/pages/web/ViewAdminModulePage.ts                /web/index.php/admin/viewAdminModule (declared, never crawled)
src/pages/web/ViewAssignClaimPage.ts                /web/index.php/claim/viewAssignClaim
src/pages/web/ViewAttendanceRecordPage.ts           /web/index.php/attendance/viewAttendanceRecord (declared, never crawled)
src/pages/web/ViewBuzzPage.ts                       /web/index.php/buzz/viewBuzz
src/pages/web/ViewCandidatesPage.ts                 /web/index.php/recruitment/viewCandidates
src/pages/web/ViewClaimModulePage.ts                /web/index.php/claim/viewClaimModule (declared, never crawled)
src/pages/web/ViewClaimPage.ts                      /web/index.php/claim/viewClaim (declared, never crawled)
src/pages/web/ViewCompanyStructurePage.ts           /web/index.php/admin/viewCompanyStructure (declared, never crawled)
src/pages/web/ViewCustomersPage.ts                  /web/index.php/time/viewCustomers (declared, never crawled)
src/pages/web/ViewDefinedPredefinedReportsPage.ts   /web/index.php/pim/viewDefinedPredefinedReports (declared, never crawled)
src/pages/web/ViewDependentsEmpNumberPage.ts        /web/index.php/pim/viewDependents/empNumber/{empNumber}
src/pages/web/ViewDirectoryPage.ts                  /web/index.php/directory/viewDirectory
src/pages/web/ViewEducationPage.ts                  /web/index.php/admin/viewEducation (declared, never crawled)
src/pages/web/ViewEmailNotificationPage.ts          /web/index.php/admin/viewEmailNotification (declared, never crawled)
src/pages/web/ViewEmergencyContactsEmpNumberPage.ts /web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}
src/pages/web/ViewEmployeeListPage.ts               /web/index.php/pim/viewEmployeeList
src/pages/web/ViewEmployeePerformanceTrackerListPage.ts /web/index.php/performance/viewEmployeePerformanceTrackerList (declared, never crawled)
src/pages/web/ViewEmployeeTimesheetPage.ts          /web/index.php/time/viewEmployeeTimesheet
src/pages/web/ViewEventsPage.ts                     /web/index.php/claim/viewEvents (declared, never crawled)
src/pages/web/ViewExpensePage.ts                    /web/index.php/claim/viewExpense (declared, never crawled)
src/pages/web/ViewHolidayListPage.ts                /web/index.php/leave/viewHolidayList (declared, never crawled)
src/pages/web/ViewImmigrationEmpNumberPage.ts       /web/index.php/pim/viewImmigration/empNumber/{empNumber}
src/pages/web/ViewJobDetailsEmpNumberPage.ts        /web/index.php/pim/viewJobDetails/empNumber/{empNumber}
src/pages/web/ViewJobSpecificationAttachIdPage.ts   /web/index.php/admin/viewJobSpecification/attachId/{attachId} (declared, never crawled)
src/pages/web/ViewJobTitleListPage.ts               /web/index.php/admin/viewJobTitleList (declared, never crawled)
src/pages/web/ViewJobVacancyPage.ts                 /web/index.php/recruitment/viewJobVacancy (declared, never crawled)
src/pages/web/ViewLanguagesPage.ts                  /web/index.php/admin/viewLanguages (declared, never crawled)
src/pages/web/ViewLeaveBalanceReportPage.ts         /web/index.php/leave/viewLeaveBalanceReport (declared, never crawled)
src/pages/web/ViewLeaveEntitlementsPage.ts          /web/index.php/leave/viewLeaveEntitlements (declared, never crawled)
src/pages/web/ViewLeaveListPage.ts                  /web/index.php/leave/viewLeaveList
src/pages/web/ViewLeaveModulePage.ts                /web/index.php/leave/viewLeaveModule (declared, never crawled)
src/pages/web/ViewLeaveRequestPage.ts               /web/index.php/leave/viewLeaveRequest/{id} (declared, never crawled)
src/pages/web/ViewLicensesPage.ts                   /web/index.php/admin/viewLicenses (declared, never crawled)
src/pages/web/ViewLocationsPage.ts                  /web/index.php/admin/viewLocations (declared, never crawled)
src/pages/web/ViewMaintenanceModulePage.ts          /web/index.php/maintenance/viewMaintenanceModule (declared, never crawled)
src/pages/web/ViewMembershipsEmpNumberPage.ts       /web/index.php/pim/viewMemberships/empNumber/{empNumber}
src/pages/web/ViewModulesPage.ts                    /web/index.php/admin/viewModules (declared, never crawled)
src/pages/web/ViewMyAttendanceRecordPage.ts         /web/index.php/attendance/viewMyAttendanceRecord (declared, never crawled)
src/pages/web/ViewMyDetailsPage.ts                  /web/index.php/pim/viewMyDetails (declared, never crawled)
src/pages/web/ViewMyLeaveBalanceReportPage.ts       /web/index.php/leave/viewMyLeaveBalanceReport (declared, never crawled)
src/pages/web/ViewMyLeaveEntitlementsPage.ts        /web/index.php/leave/viewMyLeaveEntitlements (declared, never crawled)
src/pages/web/ViewMyLeaveListPage.ts                /web/index.php/leave/viewMyLeaveList (declared, never crawled)
src/pages/web/ViewMyPerformanceTrackerListPage.ts   /web/index.php/performance/viewMyPerformanceTrackerList (declared, never crawled)
src/pages/web/ViewMyTimesheetPage.ts                /web/index.php/time/viewMyTimesheet (declared, never crawled)
src/pages/web/ViewOrganizationGeneralInformationPage.ts /web/index.php/admin/viewOrganizationGeneralInformation (declared, never crawled)
src/pages/web/ViewPayGradesPage.ts                  /web/index.php/admin/viewPayGrades (declared, never crawled)
src/pages/web/ViewPerformanceModulePage.ts          /web/index.php/performance/viewPerformanceModule (declared, never crawled)
src/pages/web/ViewPerformanceTrackerPage.ts         /web/index.php/performance/viewPerformanceTracker (declared, never crawled)
src/pages/web/ViewPersonalDetailsEmpNumberPage.ts   /web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}
src/pages/web/ViewPhotoEmpNumberPage.ts             /web/index.php/pim/viewPhoto/empNumber/{empNumber} (declared, never crawled)
src/pages/web/ViewPhotographEmpNumberPage.ts        /web/index.php/pim/viewPhotograph/empNumber/{empNumber} (declared, never crawled)
src/pages/web/ViewPimModulePage.ts                  /web/index.php/pim/viewPimModule (declared, never crawled)
src/pages/web/ViewProjectsPage.ts                   /web/index.php/time/viewProjects (declared, never crawled)
src/pages/web/ViewQualificationsEmpNumberPage.ts    /web/index.php/pim/viewQualifications/empNumber/{empNumber}
src/pages/web/ViewRecruitmentModulePage.ts          /web/index.php/recruitment/viewRecruitmentModule (declared, never crawled)
src/pages/web/ViewReportingMethodsPage.ts           /web/index.php/pim/viewReportingMethods (declared, never crawled)
src/pages/web/ViewReportToDetailsEmpNumberPage.ts   /web/index.php/pim/viewReportToDetails/empNumber/{empNumber}
src/pages/web/ViewSalaryListEmpNumberPage.ts        /web/index.php/pim/viewSalaryList/empNumber/{empNumber}
src/pages/web/ViewSkillsPage.ts                     /web/index.php/admin/viewSkills (declared, never crawled)
src/pages/web/ViewSystemUsersPage.ts                /web/index.php/admin/viewSystemUsers
src/pages/web/ViewTerminationReasonsPage.ts         /web/index.php/pim/viewTerminationReasons (declared, never crawled)
src/pages/web/ViewTimeModulePage.ts                 /web/index.php/time/viewTimeModule (declared, never crawled)
src/pages/web/ViewUsTaxExemptionsEmpNumberPage.ts   /web/index.php/pim/viewUsTaxExemptions/empNumber/{empNumber} (declared, never crawled)
src/pages/web/ViewVacancyAttachmentAttachIdPage.ts  /web/index.php/recruitment/viewVacancyAttachment/attachId/{attachId} (declared, never crawled)
src/pages/web/WebIndexPhpAdminPayGrade2Page.ts      /web/index.php/admin/payGrade/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminPayGradePage.ts       /web/index.php/admin/payGrade (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveEducation2Page.ts /web/index.php/admin/saveEducation/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveEducationPage.ts  /web/index.php/admin/saveEducation (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveEmploymentStatus2Page.ts /web/index.php/admin/saveEmploymentStatus/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveEmploymentStatusPage.ts /web/index.php/admin/saveEmploymentStatus (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveJobCategory2Page.ts /web/index.php/admin/saveJobCategory/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveJobCategoryPage.ts /web/index.php/admin/saveJobCategory (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveJobTitle2Page.ts  /web/index.php/admin/saveJobTitle/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveJobTitlePage.ts   /web/index.php/admin/saveJobTitle (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveLanguages2Page.ts /web/index.php/admin/saveLanguages/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveLanguagesPage.ts  /web/index.php/admin/saveLanguages (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveLicenses2Page.ts  /web/index.php/admin/saveLicenses/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveLicensesPage.ts   /web/index.php/admin/saveLicenses (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveLocation2Page.ts  /web/index.php/admin/saveLocation/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveLocationPage.ts   /web/index.php/admin/saveLocation (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveMemberships2Page.ts /web/index.php/admin/saveMemberships/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveMembershipsPage.ts /web/index.php/admin/saveMemberships (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveNationality2Page.ts /web/index.php/admin/saveNationality/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveNationalityPage.ts /web/index.php/admin/saveNationality (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveSkills2Page.ts    /web/index.php/admin/saveSkills/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveSkillsPage.ts     /web/index.php/admin/saveSkills (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveSystemUser2Page.ts /web/index.php/admin/saveSystemUser/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveSystemUserPage.ts /web/index.php/admin/saveSystemUser (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveWorkShifts2Page.ts /web/index.php/admin/saveWorkShifts/{id} (declared, never crawled)
src/pages/web/WebIndexPhpAdminSaveWorkShiftsPage.ts /web/index.php/admin/saveWorkShifts (declared, never crawled)
src/pages/web/WebIndexPhpClaimSaveEvents2Page.ts    /web/index.php/claim/saveEvents/{id} (declared, never crawled)
src/pages/web/WebIndexPhpClaimSaveEventsPage.ts     /web/index.php/claim/saveEvents (declared, never crawled)
src/pages/web/WebIndexPhpClaimSaveExpense2Page.ts   /web/index.php/claim/saveExpense/{id} (declared, never crawled)
src/pages/web/WebIndexPhpClaimSaveExpensePage.ts    /web/index.php/claim/saveExpense (declared, never crawled)
src/pages/web/WebIndexPhpLeaveDefineLeaveType2Page.ts /web/index.php/leave/defineLeaveType/{id} (declared, never crawled)
src/pages/web/WebIndexPhpLeaveDefineLeaveTypePage.ts /web/index.php/leave/defineLeaveType (declared, never crawled)
src/pages/web/WebIndexPhpLeaveSaveHolidays2Page.ts  /web/index.php/leave/saveHolidays/{id} (declared, never crawled)
src/pages/web/WebIndexPhpLeaveSaveHolidaysPage.ts   /web/index.php/leave/saveHolidays (declared, never crawled)
src/pages/web/WebIndexPhpMaintenanceAccessEmployeeData2Page.ts /web/index.php/maintenance/accessEmployeeData/{empNumber} (declared, never crawled)
src/pages/web/WebIndexPhpMaintenanceAccessEmployeeDataPage.ts /web/index.php/maintenance/accessEmployeeData (declared, never crawled)
src/pages/web/WebIndexPhpOpenidauthOpenIdCredentials2Page.ts /web/index.php/openidauth/openIdCredentials/{providerId} (declared, never crawled)
src/pages/web/WebIndexPhpOpenidauthOpenIdCredentialsPage.ts /web/index.php/openidauth/openIdCredentials (declared, never crawled)
src/pages/web/WebIndexPhpPerformanceAddPerformanceTracker2Page.ts /web/index.php/performance/addPerformanceTracker/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPerformanceAddPerformanceTrackerPage.ts /web/index.php/performance/addPerformanceTracker (declared, never crawled)
src/pages/web/WebIndexPhpPerformanceSaveKpi2Page.ts /web/index.php/performance/saveKpi/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPerformanceSaveKpiPage.ts  /web/index.php/performance/saveKpi (declared, never crawled)
src/pages/web/WebIndexPhpPerformanceSaveReview2Page.ts /web/index.php/performance/saveReview/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPerformanceSaveReviewPage.ts /web/index.php/performance/saveReview (declared, never crawled)
src/pages/web/WebIndexPhpPimDefinePredefinedReport2Page.ts /web/index.php/pim/definePredefinedReport/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPimDefinePredefinedReportPage.ts /web/index.php/pim/definePredefinedReport (declared, never crawled)
src/pages/web/WebIndexPhpPimSaveCustomFields2Page.ts /web/index.php/pim/saveCustomFields/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPimSaveCustomFieldsPage.ts /web/index.php/pim/saveCustomFields (declared, never crawled)
src/pages/web/WebIndexPhpPimSaveReportingMethod2Page.ts /web/index.php/pim/saveReportingMethod/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPimSaveReportingMethodPage.ts /web/index.php/pim/saveReportingMethod (declared, never crawled)
src/pages/web/WebIndexPhpPimSaveTerminationReasons2Page.ts /web/index.php/pim/saveTerminationReasons/{id} (declared, never crawled)
src/pages/web/WebIndexPhpPimSaveTerminationReasonsPage.ts /web/index.php/pim/saveTerminationReasons (declared, never crawled)
src/pages/web/WebIndexPhpRecruitmentAddCandidate2Page.ts /web/index.php/recruitment/addCandidate/{id} (declared, never crawled)
src/pages/web/WebIndexPhpRecruitmentAddCandidatePage.ts /web/index.php/recruitment/addCandidate (declared, never crawled)
src/pages/web/WebIndexPhpRecruitmentAddJobVacancy2Page.ts /web/index.php/recruitment/addJobVacancy/{id} (declared, never crawled)
src/pages/web/WebIndexPhpRecruitmentAddJobVacancyPage.ts /web/index.php/recruitment/addJobVacancy (declared, never crawled)
src/pages/web/WebIndexPhpTimeAddCustomer2Page.ts    /web/index.php/time/addCustomer/{id} (declared, never crawled)
src/pages/web/WebIndexPhpTimeAddCustomerPage.ts     /web/index.php/time/addCustomer (declared, never crawled)
src/pages/web/WebIndexPhpTimeSaveProject2Page.ts    /web/index.php/time/saveProject/{id} (declared, never crawled)
src/pages/web/WebIndexPhpTimeSaveProjectPage.ts     /web/index.php/time/saveProject (declared, never crawled)
src/pages/web/WorkShiftPage.ts                      /web/index.php/admin/workShift (declared, never crawled)
src/pages/web/WorkspaceNotificationConfigurationPage.ts /web/index.php/admin/workspaceNotificationConfiguration (declared, never crawled)
```

## Components

### Button

- kind: `field` · seen on 23 screen(s)
- addressed by identity; the library class is `src/components/Button.ts`

### Checkbox

- kind: `field` · seen on 0 screen(s)
- addressed by identity; the library class is `src/components/Checkbox.ts`

### Link

- kind: `field` · seen on 22 screen(s)
- addressed by identity; the library class is `src/components/Link.ts`

### MenuItem

- kind: `field` · seen on 0 screen(s)
- addressed by identity; the library class is `src/components/MenuItem.ts`

### NavigationBar

- kind: `region` · seen on 21 screen(s)
- file: `src/components/NavigationBar.ts`
- root selector (private to this class): `.oxd-sidepanel`
  - `clientBrandLogo` → role("link", "client brand logo")
  - `search` → role("textbox", "Search")
  - `admin` → role("link", "Admin")
  - `pIM` → role("link", "PIM")
  - `leave` → role("link", "Leave")
  - `time` → role("link", "Time")
  - `recruitment` → role("link", "Recruitment")
  - `myInfo` → role("link", "My Info")
  - `performance` → role("link", "Performance")
  - `dashboard` → role("link", "Dashboard")
  - `directory` → role("link", "Directory")
  - `maintenance` → role("link", "Maintenance")
  - `claim` → role("link", "Claim")
  - `buzz` → role("link", "Buzz")
  - `help` → role("button", "Help")

### RadioButton

- kind: `field` · seen on 0 screen(s)
- addressed by identity; the library class is `src/components/RadioButton.ts`

### RecordTable

- kind: `collection` · seen on 17 screen(s)
- rows: `.oxd-table-card` · cells: `.oxd-table-cell`

### Select

- kind: `field` · seen on 10 screen(s)
- addressed by identity; the library class is `src/components/Select.ts`

### Tab

- kind: `field` · seen on 10 screen(s)
- addressed by identity; the library class is `src/components/Tab.ts`

### TextField

- kind: `field` · seen on 15 screen(s)
- addressed by identity; the library class is `src/components/TextField.ts`

## Screens

_Strongest first: the pages worth writing tests against are at the top._

### PurgeEmployeePage

`src/pages/web/PurgeEmployeePage.ts` · route `/web/index.php/maintenance/purgeEmployee`

- testability **1.00** — 5 addressable, 0 not
- heading: none recorded
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `username` | TextField | label: "Username" [proximity] |
| `password` | TextField | label: "Password" [proximity] |
| `cancel` | Button | label: "Cancel" |
| `confirm` | Button | label: "Confirm" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewDirectoryPage

`src/pages/web/ViewDirectoryPage.ts` · route `/web/index.php/directory/viewDirectory`

- testability **0.97** — 23 addressable, 2 not
- heading: none recorded
- **2 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 2 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `jobTitle` | Select | label: "Job Title" [proximity] |
| `location` | Select | label: "Location" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewReportToDetailsEmpNumberPage

`src/pages/web/ViewReportToDetailsEmpNumberPage.ts` · route `/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}`

- testability **0.97** — 38 addressable, 1 not
- heading: none recorded
- **1 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 1 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `reportToDetailsEmpNumber` | RecordTable | — |
| `reportToDetailsEmpNumber2` | RecordTable | — |
| `reportToDetailsEmpNumber3` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewSalaryListEmpNumberPage

`src/pages/web/ViewSalaryListEmpNumberPage.ts` · route `/web/index.php/pim/viewSalaryList/empNumber/{empNumber}`

- testability **0.97** — 38 addressable, 1 not
- heading: none recorded
- **1 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 1 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `salaryListEmpNumber` | RecordTable | — |
| `salaryListEmpNumber2` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ContactDetailsEmpNumberPage

`src/pages/web/ContactDetailsEmpNumberPage.ts` · route `/web/index.php/pim/contactDetails/empNumber/{empNumber}`

- testability **0.96** — 51 addressable, 2 not
- heading: none recorded
- **1 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 2 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `contactDetailsEmpNumber` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `street1` | TextField | label: "Street 1" [proximity] |
| `street2` | TextField | label: "Street 2" [proximity] |
| `city` | TextField | label: "City" [proximity] |
| `stateProvince` | TextField | label: "State/Province" [proximity] |
| `zipPostalCode` | TextField | label: "Zip/Postal Code" [proximity] |
| `country` | Select | label: "Country" [proximity] |
| `home` | TextField | label: "Home" [proximity] |
| `mobile` | TextField | label: "Mobile" [proximity] |
| `work` | TextField | label: "Work" [proximity] |
| `workEmail` | TextField | label: "Work Email" [proximity] |
| `otherEmail` | TextField | label: "Other Email" [proximity] |
| `save` | Button | label: "Save" |
| `add` | Button | label: "Add" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewJobDetailsEmpNumberPage

`src/pages/web/ViewJobDetailsEmpNumberPage.ts` · route `/web/index.php/pim/viewJobDetails/empNumber/{empNumber}`

- testability **0.96** — 44 addressable, 2 not
- heading: none recorded
- **2 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 2 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `jobDetailsEmpNumber` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `joinedDate` | TextField | label: "Joined Date" [proximity] |
| `jobTitle` | Select | label: "Job Title" [proximity] |
| `jobCategory` | Select | label: "Job Category" [proximity] |
| `subUnit` | Select | label: "Sub Unit" [proximity] |
| `location` | Select | label: "Location" [proximity] |
| `employmentStatus` | Select | label: "Employment Status" [proximity] |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### AddEmployeePage

`src/pages/web/AddEmployeePage.ts` · route `/web/index.php/pim/addEmployee`

- testability **0.95** — 27 addressable, 3 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 3 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `employeeList` | Link | label: "Employee List" |
| `addEmployee` | Link | label: "Add Employee" |
| `reports` | Link | label: "Reports" |
| `firstName` | TextField | label: "First Name" |
| `middleName` | TextField | label: "Middle Name" |
| `lastName` | TextField | label: "Last Name" |
| `employeeId` | TextField | label: "Employee Id" [proximity] |
| `cancel` | Button | label: "Cancel" |
| `save` | Button | label: "Save" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### SearchEvaluatePerformanceReviewPage

`src/pages/web/SearchEvaluatePerformanceReviewPage.ts` · route `/web/index.php/performance/searchEvaluatePerformanceReview`

- testability **0.94** — 30 addressable, 2 not
- heading: none recorded
- **2 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 2 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `searchEvaluatePerformanceReview` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `myTrackers` | Link | label: "My Trackers" |
| `employeeTrackers` | Link | label: "Employee Trackers" |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `jobTitle` | Select | label: "Job Title" [proximity] |
| `subUnit` | Select | label: "Sub Unit" [proximity] |
| `include` | Select | label: "Include" [proximity] |
| `reviewStatus` | Select | label: "Review Status" [proximity] |
| `fromDate` | TextField | label: "From Date" [proximity] |
| `toDate` | TextField | label: "To Date" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |
| `control` | Button | label: "×" |

### ViewLeaveListPage

`src/pages/web/ViewLeaveListPage.ts` · route `/web/index.php/leave/viewLeaveList`

- testability **0.89** — 31 addressable, 4 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 4 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `leaveList` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `apply` | Link | label: "Apply" |
| `myLeave` | Link | label: "My Leave" |
| `leaveList2` | Link | label: "Leave List" |
| `assignLeave` | Link | label: "Assign Leave" |
| `fromDate` | TextField | label: "From Date" [proximity] |
| `toDate` | TextField | label: "To Date" [proximity] |
| `showLeaveWithStatus` | Select | label: "Show Leave with Status" [proximity] |
| `leaveType` | Select | label: "Leave Type" [proximity] |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `subUnit` | Select | label: "Sub Unit" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |
| `control` | Button | label: "×" |

### ViewDependentsEmpNumberPage

`src/pages/web/ViewDependentsEmpNumberPage.ts` · route `/web/index.php/pim/viewDependents/empNumber/{empNumber}`

- testability **0.88** — 38 addressable, 5 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 5 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `dependentsEmpNumber` | RecordTable | — |
| `dependentsEmpNumber2` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### IndexPage

`src/pages/web/IndexPage.ts` · route `/web/index.php/dashboard/index`

- testability **0.86** — 24 addressable, 4 not
- heading: none recorded
- **4 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 4 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `assignLeave` | Button | label: "Assign Leave" |
| `leaveList` | Button | label: "Leave List" |
| `timesheets` | Button | label: "Timesheets" |
| `applyLeave` | Button | label: "Apply Leave" |
| `myLeave` | Button | label: "My Leave" |
| `myTimesheet` | Button | label: "My Timesheet" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewPersonalDetailsEmpNumberPage

`src/pages/web/ViewPersonalDetailsEmpNumberPage.ts` · route `/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}`

- testability **0.86** — 51 addressable, 8 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 8 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `personalDetailsEmpNumber` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `firstName` | TextField | label: "First Name" |
| `middleName` | TextField | label: "Middle Name" |
| `lastName` | TextField | label: "Last Name" |
| `employeeId` | TextField | label: "Employee Id" [proximity] |
| `otherId` | TextField | label: "Other Id" [proximity] |
| `driverSLicenseNumber` | TextField | label: "Driver's License Number" [proximity] |
| `licenseExpiryDate` | TextField | label: "License Expiry Date" [proximity] |
| `nationality` | Select | label: "Nationality" [proximity] |
| `maritalStatus` | Select | label: "Marital Status" [proximity] |
| `dateOfBirth` | TextField | label: "Date of Birth" [proximity] |
| `bloodType` | Select | label: "Blood Type" [proximity] |
| `testField` | TextField | label: "Test_Field" [proximity] |
| `add` | Button | label: "Add" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewEmergencyContactsEmpNumberPage

`src/pages/web/ViewEmergencyContactsEmpNumberPage.ts` · route `/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}`

- testability **0.83** — 38 addressable, 8 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 8 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `emergencyContactsEmpNumber` | RecordTable | — |
| `emergencyContactsEmpNumber2` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewMembershipsEmpNumberPage

`src/pages/web/ViewMembershipsEmpNumberPage.ts` · route `/web/index.php/pim/viewMemberships/empNumber/{empNumber}`

- testability **0.81** — 38 addressable, 9 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 9 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `membershipsEmpNumber` | RecordTable | — |
| `membershipsEmpNumber2` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewEmployeeTimesheetPage

`src/pages/web/ViewEmployeeTimesheetPage.ts` · route `/web/index.php/time/viewEmployeeTimesheet`

- testability **0.79** — 19 addressable, 5 not
- heading: none recorded
- **2 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 5 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `employeeTimesheet` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewAssignClaimPage

`src/pages/web/ViewAssignClaimPage.ts` · route `/web/index.php/claim/viewAssignClaim`

- testability **0.76** — 32 addressable, 10 not
- heading: none recorded
- **2 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 10 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `assignClaim` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `submitClaim` | Link | label: "Submit Claim" |
| `myClaims` | Link | label: "My Claims" |
| `employeeClaims` | Link | label: "Employee Claims" |
| `assignClaim2` | Link | label: "Assign Claim" |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `referenceId` | TextField | label: "Reference Id" [proximity] |
| `eventName` | Select | label: "Event Name" [proximity] |
| `status` | Select | label: "Status" [proximity] |
| `fromDate` | TextField | label: "From Date" [proximity] |
| `toDate` | TextField | label: "To Date" [proximity] |
| `include` | Select | label: "Include" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `assignClaim3` | Button | label: "Assign Claim" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewImmigrationEmpNumberPage

`src/pages/web/ViewImmigrationEmpNumberPage.ts` · route `/web/index.php/pim/viewImmigration/empNumber/{empNumber}`

- testability **0.76** — 38 addressable, 12 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 12 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `immigrationEmpNumber` | RecordTable | — |
| `immigrationEmpNumber2` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### LoginPage

`src/pages/web/LoginPage.ts` · route `/web/index.php/auth/login`

- testability **0.70** — 3 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: no heading to assert the screen by
- missing: a recording already covers this screen
- missing: the crawl has not proved these locators unique — only the recording resolved them

| property | component | identity |
| --- | --- | --- |
| `username` | TextField | label: "Username" |
| `password` | TextField | label: "Password" |
| `login` | Button | label: "Login" |

### ViewBuzzPage

`src/pages/web/ViewBuzzPage.ts` · route `/web/index.php/buzz/viewBuzz`

- testability **0.66** — 25 addressable, 13 not
- heading: none recorded
- **13 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 13 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `whatSOnYourMind` | TextField | label: "What's on your mind?" |
| `post` | Button | label: "Post" |
| `sharePhotos` | Button | label: "Share Photos" |
| `shareVideo` | Button | label: "Share Video" |
| `mostRecentPosts` | Button | label: "Most Recent Posts" |
| `mostLikedPosts` | Button | label: "Most Liked Posts" |
| `mostCommentedPosts` | Button | label: "Most Commented Posts" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewQualificationsEmpNumberPage

`src/pages/web/ViewQualificationsEmpNumberPage.ts` · route `/web/index.php/pim/viewQualifications/empNumber/{empNumber}`

- testability **0.63** — 38 addressable, 22 not
- heading: none recorded
- **7 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 22 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `qualificationsEmpNumber` | RecordTable | — |
| `qualificationsEmpNumber2` | RecordTable | — |
| `qualificationsEmpNumber3` | RecordTable | — |
| `qualificationsEmpNumber4` | RecordTable | — |
| `qualificationsEmpNumber5` | RecordTable | — |
| `qualificationsEmpNumber6` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `personalDetails` | Tab | label: "Personal Details" |
| `personalDetails2` | Link | label: "Personal Details" |
| `contactDetails` | Tab | label: "Contact Details" |
| `contactDetails2` | Link | label: "Contact Details" |
| `emergencyContacts` | Tab | label: "Emergency Contacts" |
| `emergencyContacts2` | Link | label: "Emergency Contacts" |
| `dependents` | Tab | label: "Dependents" |
| `dependents2` | Link | label: "Dependents" |
| `immigration` | Tab | label: "Immigration" |
| `immigration2` | Link | label: "Immigration" |
| `job` | Tab | label: "Job" |
| `job2` | Link | label: "Job" |
| `salary` | Tab | label: "Salary" |
| `salary2` | Link | label: "Salary" |
| `reportTo` | Tab | label: "Report-to" |
| `reportTo2` | Link | label: "Report-to" |
| `qualifications` | Tab | label: "Qualifications" |
| `qualifications2` | Link | label: "Qualifications" |
| `memberships` | Tab | label: "Memberships" |
| `memberships2` | Link | label: "Memberships" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewEmployeeListPage

`src/pages/web/ViewEmployeeListPage.ts` · route `/web/index.php/pim/viewEmployeeList`

- testability **0.19** — 35 addressable, 153 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 153 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `employeeList` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `employeeList2` | Link | label: "Employee List" |
| `addEmployee` | Link | label: "Add Employee" |
| `reports` | Link | label: "Reports" |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `employeeId` | TextField | label: "Employee Id" [proximity] |
| `employmentStatus` | Select | label: "Employment Status" [proximity] |
| `include` | Select | label: "Include" [proximity] |
| `supervisorName` | TextField | label: "Supervisor Name" [proximity] |
| `jobTitle` | Select | label: "Job Title" [proximity] |
| `subUnit` | Select | label: "Sub Unit" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `add` | Button | label: "Add" |
| `control1` | Button | label: "1" |
| `control2` | Button | label: "2" |
| `control3` | Button | label: "3" |
| `control4` | Button | label: "4" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewSystemUsersPage

`src/pages/web/ViewSystemUsersPage.ts` · route `/web/index.php/admin/viewSystemUsers`

- testability **0.19** — 27 addressable, 117 not
- heading: none recorded
- **2 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 117 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `systemUsers` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `nationalities` | Link | label: "Nationalities" |
| `corporateBranding` | Link | label: "Corporate Branding" |
| `username` | TextField | label: "Username" [proximity] |
| `userRole` | Select | label: "User Role" [proximity] |
| `employeeName` | TextField | label: "Employee Name" [proximity] |
| `status` | Select | label: "Status" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `add` | Button | label: "Add" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### ViewCandidatesPage

`src/pages/web/ViewCandidatesPage.ts` · route `/web/index.php/recruitment/viewCandidates`

- testability **0.15** — 34 addressable, 188 not
- heading: none recorded
- **3 element(s) cannot be addressed** — no label, role name or field identifier. Nothing on the page object will reach them.
- missing: 188 control(s) cannot be addressed by name
- missing: no heading to assert the screen by

| property | component | identity |
| --- | --- | --- |
| `navigation` | NavigationBar | — |
| `candidates` | RecordTable | — |
| `upgrade` | Link | label: "Upgrade" |
| `upgrade2` | Button | label: "Upgrade" |
| `candidates2` | Link | label: "Candidates" |
| `vacancies` | Link | label: "Vacancies" |
| `jobTitle` | Select | label: "Job Title" [proximity] |
| `vacancy` | Select | label: "Vacancy" [proximity] |
| `hiringManager` | Select | label: "Hiring Manager" [proximity] |
| `status` | Select | label: "Status" [proximity] |
| `candidateName` | TextField | label: "Candidate Name" [proximity] |
| `keywords` | TextField | label: "Keywords" [proximity] |
| `dateOfApplication` | TextField | label: "Date of Application" [proximity] |
| `to` | TextField | label: "To" |
| `methodOfApplication` | Select | label: "Method of Application" [proximity] |
| `reset` | Button | label: "Reset" |
| `search` | Button | label: "Search" |
| `add` | Button | label: "Add" |
| `control1` | Button | label: "1" |
| `control2` | Button | label: "2" |
| `orangeHRMInc` | Link | label: "OrangeHRM, Inc" |

### AddAuthProviderPage

`src/pages/web/AddAuthProviderPage.ts` · route `/web/index.phpadmin/addAuthProvider`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AddLeaveEntitlementPage

`src/pages/web/AddLeaveEntitlementPage.ts` · route `/web/index.php/leave/addLeaveEntitlement`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AddThemePage

`src/pages/web/AddThemePage.ts` · route `/web/index.php/admin/addTheme`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ApplyLeavePage

`src/pages/web/ApplyLeavePage.ts` · route `/web/index.php/leave/applyLeave`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ApplyVacancyIdPage

`src/pages/web/ApplyVacancyIdPage.ts` · route `/web/index.php/recruitmentApply/applyVacancy/id/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AssignClaimIdPage

`src/pages/web/AssignClaimIdPage.ts` · route `/web/index.php/claim/assignClaim/id/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AssignClaimPage

`src/pages/web/AssignClaimPage.ts` · route `/web/index.php/claim/assignClaim`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AssignLeavePage

`src/pages/web/AssignLeavePage.ts` · route `/web/index.php/leave/assignLeave`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AttachmentPage

`src/pages/web/AttachmentPage.ts` · route `/web/index.php/recruitment/viewInterviewAttachment/interview/{interviewId}/attachment/{attachmentId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AttachmentsImagePage

`src/pages/web/AttachmentsImagePage.ts` · route `/web/index.php/admin/theme/attachments/image/{imageName}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### AuthorizePage

`src/pages/web/AuthorizePage.ts` · route `/web/index.php/oauth2/authorize`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### CandidateHistoryPage

`src/pages/web/CandidateHistoryPage.ts` · route `/web/index.php/recruitment/candidateHistory/{candidateId}/{historyId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### CandidateIdPage

`src/pages/web/CandidateIdPage.ts` · route `/web/index.php/recruitment/viewCandidateAttachment/candidateId/{candidateId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ChangeCandidateVacancyStatusPage

`src/pages/web/ChangeCandidateVacancyStatusPage.ts` · route `/web/index.php/recruitment/changeCandidateVacancyStatus`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ChangeWeakPasswordResetCodePage

`src/pages/web/ChangeWeakPasswordResetCodePage.ts` · route `/web/index.php/auth/changeWeakPassword/resetCode/{resetCode}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ConfigurePage

`src/pages/web/ConfigurePage.ts` · route `/web/index.php/attendance/configure`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ConfigurePimPage

`src/pages/web/ConfigurePimPage.ts` · route `/web/index.php/pim/configurePim`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ConsentPage

`src/pages/web/ConsentPage.ts` · route `/web/index.php/oauth2/authorize/consent`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DefineLeavePeriodPage

`src/pages/web/DefineLeavePeriodPage.ts` · route `/web/index.php/leave/defineLeavePeriod`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DefineTimesheetPeriodPage

`src/pages/web/DefineTimesheetPeriodPage.ts` · route `/web/index.php/time/defineTimesheetPeriod`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DefineWorkWeekPage

`src/pages/web/DefineWorkWeekPage.ts` · route `/web/index.php/leave/defineWorkWeek`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DisplayAttendanceSummaryReportCriteriaPage

`src/pages/web/DisplayAttendanceSummaryReportCriteriaPage.ts` · route `/web/index.php/time/displayAttendanceSummaryReportCriteria`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DisplayEmployeeReportCriteriaPage

`src/pages/web/DisplayEmployeeReportCriteriaPage.ts` · route `/web/index.php/time/displayEmployeeReportCriteria`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DisplayPredefinedReportPage

`src/pages/web/DisplayPredefinedReportPage.ts` · route `/web/index.php/pim/displayPredefinedReport/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DisplayProjectActivityDetailsReportPage

`src/pages/web/DisplayProjectActivityDetailsReportPage.ts` · route `/web/index.php/time/displayProjectActivityDetailsReport`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### DisplayProjectReportCriteriaPage

`src/pages/web/DisplayProjectReportCriteriaPage.ts` · route `/web/index.php/time/displayProjectReportCriteria`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EditAttendanceRecordPage

`src/pages/web/EditAttendanceRecordPage.ts` · route `/web/index.php/attendance/editAttendanceRecord/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EditAuthProviderPage

`src/pages/web/EditAuthProviderPage.ts` · route `/web/index.phpadmin/editAuthProvider/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EditEmployeeAttendanceRecordPage

`src/pages/web/EditEmployeeAttendanceRecordPage.ts` · route `/web/index.php/attendance/editEmployeeAttendanceRecord/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EditLeaveEntitlementPage

`src/pages/web/EditLeaveEntitlementPage.ts` · route `/web/index.php/leave/editLeaveEntitlement/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EditOAuthClientPage

`src/pages/web/EditOAuthClientPage.ts` · route `/web/index.php/admin/editOAuthClient`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EditTimesheetPage

`src/pages/web/EditTimesheetPage.ts` · route `/web/index.php/time/editTimesheet/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EmployeeIdPage

`src/pages/web/EmployeeIdPage.ts` · route `/web/index.php/time/viewTimesheet/employeeId/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EmploymentStatusPage

`src/pages/web/EmploymentStatusPage.ts` · route `/web/index.php/admin/employmentStatus`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### EmpNumberAttachIdPage

`src/pages/web/EmpNumberAttachIdPage.ts` · route `/web/index.php/pim/viewAttachment/empNumber/{empNumber}/attachId/{attachId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### FixLanguageStringErrorsPage

`src/pages/web/FixLanguageStringErrorsPage.ts` · route `/web/index.php/admin/fixLanguageStringErrors/{languageId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### HelpPage

`src/pages/web/HelpPage.ts` · route `/web/index.php/help/help`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### IndexPhpPage

`src/pages/web/IndexPhpPage.ts` · route `/web/index.php/`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### InterviewAttachmentsPage

`src/pages/web/InterviewAttachmentsPage.ts` · route `/web/index.php/recruitment/interviewAttachments/{interviewId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### JobCategoryPage

`src/pages/web/JobCategoryPage.ts` · route `/web/index.php/admin/jobCategory`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### JobsHtmlPage

`src/pages/web/JobsHtmlPage.ts` · route `/web/index.php/recruitmentApply/jobs.html`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### JobsRssPage

`src/pages/web/JobsRssPage.ts` · route `/web/index.php/recruitmentApply/jobs.rss`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LanguageCustomizationPage

`src/pages/web/LanguageCustomizationPage.ts` · route `/web/index.php/admin/languageCustomization/{languageId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LanguageIdPage

`src/pages/web/LanguageIdPage.ts` · route `/web/index.php/admin/viewLanguagePackage/languageId/{languageId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LanguageImportPage

`src/pages/web/LanguageImportPage.ts` · route `/web/index.php/admin/languageImport/{languageId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LanguagePackagePage

`src/pages/web/LanguagePackagePage.ts` · route `/web/index.php/admin/languagePackage`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LdapConfigurationPage

`src/pages/web/LdapConfigurationPage.ts` · route `/web/index.php/admin/ldapConfiguration`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LeaveTypeListPage

`src/pages/web/LeaveTypeListPage.ts` · route `/web/index.php/leave/leaveTypeList`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ListCustomFieldsPage

`src/pages/web/ListCustomFieldsPage.ts` · route `/web/index.php/pim/listCustomFields`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ListMailConfigurationPage

`src/pages/web/ListMailConfigurationPage.ts` · route `/web/index.php/admin/listMailConfiguration`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LocalizationPage

`src/pages/web/LocalizationPage.ts` · route `/web/index.php/admin/localization`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LogoutPage

`src/pages/web/LogoutPage.ts` · route `/web/index.php/auth/logout`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### LogsPage

`src/pages/web/LogsPage.ts` · route `/web/index.phpapi/v2/performance/trackers/{trackerId}/logs/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### MembershipPage

`src/pages/web/MembershipPage.ts` · route `/web/index.php/admin/membership`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### MessagesPage

`src/pages/web/MessagesPage.ts` · route `/web/index.php/core/i18n/messages`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### MyPerformanceReviewPage

`src/pages/web/MyPerformanceReviewPage.ts` · route `/web/index.php/performance/myPerformanceReview`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### NationalityPage

`src/pages/web/NationalityPage.ts` · route `/web/index.php/admin/nationality`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### OpenIdProviderPage

`src/pages/web/OpenIdProviderPage.ts` · route `/web/index.php/admin/openIdProvider`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### PhotoPage

`src/pages/web/PhotoPage.ts` · route `/web/index.php/buzz/photo/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### PimCsvImportPage

`src/pages/web/PimCsvImportPage.ts` · route `/web/index.php/pim/pimCsvImport`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ProxyPunchInPunchOutPage

`src/pages/web/ProxyPunchInPunchOutPage.ts` · route `/web/index.php/attendance/proxyPunchInPunchOut`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### PunchInPage

`src/pages/web/PunchInPage.ts` · route `/web/index.php/attendance/punchIn`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### PunchOutPage

`src/pages/web/PunchOutPage.ts` · route `/web/index.php/attendance/punchOut`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### PurgeCandidateDataPage

`src/pages/web/PurgeCandidateDataPage.ts` · route `/web/index.php/maintenance/purgeCandidateData`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### RegisterOAuthClientPage

`src/pages/web/RegisterOAuthClientPage.ts` · route `/web/index.php/admin/registerOAuthClient`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### RequestPasswordResetCodePage

`src/pages/web/RequestPasswordResetCodePage.ts` · route `/web/index.php/auth/requestPasswordResetCode`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### RequestsAttachIdPage

`src/pages/web/RequestsAttachIdPage.ts` · route `/web/index.php/claim/requests/{requestId}/attachId/{attachId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ResetPasswordResetCodePage

`src/pages/web/ResetPasswordResetCodePage.ts` · route `/web/index.php/auth/resetPassword/resetCode/{resetCode}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ReviewEvaluateByAdminPage

`src/pages/web/ReviewEvaluateByAdminPage.ts` · route `/web/index.php/performance/reviewEvaluateByAdmin/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ReviewEvaluateIdPage

`src/pages/web/ReviewEvaluateIdPage.ts` · route `/web/index.php/performance/reviewEvaluate/id/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SampleCsvDownloadPage

`src/pages/web/SampleCsvDownloadPage.ts` · route `/web/index.php/pim/sampleCsvDownload`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SaveOAuthClientPage

`src/pages/web/SaveOAuthClientPage.ts` · route `/web/index.php/admin/saveOAuthClient`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SaveSubscriberPage

`src/pages/web/SaveSubscriberPage.ts` · route `/web/index.php/admin/saveSubscriber/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SearchKpiPage

`src/pages/web/SearchKpiPage.ts` · route `/web/index.php/performance/searchKpi`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SearchPerformanceReviewPage

`src/pages/web/SearchPerformanceReviewPage.ts` · route `/web/index.php/performance/searchPerformanceReview`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SendPasswordResetFailurePage

`src/pages/web/SendPasswordResetFailurePage.ts` · route `/web/index.php/auth/sendPasswordResetFailure`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SendPasswordResetPage

`src/pages/web/SendPasswordResetPage.ts` · route `/web/index.php/auth/sendPasswordReset`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SubmitClaimIdPage

`src/pages/web/SubmitClaimIdPage.ts` · route `/web/index.php/claim/submitClaim/id/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SubmitClaimPage

`src/pages/web/SubmitClaimPage.ts` · route `/web/index.php/claim/submitClaim`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SupportPage

`src/pages/web/SupportPage.ts` · route `/web/index.php/help/support`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### SystemCheckPage

`src/pages/web/SystemCheckPage.ts` · route `/web/index.php/core/system-check`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ThemeImagePage

`src/pages/web/ThemeImagePage.ts` · route `/web/index.php/admin/theme/image/{imageName}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### TrackIdPage

`src/pages/web/TrackIdPage.ts` · route `/web/index.php/performance/addPerformanceTrackerLog/trackId/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### UpdatePasswordPage

`src/pages/web/UpdatePasswordPage.ts` · route `/web/index.php/pim/updatePassword`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewAdminModulePage

`src/pages/web/ViewAdminModulePage.ts` · route `/web/index.php/admin/viewAdminModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewAttendanceRecordPage

`src/pages/web/ViewAttendanceRecordPage.ts` · route `/web/index.php/attendance/viewAttendanceRecord`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewClaimModulePage

`src/pages/web/ViewClaimModulePage.ts` · route `/web/index.php/claim/viewClaimModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewClaimPage

`src/pages/web/ViewClaimPage.ts` · route `/web/index.php/claim/viewClaim`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewCompanyStructurePage

`src/pages/web/ViewCompanyStructurePage.ts` · route `/web/index.php/admin/viewCompanyStructure`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewCustomersPage

`src/pages/web/ViewCustomersPage.ts` · route `/web/index.php/time/viewCustomers`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewDefinedPredefinedReportsPage

`src/pages/web/ViewDefinedPredefinedReportsPage.ts` · route `/web/index.php/pim/viewDefinedPredefinedReports`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewEducationPage

`src/pages/web/ViewEducationPage.ts` · route `/web/index.php/admin/viewEducation`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewEmailNotificationPage

`src/pages/web/ViewEmailNotificationPage.ts` · route `/web/index.php/admin/viewEmailNotification`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewEmployeePerformanceTrackerListPage

`src/pages/web/ViewEmployeePerformanceTrackerListPage.ts` · route `/web/index.php/performance/viewEmployeePerformanceTrackerList`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewEventsPage

`src/pages/web/ViewEventsPage.ts` · route `/web/index.php/claim/viewEvents`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewExpensePage

`src/pages/web/ViewExpensePage.ts` · route `/web/index.php/claim/viewExpense`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewHolidayListPage

`src/pages/web/ViewHolidayListPage.ts` · route `/web/index.php/leave/viewHolidayList`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewJobSpecificationAttachIdPage

`src/pages/web/ViewJobSpecificationAttachIdPage.ts` · route `/web/index.php/admin/viewJobSpecification/attachId/{attachId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewJobTitleListPage

`src/pages/web/ViewJobTitleListPage.ts` · route `/web/index.php/admin/viewJobTitleList`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewJobVacancyPage

`src/pages/web/ViewJobVacancyPage.ts` · route `/web/index.php/recruitment/viewJobVacancy`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLanguagesPage

`src/pages/web/ViewLanguagesPage.ts` · route `/web/index.php/admin/viewLanguages`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLeaveBalanceReportPage

`src/pages/web/ViewLeaveBalanceReportPage.ts` · route `/web/index.php/leave/viewLeaveBalanceReport`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLeaveEntitlementsPage

`src/pages/web/ViewLeaveEntitlementsPage.ts` · route `/web/index.php/leave/viewLeaveEntitlements`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLeaveModulePage

`src/pages/web/ViewLeaveModulePage.ts` · route `/web/index.php/leave/viewLeaveModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLeaveRequestPage

`src/pages/web/ViewLeaveRequestPage.ts` · route `/web/index.php/leave/viewLeaveRequest/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLicensesPage

`src/pages/web/ViewLicensesPage.ts` · route `/web/index.php/admin/viewLicenses`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewLocationsPage

`src/pages/web/ViewLocationsPage.ts` · route `/web/index.php/admin/viewLocations`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMaintenanceModulePage

`src/pages/web/ViewMaintenanceModulePage.ts` · route `/web/index.php/maintenance/viewMaintenanceModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewModulesPage

`src/pages/web/ViewModulesPage.ts` · route `/web/index.php/admin/viewModules`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyAttendanceRecordPage

`src/pages/web/ViewMyAttendanceRecordPage.ts` · route `/web/index.php/attendance/viewMyAttendanceRecord`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyDetailsPage

`src/pages/web/ViewMyDetailsPage.ts` · route `/web/index.php/pim/viewMyDetails`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyLeaveBalanceReportPage

`src/pages/web/ViewMyLeaveBalanceReportPage.ts` · route `/web/index.php/leave/viewMyLeaveBalanceReport`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyLeaveEntitlementsPage

`src/pages/web/ViewMyLeaveEntitlementsPage.ts` · route `/web/index.php/leave/viewMyLeaveEntitlements`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyLeaveListPage

`src/pages/web/ViewMyLeaveListPage.ts` · route `/web/index.php/leave/viewMyLeaveList`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyPerformanceTrackerListPage

`src/pages/web/ViewMyPerformanceTrackerListPage.ts` · route `/web/index.php/performance/viewMyPerformanceTrackerList`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewMyTimesheetPage

`src/pages/web/ViewMyTimesheetPage.ts` · route `/web/index.php/time/viewMyTimesheet`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewOrganizationGeneralInformationPage

`src/pages/web/ViewOrganizationGeneralInformationPage.ts` · route `/web/index.php/admin/viewOrganizationGeneralInformation`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewPayGradesPage

`src/pages/web/ViewPayGradesPage.ts` · route `/web/index.php/admin/viewPayGrades`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewPerformanceModulePage

`src/pages/web/ViewPerformanceModulePage.ts` · route `/web/index.php/performance/viewPerformanceModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewPerformanceTrackerPage

`src/pages/web/ViewPerformanceTrackerPage.ts` · route `/web/index.php/performance/viewPerformanceTracker`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewPhotoEmpNumberPage

`src/pages/web/ViewPhotoEmpNumberPage.ts` · route `/web/index.php/pim/viewPhoto/empNumber/{empNumber}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewPhotographEmpNumberPage

`src/pages/web/ViewPhotographEmpNumberPage.ts` · route `/web/index.php/pim/viewPhotograph/empNumber/{empNumber}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewPimModulePage

`src/pages/web/ViewPimModulePage.ts` · route `/web/index.php/pim/viewPimModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewProjectsPage

`src/pages/web/ViewProjectsPage.ts` · route `/web/index.php/time/viewProjects`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewRecruitmentModulePage

`src/pages/web/ViewRecruitmentModulePage.ts` · route `/web/index.php/recruitment/viewRecruitmentModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewReportingMethodsPage

`src/pages/web/ViewReportingMethodsPage.ts` · route `/web/index.php/pim/viewReportingMethods`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewSkillsPage

`src/pages/web/ViewSkillsPage.ts` · route `/web/index.php/admin/viewSkills`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewTerminationReasonsPage

`src/pages/web/ViewTerminationReasonsPage.ts` · route `/web/index.php/pim/viewTerminationReasons`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewTimeModulePage

`src/pages/web/ViewTimeModulePage.ts` · route `/web/index.php/time/viewTimeModule`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewUsTaxExemptionsEmpNumberPage

`src/pages/web/ViewUsTaxExemptionsEmpNumberPage.ts` · route `/web/index.php/pim/viewUsTaxExemptions/empNumber/{empNumber}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### ViewVacancyAttachmentAttachIdPage

`src/pages/web/ViewVacancyAttachmentAttachIdPage.ts` · route `/web/index.php/recruitment/viewVacancyAttachment/attachId/{attachId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminPayGrade2Page

`src/pages/web/WebIndexPhpAdminPayGrade2Page.ts` · route `/web/index.php/admin/payGrade/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminPayGradePage

`src/pages/web/WebIndexPhpAdminPayGradePage.ts` · route `/web/index.php/admin/payGrade`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveEducation2Page

`src/pages/web/WebIndexPhpAdminSaveEducation2Page.ts` · route `/web/index.php/admin/saveEducation/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveEducationPage

`src/pages/web/WebIndexPhpAdminSaveEducationPage.ts` · route `/web/index.php/admin/saveEducation`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveEmploymentStatus2Page

`src/pages/web/WebIndexPhpAdminSaveEmploymentStatus2Page.ts` · route `/web/index.php/admin/saveEmploymentStatus/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveEmploymentStatusPage

`src/pages/web/WebIndexPhpAdminSaveEmploymentStatusPage.ts` · route `/web/index.php/admin/saveEmploymentStatus`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveJobCategory2Page

`src/pages/web/WebIndexPhpAdminSaveJobCategory2Page.ts` · route `/web/index.php/admin/saveJobCategory/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveJobCategoryPage

`src/pages/web/WebIndexPhpAdminSaveJobCategoryPage.ts` · route `/web/index.php/admin/saveJobCategory`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveJobTitle2Page

`src/pages/web/WebIndexPhpAdminSaveJobTitle2Page.ts` · route `/web/index.php/admin/saveJobTitle/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveJobTitlePage

`src/pages/web/WebIndexPhpAdminSaveJobTitlePage.ts` · route `/web/index.php/admin/saveJobTitle`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveLanguages2Page

`src/pages/web/WebIndexPhpAdminSaveLanguages2Page.ts` · route `/web/index.php/admin/saveLanguages/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveLanguagesPage

`src/pages/web/WebIndexPhpAdminSaveLanguagesPage.ts` · route `/web/index.php/admin/saveLanguages`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveLicenses2Page

`src/pages/web/WebIndexPhpAdminSaveLicenses2Page.ts` · route `/web/index.php/admin/saveLicenses/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveLicensesPage

`src/pages/web/WebIndexPhpAdminSaveLicensesPage.ts` · route `/web/index.php/admin/saveLicenses`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveLocation2Page

`src/pages/web/WebIndexPhpAdminSaveLocation2Page.ts` · route `/web/index.php/admin/saveLocation/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveLocationPage

`src/pages/web/WebIndexPhpAdminSaveLocationPage.ts` · route `/web/index.php/admin/saveLocation`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveMemberships2Page

`src/pages/web/WebIndexPhpAdminSaveMemberships2Page.ts` · route `/web/index.php/admin/saveMemberships/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveMembershipsPage

`src/pages/web/WebIndexPhpAdminSaveMembershipsPage.ts` · route `/web/index.php/admin/saveMemberships`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveNationality2Page

`src/pages/web/WebIndexPhpAdminSaveNationality2Page.ts` · route `/web/index.php/admin/saveNationality/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveNationalityPage

`src/pages/web/WebIndexPhpAdminSaveNationalityPage.ts` · route `/web/index.php/admin/saveNationality`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveSkills2Page

`src/pages/web/WebIndexPhpAdminSaveSkills2Page.ts` · route `/web/index.php/admin/saveSkills/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveSkillsPage

`src/pages/web/WebIndexPhpAdminSaveSkillsPage.ts` · route `/web/index.php/admin/saveSkills`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveSystemUser2Page

`src/pages/web/WebIndexPhpAdminSaveSystemUser2Page.ts` · route `/web/index.php/admin/saveSystemUser/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveSystemUserPage

`src/pages/web/WebIndexPhpAdminSaveSystemUserPage.ts` · route `/web/index.php/admin/saveSystemUser`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveWorkShifts2Page

`src/pages/web/WebIndexPhpAdminSaveWorkShifts2Page.ts` · route `/web/index.php/admin/saveWorkShifts/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpAdminSaveWorkShiftsPage

`src/pages/web/WebIndexPhpAdminSaveWorkShiftsPage.ts` · route `/web/index.php/admin/saveWorkShifts`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpClaimSaveEvents2Page

`src/pages/web/WebIndexPhpClaimSaveEvents2Page.ts` · route `/web/index.php/claim/saveEvents/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpClaimSaveEventsPage

`src/pages/web/WebIndexPhpClaimSaveEventsPage.ts` · route `/web/index.php/claim/saveEvents`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpClaimSaveExpense2Page

`src/pages/web/WebIndexPhpClaimSaveExpense2Page.ts` · route `/web/index.php/claim/saveExpense/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpClaimSaveExpensePage

`src/pages/web/WebIndexPhpClaimSaveExpensePage.ts` · route `/web/index.php/claim/saveExpense`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpLeaveDefineLeaveType2Page

`src/pages/web/WebIndexPhpLeaveDefineLeaveType2Page.ts` · route `/web/index.php/leave/defineLeaveType/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpLeaveDefineLeaveTypePage

`src/pages/web/WebIndexPhpLeaveDefineLeaveTypePage.ts` · route `/web/index.php/leave/defineLeaveType`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpLeaveSaveHolidays2Page

`src/pages/web/WebIndexPhpLeaveSaveHolidays2Page.ts` · route `/web/index.php/leave/saveHolidays/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpLeaveSaveHolidaysPage

`src/pages/web/WebIndexPhpLeaveSaveHolidaysPage.ts` · route `/web/index.php/leave/saveHolidays`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpMaintenanceAccessEmployeeData2Page

`src/pages/web/WebIndexPhpMaintenanceAccessEmployeeData2Page.ts` · route `/web/index.php/maintenance/accessEmployeeData/{empNumber}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpMaintenanceAccessEmployeeDataPage

`src/pages/web/WebIndexPhpMaintenanceAccessEmployeeDataPage.ts` · route `/web/index.php/maintenance/accessEmployeeData`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpOpenidauthOpenIdCredentials2Page

`src/pages/web/WebIndexPhpOpenidauthOpenIdCredentials2Page.ts` · route `/web/index.php/openidauth/openIdCredentials/{providerId}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpOpenidauthOpenIdCredentialsPage

`src/pages/web/WebIndexPhpOpenidauthOpenIdCredentialsPage.ts` · route `/web/index.php/openidauth/openIdCredentials`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPerformanceAddPerformanceTracker2Page

`src/pages/web/WebIndexPhpPerformanceAddPerformanceTracker2Page.ts` · route `/web/index.php/performance/addPerformanceTracker/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPerformanceAddPerformanceTrackerPage

`src/pages/web/WebIndexPhpPerformanceAddPerformanceTrackerPage.ts` · route `/web/index.php/performance/addPerformanceTracker`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPerformanceSaveKpi2Page

`src/pages/web/WebIndexPhpPerformanceSaveKpi2Page.ts` · route `/web/index.php/performance/saveKpi/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPerformanceSaveKpiPage

`src/pages/web/WebIndexPhpPerformanceSaveKpiPage.ts` · route `/web/index.php/performance/saveKpi`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPerformanceSaveReview2Page

`src/pages/web/WebIndexPhpPerformanceSaveReview2Page.ts` · route `/web/index.php/performance/saveReview/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPerformanceSaveReviewPage

`src/pages/web/WebIndexPhpPerformanceSaveReviewPage.ts` · route `/web/index.php/performance/saveReview`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimDefinePredefinedReport2Page

`src/pages/web/WebIndexPhpPimDefinePredefinedReport2Page.ts` · route `/web/index.php/pim/definePredefinedReport/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimDefinePredefinedReportPage

`src/pages/web/WebIndexPhpPimDefinePredefinedReportPage.ts` · route `/web/index.php/pim/definePredefinedReport`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimSaveCustomFields2Page

`src/pages/web/WebIndexPhpPimSaveCustomFields2Page.ts` · route `/web/index.php/pim/saveCustomFields/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimSaveCustomFieldsPage

`src/pages/web/WebIndexPhpPimSaveCustomFieldsPage.ts` · route `/web/index.php/pim/saveCustomFields`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimSaveReportingMethod2Page

`src/pages/web/WebIndexPhpPimSaveReportingMethod2Page.ts` · route `/web/index.php/pim/saveReportingMethod/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimSaveReportingMethodPage

`src/pages/web/WebIndexPhpPimSaveReportingMethodPage.ts` · route `/web/index.php/pim/saveReportingMethod`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimSaveTerminationReasons2Page

`src/pages/web/WebIndexPhpPimSaveTerminationReasons2Page.ts` · route `/web/index.php/pim/saveTerminationReasons/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpPimSaveTerminationReasonsPage

`src/pages/web/WebIndexPhpPimSaveTerminationReasonsPage.ts` · route `/web/index.php/pim/saveTerminationReasons`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpRecruitmentAddCandidate2Page

`src/pages/web/WebIndexPhpRecruitmentAddCandidate2Page.ts` · route `/web/index.php/recruitment/addCandidate/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpRecruitmentAddCandidatePage

`src/pages/web/WebIndexPhpRecruitmentAddCandidatePage.ts` · route `/web/index.php/recruitment/addCandidate`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpRecruitmentAddJobVacancy2Page

`src/pages/web/WebIndexPhpRecruitmentAddJobVacancy2Page.ts` · route `/web/index.php/recruitment/addJobVacancy/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpRecruitmentAddJobVacancyPage

`src/pages/web/WebIndexPhpRecruitmentAddJobVacancyPage.ts` · route `/web/index.php/recruitment/addJobVacancy`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpTimeAddCustomer2Page

`src/pages/web/WebIndexPhpTimeAddCustomer2Page.ts` · route `/web/index.php/time/addCustomer/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpTimeAddCustomerPage

`src/pages/web/WebIndexPhpTimeAddCustomerPage.ts` · route `/web/index.php/time/addCustomer`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpTimeSaveProject2Page

`src/pages/web/WebIndexPhpTimeSaveProject2Page.ts` · route `/web/index.php/time/saveProject/{id}`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WebIndexPhpTimeSaveProjectPage

`src/pages/web/WebIndexPhpTimeSaveProjectPage.ts` · route `/web/index.php/time/saveProject`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WorkShiftPage

`src/pages/web/WorkShiftPage.ts` · route `/web/index.php/admin/workShift`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

### WorkspaceNotificationConfigurationPage

`src/pages/web/WorkspaceNotificationConfigurationPage.ts` · route `/web/index.php/admin/workspaceNotificationConfiguration`

- testability **0.00** — 0 addressable, 0 not
- heading: none recorded
- **the crawl never reached this route.** It is declared in the app's source, so the page object will carry a URL and nothing else.
- missing: the crawl never reached this route — only its URL is known

## Warnings

**196 screen(s) score below 0.3.** A page object will be emitted for each,
carrying a URL and whatever the source declared. That is not a defect in the app — it is
a request for evidence. Record the flow, re-compile, and the next draft says more.

- ViewEmployeeListPage (`/web/index.php/pim/viewEmployeeList`)
- ViewSystemUsersPage (`/web/index.php/admin/viewSystemUsers`)
- ViewCandidatesPage (`/web/index.php/recruitment/viewCandidates`)
- AddAuthProviderPage (`/web/index.phpadmin/addAuthProvider`)
- AddLeaveEntitlementPage (`/web/index.php/leave/addLeaveEntitlement`)
- AddThemePage (`/web/index.php/admin/addTheme`)
- ApplyLeavePage (`/web/index.php/leave/applyLeave`)
- ApplyVacancyIdPage (`/web/index.php/recruitmentApply/applyVacancy/id/{id}`)
- AssignClaimIdPage (`/web/index.php/claim/assignClaim/id/{id}`)
- AssignClaimPage (`/web/index.php/claim/assignClaim`)
- AssignLeavePage (`/web/index.php/leave/assignLeave`)
- AttachmentPage (`/web/index.php/recruitment/viewInterviewAttachment/interview/{interviewId}/attachment/{attachmentId}`)
- AttachmentsImagePage (`/web/index.php/admin/theme/attachments/image/{imageName}`)
- AuthorizePage (`/web/index.php/oauth2/authorize`)
- CandidateHistoryPage (`/web/index.php/recruitment/candidateHistory/{candidateId}/{historyId}`)
- CandidateIdPage (`/web/index.php/recruitment/viewCandidateAttachment/candidateId/{candidateId}`)
- ChangeCandidateVacancyStatusPage (`/web/index.php/recruitment/changeCandidateVacancyStatus`)
- ChangeWeakPasswordResetCodePage (`/web/index.php/auth/changeWeakPassword/resetCode/{resetCode}`)
- ConfigurePage (`/web/index.php/attendance/configure`)
- ConfigurePimPage (`/web/index.php/pim/configurePim`)
- ConsentPage (`/web/index.php/oauth2/authorize/consent`)
- DefineLeavePeriodPage (`/web/index.php/leave/defineLeavePeriod`)
- DefineTimesheetPeriodPage (`/web/index.php/time/defineTimesheetPeriod`)
- DefineWorkWeekPage (`/web/index.php/leave/defineWorkWeek`)
- DisplayAttendanceSummaryReportCriteriaPage (`/web/index.php/time/displayAttendanceSummaryReportCriteria`)
- DisplayEmployeeReportCriteriaPage (`/web/index.php/time/displayEmployeeReportCriteria`)
- DisplayPredefinedReportPage (`/web/index.php/pim/displayPredefinedReport/{id}`)
- DisplayProjectActivityDetailsReportPage (`/web/index.php/time/displayProjectActivityDetailsReport`)
- DisplayProjectReportCriteriaPage (`/web/index.php/time/displayProjectReportCriteria`)
- EditAttendanceRecordPage (`/web/index.php/attendance/editAttendanceRecord/{id}`)
- EditAuthProviderPage (`/web/index.phpadmin/editAuthProvider/{id}`)
- EditEmployeeAttendanceRecordPage (`/web/index.php/attendance/editEmployeeAttendanceRecord/{id}`)
- EditLeaveEntitlementPage (`/web/index.php/leave/editLeaveEntitlement/{id}`)
- EditOAuthClientPage (`/web/index.php/admin/editOAuthClient`)
- EditTimesheetPage (`/web/index.php/time/editTimesheet/{id}`)
- EmployeeIdPage (`/web/index.php/time/viewTimesheet/employeeId/{id}`)
- EmploymentStatusPage (`/web/index.php/admin/employmentStatus`)
- EmpNumberAttachIdPage (`/web/index.php/pim/viewAttachment/empNumber/{empNumber}/attachId/{attachId}`)
- FixLanguageStringErrorsPage (`/web/index.php/admin/fixLanguageStringErrors/{languageId}`)
- HelpPage (`/web/index.php/help/help`)
- …and 156 more

**21 screen(s) hold elements nothing can address.**

- ViewDirectoryPage — 2 element(s)
- ViewReportToDetailsEmpNumberPage — 1 element(s)
- ViewSalaryListEmpNumberPage — 1 element(s)
- ContactDetailsEmpNumberPage — 1 element(s)
- ViewJobDetailsEmpNumberPage — 2 element(s)
- AddEmployeePage — 3 element(s)
- SearchEvaluatePerformanceReviewPage — 2 element(s)
- ViewLeaveListPage — 3 element(s)
- ViewDependentsEmpNumberPage — 3 element(s)
- IndexPage — 4 element(s)
- ViewPersonalDetailsEmpNumberPage — 3 element(s)
- ViewEmergencyContactsEmpNumberPage — 3 element(s)
- ViewMembershipsEmpNumberPage — 3 element(s)
- ViewEmployeeTimesheetPage — 2 element(s)
- ViewAssignClaimPage — 2 element(s)
- ViewImmigrationEmpNumberPage — 3 element(s)
- ViewBuzzPage — 13 element(s)
- ViewQualificationsEmpNumberPage — 7 element(s)
- ViewEmployeeListPage — 3 element(s)
- ViewSystemUsersPage — 2 element(s)
- ViewCandidatesPage — 3 element(s)
