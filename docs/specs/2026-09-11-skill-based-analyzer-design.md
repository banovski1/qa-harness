# Replacing the repo analyzer with skills

**Status:** in progress — sections 1 of 3 agreed, sections 2 and 3 not yet written.
**Branch:** `app-explorer`
**Date:** 2026-09-11

## The problem

Two complaints, one root cause.

1. A change to the generation pipeline is hard to test. There is one target app, so
   nothing proves the pipeline is not quietly shaped around it.
2. `scripts/repo-analyzer/` has grown into a framework-detection project of its own —
   5355 lines of TypeScript, two registries, four analyzers and three layers of tests,
   all in service of reading source code that a browser could read better.

One measurement settles the second point. On EspoCRM:

| | lines of code | what it yields |
| --- | --- | --- |
| `scripts/repo-analyzer` | 5355 TS (+169 tests) | 10 routes, **192 elements**, 1485 components with nothing attached to them |
| `.claude/skills/app-explorer` | 1391 JS | 60 screens, **3893 visible elements**, every locator proved unique against the live DOM |

The static analyzer is four times the size and produces a twentieth of the usable
output — and none of its locators can be shown to resolve to exactly one element,
which is the one property a page object actually needs.

## Scope: three sub-projects, built in this order

The request covers three independent subsystems. They are coupled in one direction
only — **C dictates the contract B must produce** — so building B first would mean
writing five skills against today's contract and then rewriting them.

- **A — Target corpus.** Three open-source apps on different stacks, each with a
  committed analysis and a committed framework.
- **C — The generator's input contract.** Pages composed of components, interactions,
  no locators in page objects. The stated end goal.
- **B — The five skills** replacing `scripts/repo-analyzer`, chained in `CLAUDE.md`.

Each gets its own spec → plan → implementation cycle. This document covers A and C.

## Decisions taken

| Question | Decision |
| --- | --- |
| Build order | A → C → B |
| Corpus | Three apps against **public demo instances**: EspoCRM (Backbone/Handlebars + PHP), OrangeHRM (Vue 3 + Symfony), RealWorld/Conduit (5-screen smoke target) |
| "No locators in pages" | A recurring region becomes its own component class owning its controls; anything not in a shared region stays on the page as a semantic field component. No CSS or locator literal in a page object either way. |
| Determinism boundary | At **committed `analysis/`**. Skill output above it is reviewed by eye; everything below it is pure code with snapshot tests. |
| Interactions | Generate only what the crawl proves. Flows the crawl cannot prove stay with `playwright-codegen` recordings. The crawl stays read-only and demo-safe. |

### Why public demos, and what it costs

Demo data drifts, resets and rate-limits, so a corpus diff could be the demo changing
rather than the code changing. The mitigation is in how the corpus is compared: the
repo-read half is fully repeatable, and the crawl half is compared on **chosen locator
per element**, not on raw JSON. That is the comparison that already showed 60 screens
out of 60 stable across two EspoCRM crawls.

---

# Section 1 — Architecture and data flow *(agreed)*

## One folder per app, and the app is named on the command line

Today an app is described in two places (`app-config.yaml` at the root,
`app-analysis/<app>/app-profile.yaml`) and its analysis lands in two folders
(`analysis/`, `app-analysis/`). With one app that is untidy; with three it is the thing
that makes testing painful, because every command reads global state saying which app is
"current".

So `app-config.yaml` is deleted, `app-analysis/` merges into `analysis/`, and every
command takes `--app <name>`.

```
analysis/<app>/
  app-profile.yaml     <- the ONLY hand-written file: repoPath, baseUrl, auth, seeds, budget
  dossier.json  .md    <- skill 1  stack, FE/BE framework, testId attribute, where the API docs are
  components.json .md  <- skill 2  component strategy: library, naming, locator conventions
  routes.json   .md    <- skill 3  every route the source declares
  api.json      .md    <- skill 4  endpoints, payloads, auth
  screens/*.json       <- skill 5  the crawl: per-screen elements, proved-unique locators
  network.json  crawl-state.json  SCREEN-INVENTORY.md  LOCATOR-STRATEGY.md
  app-model.json       <- compiled deterministically from all of the above
```

## Data flow

```
app-profile.yaml --+--> 1 stack-dossier ------> dossier.json ----+
                   +--> 2 component-strategy -> components.json  | each reads
                   +--> 3 route-map ----------> routes.json      | the dossier
                   +--> 4 api-surface --------> api.json --------+
                   +--> 5 app-explorer -------> screens/*.json
                          (primed by 1-4: seeds, testId attr, content gate, known routes)
                                    |
         compile-model.ts  <--------+   deterministic, pure, snapshot-tested
                   |
                   +--> app-model.json --> framework-generator --> generated-framework/<app>/
```

