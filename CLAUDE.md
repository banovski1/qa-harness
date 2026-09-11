# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pipeline that turns a local clone of a web app into a Playwright test framework. **No browser runs
anywhere in the generation path** — the same clone always produces the same framework.

```
a local clone of the app ──► scripts/repo-analyzer ──► analysis/<app>/ ──► scripts/framework-generator ──► generated-framework/<app>/
                              (four skills, no browser)       │            (renders page objects)          (a real Playwright project)
                                                              │
                              codegen-recordings/ ────────────┴──► test-writer ──► specs
                              (a human's flow, recorded once)
```

The two inputs answer different questions, and tests need both:

- **`analysis/` — what the app has.** Every route, the component that renders it, the elements in that
  component and the label of each. Deterministic, free to re-run, cannot drift from the code.
- **`codegen-recordings/` — what the app does.** The order of steps in a real flow, what a click leads
  to, what the app accepts. Recorded once by a human through `playwright-codegen`.

They compose: a recording proves a step happens; the analysis names the control it touched, which is
how an unstable recorded locator gets repaired without opening a browser.

`app-config.yaml` is the source of truth for the app clone path, its title and the test base URL.
`scripts/` holds the analyzer and the generator; `analysis/<app>/` holds the machine-readable reports
and the api-map, in a folder named by `appName:` — so analyzing a second app adds a folder instead of
overwriting the first one's reports, and every consumer (the generator, both gates, the skills) reads
the same folder without naming the app itself. Omit `appName:` and the clone's own directory name is
the title. `generated-framework/<app>/` holds the framework generated from that analysis, in a folder
named the same way. Every path in the configs is relative to the **repo root**, so always run from
there.

**Both outputs are committed, on purpose.** They used to be gitignored and regenerated from scratch,
which made a change to the analyzer or the generator impossible to review: the only evidence was the
console summary. Now re-running either one produces a `git diff` — that diff *is* the test of the
change. Regenerate, read the diff, commit it with the code that caused it. Nothing under either folder
is hand-editable; the fix for a wrong report or a wrong page object is upstream, in the tool that wrote it.

Nothing in `scripts/` contains app-specific code, so retargeting is a config edit and a re-run: point
root `app-config.yaml` at another clone, give it an `appName:`, and both folders appear beside the
existing ones instead of replacing them.

## Commands

```bash
# Stage 0 — static analysis of a local clone of the app under test. This is the spine, not an extra:
#           routes.ts first (components.ts joins onto its output to build the label dictionary).
npm ci --prefix scripts/repo-analyzer
npm run analyze                              # detect, routes, components, api-docs, live-urls
npm run analyze -- --path-prefix <mount-prefix>   # if the app is not served at /
npm run fixtures --prefix scripts/repo-analyzer                 # the analyzer's test suite
npm test --prefix scripts/repo-analyzer                         # the same suite, with test names
npm run typecheck --prefix scripts/repo-analyzer

# Stage 1 — gate the analysis before generating from it
npm ci --prefix scripts/framework-generator
npm run check-analysis --prefix scripts/framework-generator             # freshness + schema + model builds
npm run check-analysis --prefix scripts/framework-generator -- --strict /pim/addEmployee

# Stage 2 — regenerate the framework from the analysis (no network access)
npm run generate --prefix scripts/framework-generator              # from repo root
npm run generate:dry --prefix scripts/framework-generator    # print the file plan, write nothing

# Stage 3 — the generated project (<app> is appName: from app-config.yaml)
cd generated-framework/<app>
npm install && npx playwright install chromium
cp .env.example .env          # fill in APP_USERNAME / APP_PASSWORD
npm run typecheck             # tsc --noEmit
npm test                      # playwright test
npm run test:headed / test:ui / report
npx playwright test tests/e2e/pim/pim-page.spec.ts        # a single spec file
npx playwright test -g "some test title"                   # a single test
```

