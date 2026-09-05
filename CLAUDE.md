# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pipeline that turns a local clone of a web app into a Playwright test framework. **No browser runs
anywhere in the generation path** — the same clone always produces the same framework.

```
a local clone of the app ──► scripts/repo-analyzer ──► analysis/ ──► scripts/framework-generator ──► generated-framework/
                              (four skills, no browser)     │          (renders page objects)        (a real Playwright project)
                                                            │
                              codegen-recordings/ ──────────┴──► test-writer ──► specs
                              (a human's flow, recorded once)
```

The two inputs answer different questions, and tests need both:

- **`analysis/` — what the app has.** Every route, the component that renders it, the elements in that
  component and the label of each. Deterministic, free to re-run, cannot drift from the code.
- **`codegen-recordings/` — what the app does.** The order of steps in a real flow, what a click leads
  to, what the app accepts. Recorded once by a human through `playwright-codegen`.

They compose: a recording proves a step happens; the analysis names the control it touched, which is
how an unstable recorded locator gets repaired without opening a browser.

`scripts/` holds the config, the analyzer and the generator; `analysis/` holds the machine-readable
reports and the api-map; `generated-framework/` holds the committed output. Every path in the configs
is relative to the **repo root**, so always run from there.

The demo target is OrangeHRM's public demo, but nothing here contains app-specific code — retargeting
is a config edit plus a re-run.

## Commands

```bash
# Stage 0 — static analysis of a local clone of the app under test. This is the spine, not an extra:
#           routes.mjs first (components.mjs joins onto its output to build the label dictionary).
cd scripts/repo-analyzer && npm install
node scripts/repo-analyzer/detect.mjs     --app ../orangehrm   # what framework, and why
node scripts/repo-analyzer/components.mjs --app ../orangehrm   # analysis/frontend-components.md
node scripts/repo-analyzer/routes.mjs     --app ../orangehrm   # analysis/pages-and-routes.md
node scripts/repo-analyzer/api-docs.mjs   --app ../orangehrm   # add --cross-check <spec> if the app ships one
node scripts/repo-analyzer/live-urls.mjs  --path-prefix /web/index.php   # needs routes.mjs first
node scripts/repo-analyzer/__fixtures__/run.mjs                 # the analyzer's test suite
cd scripts/repo-analyzer && npm test                            # the same suite, with test names

# Stage 1 — gate the analysis before generating from it
node scripts/framework-generator/check-analysis.mjs             # freshness + schema + model builds
node scripts/framework-generator/check-analysis.mjs --strict /pim/addEmployee

# Stage 2 — regenerate the framework from the analysis (no network access)
cd scripts/framework-generator && npm install
node scripts/framework-generator/generate.mjs              # from repo root
node scripts/framework-generator/generate.mjs --dry-run    # print the file plan, write nothing

# Stage 3 — the generated project
cd generated-framework
npm install && npx playwright install chromium
cp .env.example .env          # fill in APP_USERNAME / APP_PASSWORD
npm run typecheck             # tsc --noEmit
npm test                      # playwright test
npm run test:headed / test:ui / report
npx playwright test tests/e2e/pim/pim-page.spec.ts        # a single spec file
npx playwright test -g "some test title"                   # a single test
```

Prefer `--dry-run` when changing the generator: it exercises the whole pipeline and reports create/overwrite/preserve/unchanged per file without touching disk.

There is no test suite for the generator itself; `check-analysis.mjs`, `--dry-run` and a `git diff` of `generated-framework/` are the verification loop.

## Architecture notes that span files

**Never hand-edit `generated-framework/**/*.generated.ts`** — the generator overwrites it on the next run. Nothing under `analysis/` is hand-editable either: it is a report, and the fix for a wrong one is to re-run the analyzer that wrote it, then `check-analysis.mjs`.

