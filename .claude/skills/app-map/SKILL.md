---
name: app-map
description: Crawl a web application with the Playwright MCP and produce two artifacts — a component inventory report with stable locators, and a per-page YAML application map. Use for "map the app", "component inventory", "application map", "regenerate ui-model".
---

# app-map

Walk a live web app with the `playwright` MCP and write **two artifacts**:
`ui-model/component-inventory.md` and `ui-model/application-map/<page-slug>.yaml` (one file per page).

## 1. Inputs

Read `src/main/resources/config.properties`: `baseUrl`, `username`, `password`, and every
`*Page=` path — those paths are the crawl seed list. Skill args override any of them
(e.g. `/app-map https://other.app user pass`). If args name an app with no config file, ask only
for the entry URL and credentials.

## 2. Crawl

Per seed path: `browser_navigate` → log in once (session persists) → `browser_snapshot`.
Then, one level deep: follow in-page nav links, and open each modal, dropdown, tab and date picker
reachable from that page, snapshotting each opened state. One page = one YAML file; opened states
go in that page's `states:` block. Record where a link leads in `navigatesTo:`.

## 3. Locator priority (closed vocabulary — first that applies wins)

1. `getByRole` (role + accessible name) 2. `getByLabel` 3. `getByPlaceholder` 4. `getByText`
5. `getByAltText` 6. `getByTitle` 7. `getByTestId` 8. CSS/XPath — last resort only, and it must
carry `unstable: true` with a reason.

Before writing any locator, confirm from the snapshot that it resolves to **exactly one** element;
if not, scope it (`within` a named group/row) rather than dropping to a lower tier.

## 4. Artifact 1 — `ui-model/component-inventory.md`

One table per component type found: button, input, long input (textarea), dropdown, searchable
dropdown, checkbox, radio group, date picker, file upload, table, tab, pagination, toast/alert,
modal, link, image.

| Component | Page | Accessible name | Locator | Tier | Notes |

Close with a **Coverage** section: which types already have a class in
`src/main/java/components/`, and which appeared in the app with no class yet.

## 5. Artifact 2 — `ui-model/application-map/<page-slug>.yaml`

```yaml
page: login
url: /web/index.php/auth/login
title: OrangeHRM
verified: 2026-08-05
elements:
  - name: usernameInput
    component: input
    locator: { strategy: getByPlaceholder, args: ["Username"] }
    comment: Username field on the login form
  - name: loginButton
    component: button
    locator: { strategy: getByRole, args: ["BUTTON"], name: "Login" }
    navigatesTo: dashboard
states:
  - name: invalidCredentials
    trigger: submit loginButton with a bad password
    elements:
      - name: invalidCredentialsAlert
        component: alert
        locator: { strategy: getByRole, args: ["ALERT"] }
```

`name` is camelCase and becomes the Java accessor; `comment` becomes its Javadoc. This schema is
what the locator classes in `src/main/java/pages/locators/` consume — keep it exact.

## Rules

- Never invent a locator you did not verify against a live snapshot.
- Re-running overwrites both artifacts idempotently — same app, same output.
- This skill writes only under `ui-model/`. Never edit `src/`.