Prefer `--dry-run` when changing the generator: it exercises the whole pipeline and reports create/overwrite/preserve/unchanged per file without touching disk.

Run `npm test --prefix scripts/framework-generator` for generator contract tests and
`npm run typecheck --prefix scripts/framework-generator` for static checks. Follow these with
the analysis gate, a dry run, and a `git diff` of `generated-framework/<app>/` — that diff is how an
output change is reviewed, so regenerate before committing rather than after.

## Architecture notes that span files

**Never hand-edit `generated-framework/**/*.generated.ts`** — the generator overwrites it on the next run. Nothing under `analysis/` is hand-editable either: it is a report, and the fix for a wrong one is to re-run the analyzer that wrote it, then `check-analysis.ts`.

**The generated/protected write policy** (`framework-generator/file-writer.ts`) is the core contract. Every emitted file is tagged `generated` (overwritten every run) or `protected` (written once, then never touched). So `<Name>Page.generated.ts` carries the mapped locators and `<Name>Page.ts` — its subclass — carries your actions and assertions. Nothing is ever deleted. Put real test logic only in protected files.

**The locator vocabulary is closed and shared.** `framework-generator/locator-spec.ts` defines the `{ strategy, args, name, within, nth }` shape used by the login config (input), the analyzer (producer) and the generator (consumer). Adding a strategy means touching that one module.

**`locator-ladder.ts` ranks that vocabulary, and four things share the ranking.** Rungs, best to
worst: `getByTestId`, named `getByRole`, `getByLabel`, a label `template`, `getByPlaceholder`, an
`id`/`name` attribute selector, `getByText`, a raw CSS path. `bestLocatorFor(signals)` is how the
extractor chooses — it gathers signals and lets the ladder pick, so no call site quietly prefers CSS
over a role. `classify(expression)` judges a locator recorded by codegen, and `rankOf(spec)` one that
already exists. The analyzer, the `playwright-codegen` shaping step, `test-writer` and
`.claude/hooks/rules/locators.mjs` all import it, so a change to the ranking reaches all four at once.

Rung 4 is the one that needs explaining: a `template` expands to CSS, but it is *anchored to a label*
(`.oxd-input-group:has(label:text-is("{label}")) input`), so it breaks only when the label does. It is
the fallback for an app whose labels carry no `for` association, and it is never tagged unstable.

**Uniqueness is no longer proved, and that is the deliberate trade.** Static analysis cannot show that
a locator resolves to exactly one element on a rendered page. Where two controls on a page share a
label, the extractor emits both and marks them `unstable` with the reason, rather than picking one —
they surface as `// UNSTABLE` getters and a tally in `GENERATION-REPORT.md`. Pinning one down means
recording the flow and adding a scoped accessor in the protected page object.

**`locatorTemplates:` keeps app selectors out of both the page objects and the map.** The block in
`generator-config.yaml` maps a label to a selector (`{label}` is the placeholder), and the generator
emits it into `src/components/locator-templates.generated.ts` — the only file in the output naming an
app-specific selector. An element names the template rather than repeating it —
`{ strategy: template, args: ["labelledInput"], name: "City" }` — and `fromMap` expands it into a plain
`css` spec at read time, which is what keeps `resolve()` and the other language adapters ignorant of
templates. `renderTemplate` in `locator-spec.ts` is the single substitution rule, shared by that
expansion and the emitter's equivalence check so the two cannot disagree.

**The block is empty on this branch, and that is a supported state.** `templatesFrom` in
`repo-analyzer/elements-vue.ts` narrows the kind→template table to the ids the config actually
defines, so the extractor never proposes a template the generator cannot expand. An element that
would have reached rung 4 falls to a weaker signal or is counted in `skipped`, instead of making
`fromMap` throw on the first unassociated label — which, on a typical app, is over half of them.
Filling the block in is an improvement, never a precondition.