**The generated/protected write policy** (`framework-generator/file-writer.mjs`) is the core contract. Every emitted file is tagged `generated` (overwritten every run) or `protected` (written once, then never touched). So `<Name>Page.generated.ts` carries the mapped locators and `<Name>Page.ts` — its subclass — carries your actions and assertions. Nothing is ever deleted. Put real test logic only in protected files.

**The locator vocabulary is closed and shared.** `framework-generator/locator-spec.mjs` defines the `{ strategy, args, name, within, nth }` shape used by the login config (input), the analyzer (producer) and the generator (consumer). Adding a strategy means touching that one module.

**`locator-ladder.mjs` ranks that vocabulary, and four things share the ranking.** Rungs, best to
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
app-specific selector. A map file names the template rather than repeating it —
`{ strategy: template, args: ["labelledInput"], name: "City" }` — and `fromMap` expands it into a plain
`css` spec at read time, which is what keeps `resolve()` and the other language adapters ignorant of
templates. `renderTemplate` in `locator-spec.mjs` is the single substitution rule, shared by that
expansion and the emitter's equivalence check so the two cannot disagree.
The analyzer emits these directly, so nothing has to convert them after the fact. Where a template reproduces an element's locator *exactly*, `factoryFor` in
`languages/typescript.mjs` emits `InputComponent.byLabel(this.page, 'City')` instead of the selector;
anything else keeps the locator the mapper verified. Equivalence is proved per element, never assumed,
so editing the block cannot silently re-point an accessor — it can only fall back. The
`GENERATION-REPORT.md` factory tally is how you see that happen. Component *instance* constructors stay
`(locator, description)`: the factories are statics taking a root, which is what keeps `BaseComponent.nth()`
and `within:` scoping working.

**`analysis-reader.mjs` joins the reports into the model, and `page-model.mjs` holds the rules that
outlived the map.** The reader joins `pages-and-routes.json` (the page list) with
`frontend-components.json` (elements, matched on `route.component === component.file`) and takes the
mount prefix from `live-urls.json` — OrangeHRM serves every route under `/web/index.php`, which the
framework's own route table does not record. It drops API-prefixed routes, roots a path that lost its
leading slash, and expands `template` locators through `fromMap` so no adapter ever sees one. A route
with no component still becomes a page object, carrying a URL and nothing else.

`page-model.mjs` carries the URL-to-page rules unchanged from the map era — folder grouping, unique
class names, merging duplicate pages onto one class with `aliases`. They are about how URLs become
page objects, not about where elements came from, which is why the folder layout and class names did
not shift when the input format did. The one rule that *did* change: when the mount prefix is known,
the module segment is taken as the one straight after it rather than inferred, because a single short
route (`/` reduces to just the prefix) would otherwise drag the detected segment onto the prefix.

The contract it returns — `{ pages, sharedChrome, sharedStates, stats }` — is the same one the map
reader returned, which is what let `languages/typescript.mjs` stay untouched through the switch.
`sharedStates` is always empty now: states were a live-walk product, since a menu had to be opened
before its options existed.

**`check-analysis.mjs` guards the failures that are silent.** A stale analysis still parses and still generates a framework — one that describes an app which has moved on — so the gate compares the commit in each report's provenance header against the clone's current `HEAD` and fails on a mismatch. It also catches a route path that lost its leading slash, a duplicate element name, a locator no template can expand, and a `navigation:` entry that does not resolve. Run it after re-running the analyzer, with `--strict <route>` for the routes you care about.

**`generate.mjs` never branches on language.** Languages are adapters in `languages/`, registered in `languages/index.mjs`, satisfying `{ id, extension, emptyDirs, staticFiles, renderPage, renderTest }`; `renderPage` returning `null` means "scaffold only". Only TypeScript renders page objects today — adding another language means implementing `renderPage` in its adapter and nothing else.

**The navigation bar is declared, not derived.** It is the one part of a rendered page static analysis cannot reach: OrangeHRM's sidebar is rendered by the external `@ohrm/oxd` package and filled from a server menu payload, so it appears in no template in the app's own source. `navigation:` in `generator-config.yaml` lists those elements by hand, and they become the single `NavigationBar` component instead of repeating on every page object. With `locatorTemplates:` it is one of exactly two places an app-specific selector appears. Leave it empty for an app whose navigation is in its own markup — the extractor will find it.

