# calcom

Generated from `analysis/calcom/app-model.json`. Nothing here is hand-written;
re-run the skills, then `compile-model.ts`, to change it.

| | |
| --- | --- |
| stack | next.js / tRPC over Next.js route handlers |
| clone | `~/Projects/cal.diy` at `b0a34f21c9` |
| base URL | https://cal.com/ |
| screens | 78 (4 crawled, 74 declared only) |
| controls | 298 named, 60 unnamed |
| components | 9 (0 shared regions) |
| proved transitions | 0 |

## Components

- No region recurs on enough screens to become a shared class.
- **RecordTable** — rows `[role='row'], tbody tr`, addressed by key column, never by index.

## The screens carrying the most

| screen | path | controls | unnamed | actions |
| --- | --- | --- | --- | --- |
| TypePage | `/{user}/{type}` | 81 | 7 | 0 |
| UserPage | `/{user}` | 77 | 15 | 0 |
| HomePage | `/` | 72 | 18 | 0 |
| EnterprisePage | `/enterprise` | 68 | 20 | 0 |
| AppsPage | `/apps` | 0 | 0 | 0 |
| AppsCategoriesPage | `/apps/categories` | 0 | 0 | 0 |
| AppsCategories2Page | `/apps/categories/{category}` | 0 | 0 | 0 |
| InstallationPage | `/apps/installation` | 0 | 0 | 0 |
| InstalledPage | `/apps/installed/{category}` | 0 | 0 | 0 |
| Apps2Page | `/apps/{slug}` | 0 | 0 | 0 |

## Declared but never crawled

74 route(s) generate a page object with a URL and nothing else. They are real routes the app declares; the crawl did not reach them, usually because they sit behind a gate or beyond the crawl budget.

- `/apps` → AppsPage
- `/apps/categories` → AppsCategoriesPage
- `/apps/categories/{category}` → AppsCategories2Page
- `/apps/installation` → InstallationPage
- `/apps/installed/{category}` → InstalledPage
- `/apps/{slug}` → Apps2Page
- `/apps/{slug}/setup` → AppsSetupPage
- `/auth/error` → ErrorPage
- `/auth/forgot-password` → AuthForgotPasswordPage
- `/auth/forgot-password/{id}` → AuthForgotPassword2Page
- `/auth/login` → LoginPage
- `/auth/logout` → LogoutPage
- `/auth/oauth2/authorize` → AuthorizePage
- `/auth/setup` → AuthSetupPage
- `/auth/signin` → SigninPage
- …and 59 more

## Authentication

undocumented-in-spec — see api.json. Credentials come from `APP_USERNAME`/`APP_PASSWORD` and never appear in the analysis.

## What the analysis could not settle

- 78 routes are declared. Only the public booker is reachable without an account, so the crawl covers 2 of them and every other route lands in app-model.json as crawled:false. That asymmetry is why this app is in the corpus.
- Route groups in parentheses — (booking-page-wrapper), (use-page-wrapper) — organise files and do not appear in the URL.
- An optional catch-all segment ([[...step]]) resolves to the URL without it, the same rule an optional group follows in a hash router.

