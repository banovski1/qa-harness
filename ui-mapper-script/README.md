# ui-mapper-script

Deterministic replacement for the LLM-driven `app-map` skill. You give it a **login
flow as parameters** — entry URL, credentials, and the locators for the username field,
password field, and login button — and it logs in and **builds the UI map of any web app
from the accessibility (ARIA) tree**.

It emits the same two artifacts the skill produced, with the same schema, into the
sibling results folder:

- `ui-map-results/application-map/<slug>.yaml` — one file per crawled page
- `ui-map-results/component-inventory.md` — aggregated component inventory

## Why the a11y tree

Playwright's `locator.ariaSnapshot()` gives every node's **role + accessible name**. The
map's locator priority ladder (`getByRole → getByLabel → getByPlaceholder → getByText →
getByAltText → …`) is a mechanical function of that tree, and each candidate locator is
**verified to resolve to exactly one element** with `locator.count()`. No model in the loop.

## Install (one-time)

```bash
cd ui-mapper-script
npm install          # also downloads the Chromium binary (postinstall)
```

## Run

From the **repo root** (so `ui-map-results/` resolves):

```bash
node ui-mapper-script/mapper.mjs [path/to/spec.yaml]   # default: ui-mapper-script/app-map.yaml
```

A Chromium window opens, logs in, crawls the `seeds:` pages, and writes the artifacts.

## Spec file (`ui-mapper-script/app-map.yaml`)

The parameterized login flow. Point it at any app by editing this file only — no code changes:

```yaml
app: orangehrm
baseUrl: https://opensource-demo.orangehrmlive.com
credentials:
  username: Admin
  password: admin123
login:
  loginUrl: /web/index.php/auth/login
  usernameLocator: { strategy: getByRole, args: ["textbox"], name: "Username" }
  passwordLocator: { strategy: getByRole, args: ["textbox"], name: "Password" }
  submitLocator:   { strategy: getByRole, args: ["button"],  name: "Login" }
  successSignal:   { strategy: getByRole, args: ["heading"], name: "Dashboard" }  # optional
seeds:
  - /web/index.php/admin/viewSystemUsers   # optional extra starting points
crawl:
  discoverLinks: true   # BFS-follow same-origin nav links found on each mapped page (default: true)
  maxPages: 40           # safety cap on how many pages one run will map
  captureStates: false   # not yet implemented (see below)
```

The `{ strategy, args, name }` locator shape is identical to the emitted map schema.

## Crawling

`seeds:` is optional — the mapper always starts from wherever login lands, and (by default)
follows same-origin `<a href>` links discovered on each page's a11y tree in breadth-first
order until `maxPages` is reached or the queue empties. `seeds:` just adds extra starting
points (useful for pages not reachable by a link from the login landing page). Set
`discoverLinks: false` to fall back to a fixed, `seeds:`-only crawl.

## Limitations / follow-ups

- Single username/password login form only (no SSO/MFA/captcha).
- Link discovery follows `<a href>` only — client-side router links or JS-driven nav
  (`onclick` without a real href) won't be found; add them to `seeds:` explicitly.
- `captureStates` (opening modals/dropdowns/tabs one level deep) is not yet implemented.
- Only elements uniquely addressable from the a11y tree are emitted; ambiguous ones are
  skipped rather than guessed.