The analyzer emits templates directly, so nothing has to convert them after the fact. Where a template reproduces an element's locator *exactly*, `factoryFor` in
`languages/typescript.ts` emits `InputComponent.byLabel(this.page, 'City')` instead of the selector;
anything else keeps the locator the extractor built. Equivalence is proved per element, never assumed,
so editing the block cannot silently re-point an accessor — it can only fall back. The
`GENERATION-REPORT.md` factory tally is how you see that happen. Component *instance* constructors stay
`(locator, description)`: the factories are statics taking a root, which is what keeps `BaseComponent.nth()`
and `within:` scoping working.

**`analysis-reader.ts` joins the reports into the model, and `page-model.ts` holds the rules that
outlived the map.** The reader joins `pages-and-routes.json` (the page list) with
`frontend-components.json` (elements, matched on `route.component === component.file`) and takes the
mount prefix from `live-urls.json` — an app mounted under a prefix (`/web/index.php`, say) serves
every route beneath it, which the framework's own route table does not record. It drops API-prefixed routes, roots a path that lost its
leading slash, and expands `template` locators through `fromMap` so no adapter ever sees one. A route
with no component still becomes a page object, carrying a URL and nothing else.

`page-model.ts` holds the URL-to-page rules, and a page's identity is its **full parameterless
path**, never a truncation of it. Folders still come from the module segment (taken as the one
straight after the mount prefix when that is known, inferred otherwise — a single short route would
drag the detected segment onto the prefix). Three rules do the rest. *Merging*: routes that render
the same component are one screen wherever the router mounts them — the shortest URL is the page,
every other mount an alias, so `/my/authorizations/individual-arls` and its seven deeper mounts are
one class, not eight. *Naming* (`assignPageNames`): a class is named from its path's trailing
segments, extended toward the root only while two pages collide — `/kye/assignments` and
`/kytp/assignments` both extend to `KyeAssignmentsPage` / `KytpAssignmentsPage`, so a name never
depends on read order. *Params*: any `{param}` or `:param` segment is a record slot, not identity,
and is dropped before either rule runs. A numeric suffix survives only when two different components
sit on identical parameterless paths (`/requests/add` beside `/requests/add/{id}`) — on the current
app that is 4 classes out of 589, and each one is a real ambiguity, not a naming failure.

The contract it returns — `{ pages, sharedChrome, sharedStates, stats }` — is the same one the map
reader returned, which is what let `languages/typescript.ts` stay untouched through the switch.
`sharedStates` is always empty now: states were a live-walk product, since a menu had to be opened
before its options existed.

**`check-analysis.ts` guards the failures that are silent.** A stale analysis still parses and still generates a framework — one that describes an app which has moved on — so the gate compares the commit in each report's provenance header against the clone's current `HEAD` and fails on a mismatch. It also catches a route path that lost its leading slash, a duplicate element name, a locator no template can expand, and a `navigation:` entry that does not resolve. Run it after re-running the analyzer, with `--strict <route>` for the routes you care about.

**`generate.ts` never branches on language.** Languages are adapters in `languages/`, registered in `languages/index.ts`, satisfying `{ id, extension, emptyDirs, staticFiles, renderPage, renderTest }`; `renderPage` returning `null` means "scaffold only". Only TypeScript renders page objects today — adding another language means implementing `renderPage` in its adapter and nothing else.

**The navigation bar is declared, not derived.** It is the one part of a rendered page static analysis may not reach: an app whose sidebar is rendered by an external design-system package and filled from a server menu payload has navigation that appears in no template in its own source. `navigation:` in `generator-config.yaml` lists those elements by hand, and they become the single `NavigationBar` component instead of repeating on every page object. With `locatorTemplates:` it is one of exactly two places an app-specific selector appears. Leave it empty for an app whose navigation is in its own markup — the extractor will find it.

**The login flow is not in the analysis** — static analysis describes screens, never flows. The generator can read login locators from a configured `loginConfig:` file to emit a working login helper. Credentials never flow through: they come from `APP_USERNAME`/`APP_PASSWORD` in the generated project's `.env`.

