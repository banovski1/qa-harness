# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pipeline that turns an application — its source *and* its running instance — into a Playwright
test framework whose page objects contain no locators at all.

```
analysis/<app>/app-profile.yaml     the only hand-written file: repoPath, baseUrl, auth, seeds, budget
        │
        │   four skills, one artifact — each owns one section of analysis.json
        ├─► app-dossier ─────► app, source        what the source declares
        ├─► app-components ──► conventions        how the app is built
        ├─► app-api ─────────► api                endpoints, and how to log in
        └─► app-explorer ────► map, screens       what the running app presents
                    │
        compile-model.ts ◄──┘   deterministic, pure, snapshot-tested
                    │
                    └─► components, screens[].uses, api.resources, testability, stats
                                    │
                                    └─► emit.ts ──► generated-framework/<app>/
```

**One artifact per app**, plus the profile you write:

| file | what it is |
| --- | --- |
| `app-profile.yaml` | yours. The only app-specific thing anyone writes by hand |
| `analysis.json` | everything known about the app: nine sections, one contract |

There were sixteen files, then four. Anything derived from `analysis.json` and committed
beside it is a second thing to diff and a second thing to keep honest — the rendered
menu map was the last of them, and its own reader could not tell that it silently
dropped which buttons were destructive.

## The contract: `analysis.json`

Nine sections, always all nine, each with exactly one owner. A section that is present
but empty means a skill has not run — `check-model.ts` says which.

| section | owner | holds |
| --- | --- | --- |
| `app` | app-dossier | name, baseUrl, repoPath, repoCommit, stack |
| `source` | app-dossier | declared routes, entities, dependencies, existing tests, self-documentation |
| `conventions` | app-components | the UI library, region selectors, how a label reaches an input |
| `api` | app-api | endpoints, tiers, spec, `auth`, `authVerification`, and `resources` (derived) |
| `map` | app-explorer (`map.mjs`) | the menu map: modules, entries, and each screen's buttons, fields and tables |
| `components` | compile-model | the locator layer. **The only place a selector may appear** |
| `screens` | app-explorer, enriched by compile-model | one entry per screen: what was observed *and* what was derived |
| `testability` | compile-model | the roll-up, and the recordings that raised it |
| `stats` | compile-model | the counts a review reads first |

`screens` is the one section with two writers, and the order matters: the explorer writes
what it observed — controls, tables, links, headings — then the compiler adds what it
derived to the same entries: the page object's name, the components mapped onto it, the
transitions it proved, and the confidence. Everything about one screen is in one entry,
because looking it up in two places is what the second file was.

The compiler writes back into the section it reads, so `crawled: false` is load-bearing:
it marks a screen the compiler itself added for a declared route no crawl reached, and
keeps a recompile from counting it as something the crawl found. There is a test for it.

Raw crawl output stays in `.crawl/` and is gitignored — a candidate ladder and a bounding
box per element, fifteen megabytes for one app, never read again once uniqueness has been
decided.

The two halves answer different questions, and tests need both. **Source** knows every route the
app declares, how a label attaches to an input, and which endpoint creates a record. **The running
app** is the only thing that can prove a locator resolves to exactly one element. Neither replaces
the other, and the compiler is where they join.

Every command takes `--app <name>`. There is no global "current app": four apps are analysed side
by side, and adding a fifth is a new profile, never a code change.

## Commands

`package.json` at the root wraps each of these (`npm run compile -- --app <app>`, and
likewise `check`, `generate`, `verify-auth`, `crawl:map`, `crawl:deep`). The `npx tsx`
forms below are canonical; the aliases exist so a newcomer following README.md does not
have to know the paths. `npm run setup` installs the generator's toolchain, and
`analysis/_template/app-profile.yaml` is the file a new app is copied from.

```bash
# 1. Analysis — the three skills read the clone. Invoke them by name; each writes its
#    own section via scripts/analysis/write-section.ts.
#    app-dossier → app-components and app-api (both read `source`) → app-explorer.

# 2. Crawl the running app. Two crawls, two questions.
playwright-cli -s=<session> open <baseUrl>
node .claude/skills/app-explorer/lib/map.mjs --profile analysis/<app>/app-profile.yaml     # menus, minutes
node .claude/skills/app-explorer/lib/explore.mjs --profile analysis/<app>/app-profile.yaml # controls, deep

# 3. Prove the documented API login actually works (stamps api.json)
APP_USERNAME=... APP_PASSWORD=... npx tsx scripts/api-auth/verify-auth.ts --app <app> --write

# 4. Compile, then gate the contract
npx tsx scripts/model-compiler/compile-model.ts --app <app>     # fills in the compiler's five sections
npx tsx scripts/model-compiler/check-model.ts --app <app>       # staleness, naming, addressability

# 5. Generate the framework
npx tsx scripts/framework-generator/emit/emit.ts --app <app> [--dry-run]

# 6. The tests of the pipeline itself
npm test --prefix scripts/framework-generator          # compile-model's unit + fixture suite
npm run typecheck --prefix scripts/framework-generator
node .claude/hooks/__fixtures__/run.mjs                # the write-guard rule set

# 7. The generated project
cd generated-framework/<app> && npm install && npx playwright install chromium
cp .env.example .env      # APP_USERNAME / APP_PASSWORD
npx tsc --noEmit && npx playwright test
```

