---
name: app-map
description: Regenerate the UI application map by running the deterministic ui-mapper-script. Use for "map the app", "component inventory", "application map", "regenerate ui-map-results".
---

This skill does not crawl anything itself. It checks the spec file, then runs the mapper script.

## 1. Check the spec

Read `scripts/ui-mapper-script/app-map-config.yaml` (or the path passed as a skill argument). These fields are required — without them the script either hard-fails or silently produces garbage:

- `baseUrl`
- `credentials.username`, `credentials.password`
- `login.loginUrl`
- `login.usernameLocator`, `login.passwordLocator`, `login.submitLocator` — each `{ strategy, args, name }`, where `strategy` is one of `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByAltText`, `getByTitle`, `getByTestId`, `css` (see `scripts/ui-mapper-script/locator-spec.mjs`)
- at least one entry under `seeds:`, or `crawl.discoverLinks: true`

Optional — never prompt for these: `app`, `login.successSignal`, `crawl.*`.

If something required is missing or empty, ask the user for it with `AskUserQuestion` (one question per missing group), write the answers into the spec file, then continue. If nothing is missing, ask nothing and go straight to step 2.

## 2. Run the mapper

From the repo root:

```
node scripts/ui-mapper-script/mapper.mjs [path/to/app-map-config.yaml]
```

If it fails with a missing-module error, run `npm install` in `scripts/ui-mapper-script/` (its `postinstall` installs Chromium) and retry once.

## 3. Report

Relay the script's summary plus how many files it wrote under `ui-map-results/application-map/`, and that `ui-map-results/component-inventory.md` was refreshed. Never hand-edit the generated artifacts.

## Rule

Never use the Playwright MCP (`mcp__playwright__*`) tools — not for crawling, not for verifying a locator, not for "just checking" the login page. `node scripts/ui-mapper-script/mapper.mjs` is the only thing allowed to drive a browser. If the script fails, fix the spec or fix the script; do not fall back to the MCP.
