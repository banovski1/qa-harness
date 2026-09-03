---
name: frontend-components
description: List every UI component in a local clone of the app under test, parsed with its own framework's parser, plus any test-id attribute already in the markup. Use for "list the components", "analyse the app repo's frontend", "what components does the app have", "regenerate analysis/frontend-components.md".
allowed-tools: Bash(node:*) Bash(npm:*)
---

# Frontend components

Static analysis of a **local clone** of the application under test — a filesystem path the
engineer gives you (`../orangehrm`), never a GitHub URL, never cloned by this skill. No browser,
no dev server. Output is `analysis/frontend-components.md` plus a `.json` sidecar the other
analyzers read.

## Run it

```bash
cd scripts/repo-analyzer && npm install     # first time only
node scripts/repo-analyzer/components.mjs --app <app-path>            # from the repo root
node scripts/repo-analyzer/components.mjs --app <app-path> --dry-run  # print, write nothing
```

If the engineer did not name a path, ask for one. `--frontend-root <dir>` overrides detection
when a monorepo defeats it; `detect.mjs --app <app-path>` shows what was detected and why.

## Check the output before reporting it

- **Framework line** in the header — if it says `not detected`, the listing is a naive glob and
  every downstream use of it is weaker. Say so rather than presenting it as a parse.
- **Parse errors: 0** is the normal state. A non-zero count means the parser and the app's
  syntax disagree; name the count in your report.
- **Test-id convention** — the report states the attribute the app actually uses, or that it
  uses none. An app with none is a normal finding, not a failure of the scan.

## The suggested locators are candidates, not locators

Every row under *Suggested test-id locators* is marked UNVERIFIED for a reason: static source
cannot show that a value resolves to exactly one element on a rendered page, and the map's
contract is that it does. Nothing here may be written into `ui-map-results/application-map/`
until a live pass — `smart-map`, or a `playwright-codegen` recording — confirms uniqueness.
Hand them to `smart-map` as a starting ladder rung, never as a result.

## Adding a framework

One row in `scripts/repo-analyzer/registry-frontend.mjs` and, if it needs a new parser, one
function in `parsers.mjs`. Add a fixture app under `scripts/repo-analyzer/__fixtures__/` and a
case in its `run.mjs` — a parser that silently finds nothing looks exactly like an app with
nothing to find, so the fixture must assert a positive hit. Never edit an analyzer to special-case
an app.