## The three joining rules

- **Elements come only from `screens/`.** Never from source. Source extraction gave 192
  unprovable elements where the crawl gave 3893 with a match count behind each. There is
  no case where source wins.
- **Routes are the union** of `routes.json` and the crawled paths, matched on path. A
  declared route the crawl never reached still becomes a page object, carrying a URL and a
  `notCrawled` flag — visible, never silently missing.
- **Components are recurrence, not declaration.** A region whose shape repeats on two or
  more screens becomes a component class. `components.json` supplies naming and
  conventions, not membership.

## Where the diff-as-test property lands

`app-model.json` is committed and is the only file the generator reads. Skill output above
it is prose-shaped and reviewed by eye, the way a pull request is. Everything from
`compile-model.ts` down is pure code with snapshot tests per corpus app.

A change to a skill that does not move `app-model.json` did not change the framework —
which is now visible in one file instead of inferred from a console summary.

## What this deletes

- `scripts/repo-analyzer/` entirely: 5355 lines, both framework registries, `__fixtures__/`,
  all three test layers.
- The four wrapper skills: `pages-and-routes`, `frontend-components`, `api-documentation`,
  `live-urls`.
- `label-dictionary.json`, `live-urls.json`, `pages-and-routes.json`,
  `frontend-components.json`.
- Both hand-declared blocks in `generator-config.yaml`: `navigation:` (the nav bar is now
  discovered as the most-recurring region) and `locatorTemplates:` (templates existed only
  because static analysis could not prove a locator; the crawl can).

---

# Section 2 — The five skills *(not yet written)*

Will cover: the responsibility and output schema of each skill, how each stays small
enough for a human to read in full, how skills 2-4 consume the dossier, how skill 5 is
primed by the first four, and the `CLAUDE.md` chaining.

# Section 3 — Generator changes and the test loop *(not yet written)*

Will cover: `compile-model.ts` and the `app-model.json` schema, how region recurrence
becomes component classes, how `fillForm`/navigation methods are derived, the replacement
for `check-analysis.ts`, and the one command that regenerates the whole corpus and shows
the diff.

---

# Section 2 — The contract, the assertions, the diagnostics *(agreed 2026-09-13)*

## Corpus (A, settled)

| App | Clone | Stack | Crawl target |
| --- | --- | --- | --- |
| EspoCRM | `~/Projects/espocrm` | Backbone/Handlebars + PHP | `demo.eu.espocrm.com` |
| OrangeHRM | `~/Projects/orangehrm` | Vue 3 + Symfony | `opensource-demo.orangehrmlive.com` |
| Cal.com | `~/Projects/cal.diy` | Next.js app-router + tRPC | `cal.com/systemly.app/demo-website` (booker only — 2 of 79 routes) |
| Conduit | `~/Projects/angular-realworld-example-app` | Angular | `demo.realworld.show` |

A fifth app, held back as the "new app, no code changes" test, is worth more than a
fifth corpus row. Which app that is has not been decided.

## `app-model.json` — the generator's only input

Four tables. **Only `components` holds locators.**

```jsonc
{
  "app": { "name", "baseUrl", "repoPath", "repoCommit", "stack", "generatedAt" },
  "components": {
    "NavigationBar": { "kind": "region", "root": {...}, "controls": {...}, "seenOn": 60 },
    "TextField":     { "kind": "field", "byLabel": true },
    "RecordTable":   { "kind": "collection", "columns": [...], "keyColumn": "Name",
                       "rowHref": "/#Contact/view/{id}", "empty": { "text": "No Data" } }
  },
  "screens": [{
    "name", "path", "url", "title", "aliases": [],
    "identity": { "urlPattern": "/#Contact", "heading": "Contacts" },
    "source":  { "component", "route" },
    "crawled": true,
    "uses": [ { "component": "Button", "as": "submitRequest", "label": "Submit Request" } ],
    "actions": [ { "name": "openCreate", "via": "nav.create", "leadsTo": "ContactCreatePage" } ],
    "unverified": 12
  }],
  "api": { "endpoints": [], "auth": { "kind", "loginEndpoint", "storageStatePath" } },
  "stats": {}
}
```

### Invariants

1. **A screen carries semantic identity, never a selector.** `label`, `heading`,
   `within` — English strings a human can fix. A screen entry containing anything
   shaped like a locator spec is a *compile error* in `compile-model.ts`, with a test.
   A region whose only handle is CSS owns that CSS privately inside its component class.
2. **Every control is reached through a component.** Unassignable elements are counted
   in `unverified` and emitted as `// UNVERIFIED` getters — visible, never dropped.
3. **Recurrence makes a component**: the same root signature on **≥2 screens** with
   **≥70% of controls matching**. Both numbers are one exported constant; the corpus
   snapshots justify any change.