**`.gitattributes` pins `eol=lf`** because the generator writes LF, and every generated file is now committed — the analysis, the framework, the analyzer snapshots and the fixtures. Do not relax the pin: under Windows `core.autocrlf` each of them would show as modified with no content change, which is exactly the noise that makes a real diff unreadable.

**The repo analyzer never branches on the app.** `scripts/repo-analyzer/` reads a local clone of the
application under test and writes the four files in `analysis/`. Framework support lives entirely in
`registry-frontend.ts` and `registry-backend.ts` — `{ id, match, parse, routes }` rows — and
`detect.ts` picks the frontend and backend roots by scoring candidate manifests, so a monorepo with an
installer bundled beside the product resolves to the product. Adding a framework is one registry row
plus a fixture app under `__fixtures__/`; the four analyzers are framework-blind and must stay that way.
A parser that silently finds nothing is indistinguishable from an app with nothing to find, which is why
every fixture row asserts a *positive* hit — a route, a component, a test-id, an endpoint — and never
just an absence.

**The analyzer's tests are three layers, and the third is the point.** `__tests__/unit.test.ts` covers
the pure functions each report is built from; `__tests__/analyzers.test.ts` runs `detect`,
`collectRoutes`, `collectComponents` and the api-docs tier ladder against every app in `__fixtures__/`,
with the expectations in `__fixtures__/cases.ts` (one row per registry row it pins); and
`__tests__/reports.test.ts` compares the **rendered markdown** against committed snapshots, because a
refactor can preserve every return value while quietly changing what lands in `analysis/`. Only the
timestamp and commit lines are scrubbed before comparing. Accept an intentional format change with
`UPDATE_SNAPSHOTS=1 npm test` so it arrives as a reviewable diff of `__tests__/snapshots/*.md` rather
than a hand edit. Rails and Spring have no fixture app: their extractors are a known gap, stated in
`cases.ts` rather than papered over.

**`analysis/` is the generator's input, and everything in it is a candidate.** A label or a
`data-testid` found in source cannot be shown to resolve to exactly one element on a rendered page, so
a spec built from one carries `// UNVERIFIED` until a recording exercises it. That is the cost of
removing the browser, and it is paid openly: ambiguous elements are marked rather than dropped or
guessed at. `api-documentation.md` is a
precondition reference for `test-preconditions`, not a promise that an endpoint exists — Tier C records
what static analysis cannot reach rather than omitting it. Every analysis file carries a provenance
header (app path, commit, framework, timestamp) so a stale one is visible; re-run the analyzer rather
than hand-editing.

## The second analyzer: app-explorer

`.claude/skills/app-explorer/` documents a **running** app from its base URL alone — no clone, no
framework detection. It is the counterpart to `scripts/repo-analyzer`, not a replacement: the repo
analyzer answers *what the source defines*, app-explorer answers *what the running app presents*, and
only the second one can prove a locator resolves to exactly one element.

```bash
playwright-cli -s=<session> open <baseUrl>
node .claude/skills/app-explorer/lib/explore.mjs --profile app-analysis/<app>/app-profile.yaml
node .claude/skills/app-explorer/lib/probe-openapi.mjs --profile app-analysis/<app>/app-profile.yaml
node .claude/skills/app-explorer/lib/explore.mjs --profile app-analysis/<app>/app-profile.yaml --reports-only
```

`app-analysis/<app>/app-profile.yaml` is the only app-specific file — retargeting is a new profile,
never a code edit. Everything else under `app-analysis/` is generated and must not be hand-edited:
`screens/*.json` is the machine contract, the four markdown reports are its summary. The agent
orchestrates; a deterministic in-page extractor does all the reading, which is what keeps the
inventory independent of how much of a snapshot fits in context. `lib/rank-locators.js` holds the
ladder, and `render-reports.mjs` reads it back from that file rather than keeping a copy.

