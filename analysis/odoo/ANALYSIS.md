# odoo

Generated from `analysis/odoo/app-model.json`. Nothing here is hand-written;
re-run the skills, then `compile-model.ts`, to change it.

| | |
| --- | --- |
| stack | owl / odoo (python, werkzeug routing via @http.route) |
| clone | `~/Projects/odoo` at `f8496b42a9` |
| base URL | http://localhost:8069/ |
| screens | 585 (0 crawled, 585 declared only) |
| controls | 0 named, 0 unnamed |
| components | 9 (0 shared regions) |
| proved transitions | 0 |

## Components

- No region recurs on enough screens to become a shared class.
- **RecordTable** — rows `tr.o_data_row`, addressed by key column, never by index.

## The screens carrying the most

| screen | path | controls | unnamed | actions |
| --- | --- | --- | --- | --- |
| HomePage | `/` | 0 | 0 | 0 |
| AssetlinksJsonPage | `/.well-known/assetlinks.json` | 0 | 0 | 0 |
| ChangePasswordPage | `/.well-known/change-password` | 0 | 0 | 0 |
| Home2Page | `/@/` | 0 | 0 | 0 |
| Home3Page | `/@/{path}` | 0 | 0 | 0 |
| DownloadInvoiceAttachmentsModelsPage | `/account/download_invoice_attachments/<models(` | 0 | 0 | 0 |
| DownloadInvoiceDocumentsModelsPage | `/account/download_invoice_documents/<models(` | 0 | 0 | 0 |
| DownloadMoveAttachmentsModelsPage | `/account/download_move_attachments/<models(` | 0 | 0 | 0 |
| InitTestsSharedJsPythonPage | `/account/init_tests_shared_js_python` | 0 | 0 | 0 |
| PostTestsSharedJsPythonPage | `/account/post_tests_shared_js_python` | 0 | 0 | 0 |

## Declared but never crawled

585 route(s) generate a page object with a URL and nothing else. They are real routes the app declares; the crawl did not reach them, usually because they sit behind a gate or beyond the crawl budget.

- `/` → HomePage
- `/.well-known/assetlinks.json` → AssetlinksJsonPage
- `/.well-known/change-password` → ChangePasswordPage
- `/@/` → Home2Page
- `/@/{path}` → Home3Page
- `/account/download_invoice_attachments/<models(` → DownloadInvoiceAttachmentsModelsPage
- `/account/download_invoice_documents/<models(` → DownloadInvoiceDocumentsModelsPage
- `/account/download_move_attachments/<models(` → DownloadMoveAttachmentsModelsPage
- `/account/init_tests_shared_js_python` → InitTestsSharedJsPythonPage
- `/account/post_tests_shared_js_python` → PostTestsSharedJsPythonPage
- `/allocation/refuse` → AllocationRefusePage
- `/allocation/validate` → AllocationValidatePage
- `/auth-timeout/check-identity` → AuthTimeoutCheckIdentityPage
- `/auth-timeout/send-totp-mail-code` → SendTotpMailCodePage
- `/auth-timeout/session/check-identity` → SessionCheckIdentityPage
- …and 570 more

## Authentication

session — session cookie obtained by JSON-RPC login. Credentials come from `APP_USERNAME`/`APP_PASSWORD` and never appear in the analysis.

## What the analysis could not settle

- THE IMPORTANT ONE: Odoo's back office has no per-screen URL. Everything after /odoo (or /web) is one Owl application whose screen is chosen by an *action* — a database record — and reflected in the URL fragment as an action id, not a route. So the 585 routes below are the website and portal side, plus entry points; the back office screens a QA engineer works with cannot be enumerated from source at all. Only a crawl of a running instance can list them, and this profile has no baseUrl yet.
- 638 addons each contribute controllers. The routes here are the union across all of them, which is not what any single deployment serves: an addon that is not installed serves nothing.
- A route's `auth` is recorded ('public', 'user', 'none') because it decides whether a crawl can reach it at all.