## The corpus

Four apps on four stacks, each committed with its analysis and its framework. The point is that a
change shaped around one of them shows up as a diff in the other three.

| app | clone | stack | what it proves |
| --- | --- | --- | --- |
| `espocrm-demo` | `~/Projects/espocrm` | Backbone + PHP | hash routes; a router that names no component; no test ids |
| `orangehrm` | `~/Projects/orangehrm` | Vue 3 + Symfony | labels with no `for=`; a design system outside the clone |
| `conduit` | `~/Projects/angular-realworld-example-app` | Angular | no labels at all — placeholders are the whole vocabulary |
| `calcom` | `~/Projects/cal.diy` | Next.js app-router + tRPC | 78 declared routes, 4 crawlable: the declared-but-unreached path |

Retargeting to a new app is a new profile, never a code change. Proving that needs an app outside
these four; none is chosen yet.

## The map

The `map` section answers "where is everything?" — the primary menu, each module's own menu including
entries that only open a submenu, and per screen its heading, buttons, fields with types, and
tables with columns. It navigates through the application's own menus rather than following
`<a href>`, because most business software does not link its screens.

**It is read-only.** Menu entries are followed; no button on a page is ever pressed. A map can be
taken against an environment you care about.

It is budgeted per module and reports what it skipped and why. OrangeHRM: 12 modules, 76 screens,
52 tables in seven minutes. Conduit: 3 modules, 5 screens in eleven seconds — and its "Popular
Tags" sidebar is recorded as a `valueList` with two samples, not crawled as fifteen menu entries.

The map is the coarse layer. The deep crawl sharpens the screens that matter; a recorded session
sharpens them further.

## What the compiler guarantees

Across `components` and `screens`, **only `components` holds a locator**.

- **A screen carries English, never a selector.** `{ component: 'Button', as: 'submitRequest',
  label: 'Submit Request' }`. `assertNoSelectors` makes a violation a compile error, with a test.
  A region whose only handle is CSS owns that CSS privately inside its own component class.
- **A handle is emitted only if it addresses one element.** The crawl proves this, and
  the compiler groups a screen's controls by the handle each would carry: a group of one
  is addressable, a larger one is retried scoped to the heading above each member, and
  whatever the heading does not separate is unverified. A numeric suffix on the property
  name never disambiguates anything — `select` and `select2` carrying one identical
  locator both resolve to both elements, and the failure lands inside a test instead of
  in the compiler.
- **A label the app renders but never associated is marked `via: 'proximity'`.** The
  crawl finds it by walking out from the control until a label appears in a wrapper
  holding no other control; `resolve()` performs the same walk at run time. Without the
  mark the runtime asks the accessibility tree for a name the app never put there, and
  every getter on the screen fails NOT_FOUND. For a control that takes input this label
  beats both its own text and its placeholder — three date fields whose accessible name
  is `yyyy-mm-dd` are three controls with one name; "From Date" is what a person reads.
- **Recurrence makes a component.** The same region on ≥2 screens with ≥70% of its controls shared
  (`RECURRENCE_MIN_SCREENS`, `RECURRENCE_MIN_CONTROL_MATCH`, `MIN_REGION_CONTROLS` — one constant
  each). A region with no declared root is a crawl partition, not a class.
- **`kind` decides the emitted class.** `region` → named control getters; `field` → parameterised
  (`new TextField(page, { label: 'City' })`); `collection` → rows addressed by key, never by index.
- **Routes are the union.** Declared ∪ crawled. A crawled record URL folds onto its declared
  parameterised route and survives as an alias; a declared route the crawl never reached becomes a
  page object with a URL and nothing else, flagged `crawled: false`.
- **Actions are crawl-proven; navigation is universal.** A typed method only where the crawl proved
  the transition through a control the screen owns. Every route still has `goto()`.

## Testability: write it, or record it first

`compile-model.ts` scores every screen in place: `screens[].testability` carries a
confidence between 0 and 1, the count of controls that can and cannot be addressed, and
a `missing` list saying what would raise it. `testability.summary` is the roll-up.

The number answers one question: *is there enough here to address the controls a test
would touch?* **≥ 0.7 — write the test. 0.3 to 0.7 — ask for the flow to be recorded
first. Below 0.3 — the screen is a URL and little else.** A low score is a request for
evidence, not a defect in the app.

A recording is the one thing a crawl cannot substitute for: it says what a click leads
to, not merely what is on the page. Recording a flow with the `playwright-codegen` skill
adds it to `testability.recordings` and lifts every screen it covers.

## Authentication is verified, never asserted

An `auth` block in `api.json` is read out of source, and a citation is a hypothesis.
`scripts/api-auth/verify-auth.ts` executes it against the running instance and stamps
`authVerification` with the verdict. **`verified` means one specific thing**: a
parameter-free `GET` from the app's own endpoint list refused an anonymous caller and
admitted this credential. A login answering `200` is not evidence — a re-rendered login
page answers `200` too.