**The login flow is not in the analysis** — static analysis describes screens, never flows. The generator reads the login locators from `scripts/app-config.yaml` (`loginConfig:` in `generator-config.yaml`) to emit a working login helper. Credentials never flow through: they come from `APP_USERNAME`/`APP_PASSWORD` in the generated project's `.env`.

**`.gitattributes` pins `eol=lf`** because the generator writes LF and `generated-framework/` is committed. Do not relax it — under Windows `core.autocrlf` every generated file would show as modified with no content change.

**The repo analyzer never branches on the app.** `scripts/repo-analyzer/` reads a local clone of the
application under test and writes the four files in `analysis/`. Framework support lives entirely in
`registry-frontend.mjs` and `registry-backend.mjs` — `{ id, match, parse, routes }` rows — and
`detect.mjs` picks the frontend and backend roots by scoring candidate manifests, so a monorepo with an
installer bundled beside the product resolves to the product. Adding a framework is one registry row
plus a fixture app under `__fixtures__/`; the four analyzers are framework-blind and must stay that way.
A parser that silently finds nothing is indistinguishable from an app with nothing to find, which is why
every fixture row asserts a *positive* hit — a route, a component, a test-id, an endpoint — and never
just an absence.

**The analyzer's tests are three layers, and the third is the point.** `__tests__/unit.test.mjs` covers
the pure functions each report is built from; `__tests__/analyzers.test.mjs` runs `detect`,
`collectRoutes`, `collectComponents` and the api-docs tier ladder against every app in `__fixtures__/`,
with the expectations in `__fixtures__/cases.mjs` (one row per registry row it pins); and
`__tests__/reports.test.mjs` compares the **rendered markdown** against committed snapshots, because a
refactor can preserve every return value while quietly changing what lands in `analysis/`. Only the
timestamp and commit lines are scrubbed before comparing. Accept an intentional format change with
`UPDATE_SNAPSHOTS=1 npm test` so it arrives as a reviewable diff of `__tests__/snapshots/*.md` rather
than a hand edit. Rails and Spring have no fixture app: their extractors are a known gap, stated in
`cases.mjs` rather than papered over.

**`analysis/` is the generator's input, and everything in it is a candidate.** A label or a
`data-testid` found in source cannot be shown to resolve to exactly one element on a rendered page, so
a spec built from one carries `// UNVERIFIED` until a recording exercises it. That is the cost of
removing the browser, and it is paid openly: ambiguous elements are marked rather than dropped or
guessed at. `api-documentation.md` is a
precondition reference for `test-preconditions`, not a promise that an endpoint exists — Tier C records
what static analysis cannot reach rather than omitting it. Every analysis file carries a provenance
header (app path, commit, framework, timestamp) so a stale one is visible; re-run the analyzer rather
than hand-editing.

## Browser automation rule

`playwright-cli` (the Playwright Agent CLI, installed globally; skill at `.claude/skills/playwright-cli/`) is the only thing that drives a browser here. Never use the Playwright MCP (`mcp__playwright__*`) tools — `playwright-cli` replaces them and is far more token-efficient. Its scratch output lands in `.playwright-cli/` (gitignored).

The `playwright-codegen` skill (`.claude/skills/playwright-codegen/SKILL.md`) is the entry point for every "record a flow" / "capture a codegen session" request. It is the one deliberate exception to the rule above: `npx playwright codegen` opens a browser a **human** drives, and the skill shapes the result into `codegen-recordings/<flow>-<timestamp>.md` — the numbered steps, each ranked on the locator ladder, with every unstable step repaired against `analysis/label-dictionary.json` and credentials redacted. Recordings accumulate as a library; they are never edited afterwards, because a recording is evidence of what happened.

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