The crawl is read-only and its stability is a measured claim: on the EspoCRM demo, two full crawls
produce identical locators for all 60 screens. Re-check it after changing anything in `lib/` — the
recipe is at the end of the skill.

## Browser automation rule

`playwright-cli` (the Playwright Agent CLI, installed globally; skill at `.claude/skills/playwright-cli/`) is the only thing that drives a browser here. Never use the Playwright MCP (`mcp__playwright__*`) tools — `playwright-cli` replaces them and is far more token-efficient. Its scratch output lands in `.playwright-cli/` (gitignored).

The `playwright-codegen` skill (`.claude/skills/playwright-codegen/SKILL.md`) is the entry point for every "record a flow" / "capture a codegen session" request. It is the one deliberate exception to the rule above: `npx playwright codegen` opens a browser a **human** drives, and the skill shapes the result into `codegen-recordings/<flow>-<timestamp>.md` — the numbered steps, each ranked on the locator ladder, with every unstable step repaired against `analysis/<app>/label-dictionary.json` and credentials redacted. Recordings accumulate as a library; they are never edited afterwards, because a recording is evidence of what happened.

Nothing walks the app to build an inventory any more. If a screen's elements are missing, the answer is to re-run the analyzer; if a *flow* is unknown, the answer is to record it.

## Test authoring rule

**A pasted numbered test script is always a `test-preconditions` → `test-writer` → `test-runner` request.** When a message contains an ordered list of steps starting at `1.` — a QA script in plain English — first delegate it to the `test-preconditions` subagent (`.claude/agents/test-preconditions.md`) via the Agent tool with `subagent_type: "test-preconditions"`, passing the steps through verbatim. It returns a short precondition/data-prep analysis followed by the original steps; pass that returned text straight through as the prompt to the `test-writer` subagent (`.claude/agents/test-writer.md`) via `subagent_type: "test-writer"`. Do not write the spec yourself, and do not ask whether to delegate first.

Once `test-writer` reports its files, hand off to the `test-runner` subagent (`.claude/agents/test-runner.md`) to execute the new spec and resolve it against `.claude/agents/test-runner-known-issues.md`. This is automatic — pasting a numbered script triggers all three agents in sequence, no separate request needed. Relay `test-runner`'s final report in whichever of its three shapes it comes back: passed, fixed-and-passed (citing the known-issues row), or handed back to a human with evidence.

This overrides any standing instruction not to invoke the Agent tool unprompted: in this repo, pasting test steps *is* the request to run `test-preconditions` and `test-writer`. Relay `test-writer`'s report — files created and modified, `// UNVERIFIED` locators, new `.env` variables, and the command to run the spec. To bypass the whole chain for one message, say so explicitly ("write this yourself").

### Hook-enforced rules

`.claude/settings.json` registers a `PreToolUse` hook on every Write/Edit/MultiEdit. Writes under
`generated-framework/` run through `.claude/hooks/guard-write.mjs`, which **rejects** the write when
a rule in `.claude/hooks/rules/` fails; the Playwright MCP tools are rejected outright. This applies
to every writer — `test-writer`, `test-runner`, and you — so a rule cannot be dodged by writing the
file yourself.

`.claude/hooks/rules/` is the single source of truth: `paths.mjs` (generator-owned files are
unwritable), `locators.mjs` (locators live in the component/page-object layer and stay semantic),
`comments.mjs` (one comment line per thirty code lines, no narration), `playwright.mjs` (wait for
evidence, not for time, decoration, or a retry). The table in `.claude/agents/test-writer.md`
summarises them for the agents. `node .claude/hooks/__fixtures__/run.mjs` is the rule set's test
suite — run it after changing a rule.

A single line that genuinely needs an exception carries a trailing `// allow:<rule-id> <reason>`,
which stays visible in review. `protected-path` has no exception.
