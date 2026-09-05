---
name: api-documentation
description: Find or derive the API surface of a local clone of the app so precondition and test-data work has real endpoints instead of guesses. Use for "what APIs does the app have", "document the API", "regenerate analysis/api-documentation.md".
allowed-tools: Bash(node:*) Bash(npm:*)
---

# API documentation

Static analysis of a **local clone** of the application under test. Output is
`analysis/api-documentation.md` plus a `.json` sidecar. This is what `test-preconditions` reads
instead of inferring an endpoint from prose.

## Run it

```bash
cd scripts/repo-analyzer && npm install     # first time only
node scripts/repo-analyzer/api-docs.mjs --app <app-path> [--cross-check <a known-good spec>]
node scripts/repo-analyzer/api-docs.mjs --app <app-path> --dry-run
```

## The three tiers, in order

- **Tier A** — a spec shipped with the app (`openapi.yaml`, `swagger.json`, …). Used verbatim; the
  scan stops there.
- **Tier B** — no spec: the backend framework's own route convention, via the backend registry.
  The header names the framework and the extraction method, which is how you judge the result.
- **Tier C** — routes that only exist once the app boots. Recorded as *requires running the app*,
  never omitted silently and never invented.

**Nothing outside those three tiers may be added.** If a test needs an endpoint that is not here,
it is absent from the analysis, not disproven — confirm it against a running instance.

## Cross-check when you can

`--cross-check <spec>` diffs the extracted path set against a known spec and puts the delta in the
report. A handful of differences is normal (param naming, plugins the spec predates); a large
unexplained gap means the extractor is wrong, and that is a bug to fix in
`scripts/repo-analyzer/registry-backend.mjs`, not to work around.

## Adding a backend framework

One entry in `registry-backend.mjs` exposing `routes(root) -> Route[]`, plus a fixture app under
`__fixtures__/` and a case in its `run.mjs`. No analyzer branches on the framework, so nothing
else changes.
