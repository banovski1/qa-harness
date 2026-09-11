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
