# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pipeline that turns a running web app into a Playwright test framework. The map is built by a skill
driving a real browser; everything downstream of the map is deterministic.

```
                            ┌─ scripts/repo-analyzer ──► analysis/   (static: components, routes, URLs, API)
a local clone of the app ───┤   (four skills, no browser)      │
                            └──────────────────────────────────┼── informs ─┐
                                                                            ▼
scripts/app-config.yaml ──► smart-map skill ──► ui-map-results/ ──► scripts/framework-generator ──► generated-framework/
   (login + conventions)     (walks the app,     (the application map)   (renders page objects)      (a real Playwright project)
                              module by module)
```

The analyzer branch is optional and read-only: it needs a **local clone** of the app under test, and it
tells the browser-driven half what exists before it opens a browser. `analysis/` never feeds the
generator directly — nothing enters the map without a live pass.

`scripts/` holds the config and the generator, `ui-map-results/` holds the map, `generated-framework/`
holds the committed output. Every path in the configs is relative to the **repo root**, so always run
from there.

The demo target is OrangeHRM's public demo, but nothing here contains app-specific code — retargeting
is a config edit plus a re-walk.

## Commands

```bash
# Stage 0 (optional) — static analysis of a local clone of the app under test
cd scripts/repo-analyzer && npm install
node scripts/repo-analyzer/detect.mjs     --app ../orangehrm   # what framework, and why
node scripts/repo-analyzer/components.mjs --app ../orangehrm   # analysis/frontend-components.md
node scripts/repo-analyzer/routes.mjs     --app ../orangehrm   # analysis/pages-and-routes.md
node scripts/repo-analyzer/api-docs.mjs   --app ../orangehrm   # add --cross-check <spec> if the app ships one
node scripts/repo-analyzer/live-urls.mjs  --path-prefix /web/index.php   # needs routes.mjs first
node scripts/repo-analyzer/__fixtures__/run.mjs                 # the analyzer's test suite
cd scripts/repo-analyzer && npm test                            # the same suite, with test names

# Stage 1 — build or refresh the map: invoke the `smart-map` skill ("map the PIM module").
#           There is no crawler script; the skill drives playwright-cli itself.
node scripts/framework-generator/check-map.mjs    # gate: schema + shared-nav invariants
node scripts/framework-generator/inventory.mjs    # rebuild ui-map-results/component-inventory.md

# Stage 2 — regenerate the framework from the map (no network access)
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

There is no test suite for the generator itself; `check-map.mjs`, `--dry-run` and a `git diff` of `generated-framework/` are the verification loop.

## Architecture notes that span files

**Never hand-edit `generated-framework/**/*.generated.ts`** — the generator overwrites it on the next run. `ui-map-results/application-map/*.yaml` is owned by the `smart-map` skill; hand-edit it only through that skill's rules, and run `check-map.mjs` afterwards.

**The generated/protected write policy** (`framework-generator/file-writer.mjs`) is the core contract. Every emitted file is tagged `generated` (overwritten every run) or `protected` (written once, then never touched). So `<Name>Page.generated.ts` carries the mapped locators and `<Name>Page.ts` — its subclass — carries your actions and assertions. Nothing is ever deleted. Put real test logic only in protected files.

**The locator vocabulary is closed and shared.** `framework-generator/locator-spec.mjs` defines the `{ strategy, args, name, within, nth }` shape used by the login config (input), the map (output), and the generator (consumer). Adding a strategy means touching that one module. The `smart-map` skill must verify every candidate resolves to exactly one element before writing it; ambiguous elements are left out rather than guessed.

**`locatorTemplates:` keeps app selectors out of both the page objects and the map.** The block in
`generator-config.yaml` maps a label to a selector (`{label}` is the placeholder), and the generator
emits it into `src/components/locator-templates.generated.ts` — the only file in the output naming an
app-specific selector. A map file names the template rather than repeating it —
`{ strategy: template, args: ["labelledInput"], name: "City" }` — and `fromMap` expands it into a plain
`css` spec at read time, which is what keeps `resolve()` and the other language adapters ignorant of
templates. `renderTemplate` in `locator-spec.mjs` is the single substitution rule, shared by that
expansion and the emitter's equivalence check so the two cannot disagree.
`to-templates.mjs <map file> [--write]` converts existing files, rewriting only exact matches. Where a template reproduces a mapped locator *exactly*, `factoryFor` in
`languages/typescript.mjs` emits `InputComponent.byLabel(this.page, 'City')` instead of the selector;
anything else keeps the locator the mapper verified. Equivalence is proved per element, never assumed,
so editing the block cannot silently re-point an accessor — it can only fall back. The
`GENERATION-REPORT.md` factory tally is how you see that happen. Component *instance* constructors stay
`(locator, description)`: the factories are statics taking a root, which is what keeps `BaseComponent.nth()`
and `within:` scoping working.

**`map-reader.mjs` absorbs every quirk of the map format** so no language adapter has to know about them: skipping locator-less synthetic nodes, parsing table columns out of the prose `comment:` string, lifting chrome present on ≥`sharedChromeThreshold` of pages into one `NavigationBar`, merging `*Module` redirect pages onto their list-page twin, keeping identifiers safe per target language, and detecting the URL segment used for folder grouping. It reads only `url`, `page`, `elements` and `states` from a map file, so a map file's `actions:` block rides along untouched.

**`check-map.mjs` guards the invariants that fail silently.** A map element missing `name`, `component` or `locator` is dropped without an error, and the shared-`NavigationBar` group collapses quietly if a nav locator changes on a handful of pages. Run it after any change to `ui-map-results/`, with `--strict <slug>` for the files you just wrote.

**`generate.mjs` never branches on language.** Languages are adapters in `languages/`, registered in `languages/index.mjs`, satisfying `{ id, extension, emptyDirs, staticFiles, renderPage, renderTest }`; `renderPage` returning `null` means "scaffold only". Only TypeScript renders page objects today — adding another language means implementing `renderPage` in its adapter and nothing else.

**Unstable locators are legacy, not the target.** Positional `nth:` locators are emitted with an `// UNSTABLE` comment and tabulated in `generated-framework/GENERATION-REPORT.md`. They are all left over from the deleted crawler; the `smart-map` skill uses a label-scoped `css` locator instead and should leave a module with none. Walking a module is the way to clear them.

**The login flow is not in the map** — the mapping skill logs in before it walks. The generator reads the login locators from `scripts/app-config.yaml` (`loginConfig:` in `generator-config.yaml`) to emit a working login helper. Credentials never flow through: they come from `APP_USERNAME`/`APP_PASSWORD` in the generated project's `.env`.

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

**`analysis/` is upstream context, never map input.** A `data-testid` found in source is a *candidate*:
static analysis cannot prove it resolves to exactly one element on a rendered page, and that proof is
the map's whole contract. Suggested locators are emitted UNVERIFIED and may only enter
`ui-map-results/` after `smart-map` confirms them live. Similarly `api-documentation.md` is a
precondition reference for `test-preconditions`, not a promise that an endpoint exists — Tier C records
what static analysis cannot reach rather than omitting it. Every analysis file carries a provenance
header (app path, commit, framework, timestamp) so a stale one is visible; re-run the analyzer rather
than hand-editing.

## Browser automation rule

`playwright-cli` (the Playwright Agent CLI, installed globally; skill at `.claude/skills/playwright-cli/`) is the only thing that drives a browser here. Never use the Playwright MCP (`mcp__playwright__*`) tools — `playwright-cli` replaces them and is far more token-efficient. Its scratch output lands in `.playwright-cli/` (gitignored).

The `smart-map` skill (`.claude/skills/smart-map/SKILL.md`) is the entry point for every "map the app" / "map the `<module>` module" / "regenerate ui-map-results" request. It walks one module at a time and writes `ui-map-results/application-map/<slug>.yaml` — one file per screen, carrying both `elements:` (the strict schema the generator reads) and `actions:` (what each control does, which `test-writer` reads). There is no crawler to fall back on: if the map is wrong, walk the module again.

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
