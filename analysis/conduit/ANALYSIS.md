# conduit

Generated from `analysis/conduit/app-model.json`. Nothing here is hand-written;
re-run the skills, then `compile-model.ts`, to change it.

| | |
| --- | --- |
| stack | angular / none in this repo |
| clone | `~/Projects/angular-realworld-example-app` at `dd99ed2cf3` |
| base URL | https://demo.realworld.show/ |
| screens | 10 (6 crawled, 4 declared only) |
| controls | 86 named, 21 unnamed |
| components | 10 (1 shared regions) |
| proved transitions | 3 |

## Components

- **NavigationBar** — 4 controls, on 15 screens. Owns `nav.navbar`.
- **RecordTable** — rows `app-article-preview`, addressed by key column, never by index.

## The screens carrying the most

| screen | path | controls | unnamed | actions |
| --- | --- | --- | --- | --- |
| HomePage | `/` | 31 | 7 | 0 |
| TagPage | `/tag/{tag}` | 22 | 4 | 0 |
| ArticlePage | `/article/{slug}` | 11 | 6 | 1 |
| ProfilePage | `/profile/{username}` | 9 | 2 | 0 |
| RegisterPage | `/register` | 7 | 1 | 1 |
| LoginPage | `/login` | 6 | 1 | 1 |
| EditorPage | `/editor` | 0 | 0 | 0 |
| Editor2Page | `/editor/{slug}` | 0 | 0 | 0 |
| FavoritesPage | `/profile/{username}/favorites` | 0 | 0 | 0 |
| SettingsPage | `/settings` | 0 | 0 | 0 |

## Declared but never crawled

4 route(s) generate a page object with a URL and nothing else. They are real routes the app declares; the crawl did not reach them, usually because they sit behind a gate or beyond the crawl budget.

- `/editor` → EditorPage
- `/editor/{slug}` → Editor2Page
- `/profile/{username}/favorites` → FavoritesPage
- `/settings` → SettingsPage

## Authentication

token — JWT in an Authorization: Token <jwt> header. Credentials come from `APP_USERNAME`/`APP_PASSWORD` and never appear in the analysis.

## What the analysis could not settle

- The demo host serves plain path routes (/login), matching the route table. An earlier reading assumed a hash fragment; the crawl's own URLs settled it.
- Routes are lazy (loadComponent/loadChildren), so the component of a route is an import path rather than a class reference — recorded as the module path.

