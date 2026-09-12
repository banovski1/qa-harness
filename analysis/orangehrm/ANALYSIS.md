# orangehrm

Generated from `analysis/orangehrm/app-model.json`. Nothing here is hand-written;
re-run the skills, then `compile-model.ts`, to change it.

| | |
| --- | --- |
| stack | vue / symfony |
| clone | `~/Projects/orangehrm` at `56e23b3b09` |
| base URL | https://opensource-demo.orangehrmlive.com/ |
| screens | 216 (22 crawled, 194 declared only) |
| controls | 396 named, 84 unnamed |
| components | 10 (1 shared regions) |
| proved transitions | 0 |

## Components

- **NavigationBar** — 15 controls, on 30 screens. Owns `.oxd-sidepanel`.
- **RecordTable** — rows `.oxd-table-card`, addressed by key column, never by index.

## The screens carrying the most

| screen | path | controls | unnamed | actions |
| --- | --- | --- | --- | --- |
| ViewPersonalDetailsEmpNumberPage | `/web/index.php/pim/viewPersonalDetails/empNumber/{empNumber}` | 32 | 8 | 0 |
| ViewQualificationsEmpNumberPage | `/web/index.php/pim/viewQualifications/empNumber/{empNumber}` | 30 | 1 | 0 |
| ContactDetailsEmpNumberPage | `/web/index.php/pim/contactDetails/empNumber/{empNumber}` | 26 | 12 | 0 |
| ViewDependentsEmpNumberPage | `/web/index.php/pim/viewDependents/empNumber/{empNumber}` | 26 | 1 | 0 |
| ViewEmergencyContactsEmpNumberPage | `/web/index.php/pim/viewEmergencyContacts/empNumber/{empNumber}` | 26 | 1 | 0 |
| ViewImmigrationEmpNumberPage | `/web/index.php/pim/viewImmigration/empNumber/{empNumber}` | 26 | 1 | 0 |
| ViewMembershipsEmpNumberPage | `/web/index.php/pim/viewMemberships/empNumber/{empNumber}` | 26 | 1 | 0 |
| ViewJobDetailsEmpNumberPage | `/web/index.php/pim/viewJobDetails/empNumber/{empNumber}` | 25 | 1 | 0 |
| ViewReportToDetailsEmpNumberPage | `/web/index.php/pim/viewReportToDetails/empNumber/{empNumber}` | 24 | 1 | 0 |
| ViewSalaryListEmpNumberPage | `/web/index.php/pim/viewSalaryList/empNumber/{empNumber}` | 24 | 1 | 0 |

## Declared but never crawled

194 route(s) generate a page object with a URL and nothing else. They are real routes the app declares; the crawl did not reach them, usually because they sit behind a gate or beyond the crawl budget.

- `/web/index.php/` → IndexPhpPage
- `/web/index.php/admin/addTheme` → AddThemePage
- `/web/index.php/admin/editOAuthClient` → EditOAuthClientPage
- `/web/index.php/admin/employmentStatus` → EmploymentStatusPage
- `/web/index.php/admin/fixLanguageStringErrors/{languageId}` → FixLanguageStringErrorsPage
- `/web/index.php/admin/jobCategory` → JobCategoryPage
- `/web/index.php/admin/languageCustomization/{languageId}` → LanguageCustomizationPage
- `/web/index.php/admin/languageImport/{languageId}` → LanguageImportPage
- `/web/index.php/admin/languagePackage` → LanguagePackagePage
- `/web/index.php/admin/ldapConfiguration` → LdapConfigurationPage
- `/web/index.php/admin/listMailConfiguration` → ListMailConfigurationPage
- `/web/index.php/admin/localization` → LocalizationPage
- `/web/index.php/admin/membership` → MembershipPage
- `/web/index.php/admin/nationality` → NationalityPage
- `/web/index.php/admin/openIdProvider` → OpenIdProviderPage
- …and 179 more

## Authentication

session — PHP session cookie set by a form login. Credentials come from `APP_USERNAME`/`APP_PASSWORD` and never appear in the analysis.

## What the analysis could not settle

- There is no client-side router. Symfony serves a page per URL and each page mounts a Vue app, so the route list is the backend's — 224 GET routes across 20 plugin route files.
- A route names a PHP controller, never a Vue component, so no route can be joined to a component file. The elements on a screen come from the crawl.
- The UI is built on @ohrm/oxd, an external design-system package. Its markup is not in this clone (node_modules is not installed), so how a label attaches to an input cannot be read from source here — the crawl settles it.