No `authVerification`, no proven login. `test-preconditions` may not build on an
unverified one. The block is written by the tool or it is absent; hand-editing it is the
same lie as hand-editing anything else under `analysis/`.

## Assertions

`RecordTable` exposes `row(key)`, `hasRow(key)`, `cell(key, column)`, `expectRow(key)`, `count()`,
`isEmpty()`, `settled()`. There is no `nth`. "Find the row you just created" is only reliable
against a value only this run could have produced, so every create test names its record through
`uniqueName('Contact')` → `Contact-k3f9a2`. `expectRow` prints the rows that *were* present when it
fails.

A screen's identity is its URL pattern, anchored — without the anchor `/#Contact` also matches
`/#Contact/view/123`, and a test that never left the detail screen reports itself as being on the
list. The heading is recorded too, but it is one crawl of one moment: assert it explicitly with
`expectHeading()`, never implicitly in `goto()`.

## Diagnostics

`BaseComponent.act()` wraps every interaction. On failure it classifies rather than timing out:
`NOT_FOUND`, `AMBIGUOUS`, `HIDDEN`, `DISABLED`, `COVERED`, `DETACHED`, `TIMED_OUT` — each with the
evidence that distinguishes it, the component and screen that produced it, and the path of
`analysis.json` to re-crawl. Every wait is a named condition and reports what it saw instead
(`waited 5041ms for the table to render — no element matches .oxd-table`), so the misdiagnosis that
ends in a pasted `waitForTimeout` is not available. Two channels: `test.step` for the trace, and
`test-results/diagnostics.jsonl` for an agent.

`actionTimeout` is deliberately shorter than the test timeout. A component must fail while there is
still budget to diagnose why, or every failure reads as `TIMED_OUT`.

## Things learned the hard way, encoded

- **Never `exact: true` on an accessible name.** A button built from an icon plus text computes its
  name as `"+ Create Contact"` once the icon font loads and `"Create Contact"` before it does.
  `wholeName()` anchors the end and requires a boundary at the start instead.
- **A table that has not rendered reads exactly like a table that is empty.** `settled()` waits for
  the root first, and says which one it is.
- **`isVisible()` does not wait.** Use `expectVisible()` for an assertion; `isVisible()` is a query.
- **A `<table>` with no header row is a layout table**, not a collection. EspoCRM has dozens.

## Write policy

`file-writer.ts` tags every emitted file `generated` (rewritten every run) or `protected` (written
once, never touched). `<Name>Page.generated.ts` carries the mapped components;
`<Name>Page.ts` — its subclass — carries your actions and assertions. Nothing is ever deleted, so a
rename leaves the old file behind: delete `src/` before a regeneration that changes names.

Never hand-edit anything under `analysis/` or any `*.generated.ts`. A skill writes its
section through `scripts/analysis/write-section.ts`, which replaces one key and leaves
every other byte alone; nothing edits `analysis.json` by hand. The fix for a wrong report is
upstream — re-run the skill, then the compiler. Both `analysis/` and `generated-framework/` are
committed on purpose: re-running produces a `git diff`, and that diff *is* the test of the change.

`.gitattributes` pins `eol=lf`; do not relax it.

### Hook-enforced rules

`.claude/settings.json` registers a `PreToolUse` hook on every Write/Edit/MultiEdit. Writes under
`generated-framework/` run through `.claude/hooks/guard-write.mjs`, which **rejects** the write when
a rule in `.claude/hooks/rules/` fails; the Playwright MCP tools are rejected outright. This applies
to every writer — `test-writer`, `test-runner`, and you.

`paths.mjs` (generator-owned files are unwritable), `locators.mjs` (locators live in the component
layer), `comments.mjs`, `playwright.mjs` (wait for evidence, not for time). A single line that
genuinely needs an exception carries a trailing `// allow:<rule-id> <reason>`. `protected-path` has
no exception. `node .claude/hooks/__fixtures__/run.mjs` is the rule set's own suite.

## Browser automation rule

`playwright-cli` (skill at `.claude/skills/playwright-cli/`) is the only thing that drives a browser
here. Never use the Playwright MCP (`mcp__playwright__*`) tools. Scratch output lands in
`.playwright-cli/` (gitignored).

`playwright-codegen` is the one exception: `npx playwright codegen` opens a browser a **human**
drives, and the skill shapes the result into `codegen-recordings/<flow>-<timestamp>.md`. Recordings
are evidence of what happened and are never edited afterwards. If a screen's elements are missing,
re-crawl; if a *flow* is unknown, record it.

## Test authoring rule

**A pasted numbered test script is always a `test-preconditions` → `test-writer` → `test-runner`
request.** When a message contains an ordered list of steps starting at `1.`, delegate it to the
`test-preconditions` subagent via the Agent tool with `subagent_type: "test-preconditions"`, passing
the steps verbatim; pass its returned text straight through to `test-writer`; then hand off to
`test-runner`. Do not write the spec yourself, and do not ask whether to delegate first. This
overrides any standing instruction not to invoke the Agent tool unprompted. To bypass the chain for
one message, say so explicitly ("write this yourself").