4. **`kind` decides the emitted class.** `region` → control getters; `field` →
   parameterised (`new TextField(page, 'City')`), which replaces `locatorTemplates:`
   entirely; `collection` → key-addressed rows.
5. **`crawled: false` is first-class.** Declared-but-unreached routes become page
   objects with a URL and no controls (Cal.com: ~77 of 79).
6. **Actions are crawl-proven; navigation is universal.** A typed click-through method
   only where the crawl proved the transition — plus a plain URL `goto` for every route,
   so no route is unreachable and nothing is invented.

## Assertions

- Collections declare a **key column** (first column linking to a detail URL, else the
  first non-checkbox text column) and expose `row(key)`, `hasRow(key)`, `cell(col)`,
  `count()`, `isEmpty()`. **Never `nth`.**
- "Newly created" is identified by **value, not position**: `uniqueName('Contact')` →
  `Contact-k3f9a2` (prefix + per-run short id). Survives demo data, parallel workers
  and re-runs; makes leftover rows obviously test-created and cleanup addressable.
- Each screen's `identity` block (URL pattern + heading) backs the "am I on the right
  screen" assertion.
- Each `kind` has a fixed observable surface: `TextField` → `value/isVisible/isDisabled/
  errorMessage`; `Button` → `isEnabled`; `collection` → the four above; plus a `Toast`
  component when the crawl finds one.
- A collection with no discoverable key column downgrades to `count()`/`contains(text)`
  and is tallied in the report. The compiler never invents a key.

## Component diagnostics

One wrapper on `BaseComponent`; every generated component inherits it. On failure it
classifies rather than timing out blindly, and names the component + screen in
`app-model.json` that produced it, so triage can tell a bad test from a stale analysis.

| Mode | Detection | Stated next action |
| --- | --- | --- |
| `NOT_FOUND` | 0 matches, page settled | re-crawl, or wrong screen (prints actual URL/heading vs `identity`) |
| `AMBIGUOUS` | >1 match | scope it, or test data collided |
| `HIDDEN` | 1 match, not visible | a step is missing; nothing opened it |
| `DISABLED` | 1 match, disabled | precondition unmet; prints validation messages |
| `COVERED` | click intercepted | names the intercepting element |
| `DETACHED` | stale mid-action | re-render race — the real "waits" bug, named as one |
| `TIMED_OUT` | condition never met | prints what it waited for and the value instead |

Every wait is an explicit named condition, never a sleep, and is reported as such
(`waited 5041ms for RecordTable to settle — rowCount still changing: 20→40→60`), so the
common misdiagnosis that leads to a pasted `waitForTimeout` is not available.

Two channels: `test.step` for the human-readable trace, and
`test-results/diagnostics.jsonl` (`{mode, component, screen, label, matchCount, waitedMs,
waitedFor, candidates[], modelPath}`) for a future agent. Classification runs
unconditionally on failure (free) and opt-in on success via `DIAG=1`.

# Section 3 — The three skills and the test loop *(agreed 2026-09-13)*

| # | Skill | Reads | Writes |
| --- | --- | --- | --- |
| 1 | `app-dossier` | repo | `dossier.json/.md`, `routes.json/.md` |
| 2 | `app-components` | repo + dossier | `components.json/.md` |
| 3 | `app-api` | repo + dossier | `api.json/.md` |
| — | `app-explorer` (exists, re-primed) | running app | `screens/*.json`, `storageState` |
| — | `compile-model.ts` (pure code) | all of the above | `app-model.json` |

`live-urls` dies — the crawl produces URLs. Stack detection is not its own pass: the
first skill writes it down for the other two.

Each SKILL.md is a page of prose: find the router the way this stack does, here are the
idioms to grep for, write this JSON shape, say what you could not find. No registry, no
AST layer, no fixture apps — which is how 5,355 lines becomes three pages, and why an
unseen stack gets read instead of failing a `match()` predicate nobody wrote.

Honesty is enforced at the boundary: `compile-model.ts` schema-checks each skill's JSON
and fails loudly. Prose may drift; shape may not. `app-model.json` is committed per
corpus app, so a skill change that does not move it did not change the framework.

## Test loop

1. `compile-model.ts` — unit + snapshot tests per corpus app. Pure, fast.
2. Crawl stability — re-crawl EspoCRM, compare chosen-locator-per-element. 60/60 today;
   must stay so.
3. Corpus end-to-end — four apps analysed → compiled → generated → `tsc --noEmit` each.
   A generated framework that does not typecheck is a failed run.
4. Live smoke — real specs per app against the demos, including create-a-record then
   find-its-row, which only a live run proves.
5. A new app on untouched code — the retarget test.
