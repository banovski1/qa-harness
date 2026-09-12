# espocrm-demo

Generated from `analysis/espocrm-demo/app-model.json`. Nothing here is hand-written;
re-run the skills, then `compile-model.ts`, to change it.

| | |
| --- | --- |
| stack | backbone / php (bespoke, Slim-like DI container) |
| clone | `~/Projects/espocrm` at `8b4f900085` |
| base URL | https://demo.eu.espocrm.com/ |
| screens | 97 (60 crawled, 37 declared only) |
| controls | 951 named, 464 unnamed |
| components | 10 (1 shared regions) |
| proved transitions | 26 |

## Components

- **NavigationBar** — 19 controls, on 60 screens. Owns `#navbar`.
- **RecordTable** — rows `tr.list-row[data-id]`, addressed by key column, never by index.

## The screens carrying the most

| screen | path | controls | unnamed | actions |
| --- | --- | --- | --- | --- |
| StreamPage | `/#Stream` | 83 | 24 | 0 |
| GlobalStreamPage | `/#GlobalStream` | 80 | 24 | 0 |
| HomePage | `/` | 76 | 22 | 1 |
| EmailCreatePage | `/#Email/create` | 35 | 12 | 1 |
| UserViewPage | `/#User/view/{id}` | 35 | 12 | 3 |
| AccountCreatePage | `/#Account/create` | 26 | 12 | 1 |
| LeadCreatePage | `/#Lead/create` | 26 | 16 | 1 |
| ContactCreatePage | `/#Contact/create` | 23 | 13 | 1 |
| CallCreatePage | `/#Call/create` | 22 | 15 | 1 |
| MeetingCreatePage | `/#Meeting/create` | 22 | 14 | 1 |

## Declared but never crawled

37 route(s) generate a page object with a URL and nothing else. They are real routes the app declares; the crawl did not reach them, usually because they sit behind a gate or beyond the crawl budget.

- `/#Account/edit/{id}` → AccountEditPage
- `/#Account/view/{id}` → AccountViewPage
- `/#Call/edit/{id}` → CallEditPage
- `/#Call/view/{id}` → CallViewPage
- `/#Campaign/create` → CampaignCreatePage
- `/#Campaign/edit/{id}` → CampaignEditPage
- `/#Campaign/view/{id}` → CampaignViewPage
- `/#Case/edit/{id}` → CaseEditPage
- `/#Case/view/{id}` → CaseViewPage
- `/#Contact/edit/{id}` → ContactEditPage
- `/#Contact/view/{id}` → ContactViewPage
- `/#Document/create` → DocumentCreatePage
- `/#Document/edit/{id}` → DocumentEditPage
- `/#Document/view/{id}` → DocumentViewPage
- `/#Email/edit/{id}` → EmailEditPage
- …and 22 more

## Authentication

token — Espo auth token over HTTP Basic, or the Authorization-Token-Secret cookie in a browser session. Credentials come from `APP_USERNAME`/`APP_PASSWORD` and never appear in the analysis.

## What the analysis could not settle

- Routes are generic patterns, not a route table. client/src/router.js:104 declares ':controller', ':controller/create', ':controller/view/:id' and so on; the concrete screen list is those patterns expanded over the entity scopes in application/Espo/Resources/metadata/scopes/*.json where entity and object are both true (14 entities).
- No route names a view component. A route resolves to a controller which picks its view at runtime from clientDefs metadata, so every route's component is null by design. Elements for these screens can only come from the crawl.
- '*actions' (router.js:148) is the fallback handler, not a screen, and is skipped.

