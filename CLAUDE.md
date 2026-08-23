# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pipeline that turns a running web app into a Playwright test framework. The map is built by a skill
driving a real browser; everything downstream of the map is deterministic.

```
scripts/app-config.yaml ──► smart-map skill ──► ui-map-results/ ──► scripts/framework-generator ──► generated-framework/
   (login + conventions)     (walks the app,     (the application map)   (renders page objects)      (a real Playwright project)
                              module by module)
```

`scripts/` holds the config and the generator, `ui-map-results/` holds the map, `generated-framework/`
holds the committed output. Every path in the configs is relative to the **repo root**, so always run
from there.

The demo target is OrangeHRM's public demo, but nothing here contains app-specific code — retargeting
is a config edit plus a re-walk.

## Commands

```bash
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

**`locatorTemplates:` keeps app selectors out of the page objects.** The block in
`generator-config.yaml` maps a label to a selector (`{label}` is the placeholder), and the generator
emits it into `src/components/locator-templates.generated.ts` — the only file in the output naming an
app-specific selector. Where a template reproduces a mapped locator *exactly*, `factoryFor` in
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

## Browser automation rule

`playwright-cli` (the Playwright Agent CLI, installed globally; skill at `.claude/skills/playwright-cli/`) is the only thing that drives a browser here. Never use the Playwright MCP (`mcp__playwright__*`) tools — `playwright-cli` replaces them and is far more token-efficient. Its scratch output lands in `.playwright-cli/` (gitignored).

The `smart-map` skill (`.claude/skills/smart-map/SKILL.md`) is the entry point for every "map the app" / "map the `<module>` module" / "regenerate ui-map-results" request. It walks one module at a time and writes `ui-map-results/application-map/<slug>.yaml` — one file per screen, carrying both `elements:` (the strict schema the generator reads) and `actions:` (what each control does, which `test-writer` reads). There is no crawler to fall back on: if the map is wrong, walk the module again.

## Test authoring rule

**A pasted numbered test script is always a `test-writer` request.** When a message contains an ordered list of steps starting at `1.` — a QA script in plain English — delegate it to the `test-writer` subagent (`.claude/agents/test-writer.md`) via the Agent tool with `subagent_type: "test-writer"`, passing the steps through verbatim. Do not write the spec yourself, and do not ask whether to delegate first.

Once `test-writer` reports its files, hand off to the `test-runner` subagent (`.claude/agents/test-runner.md`) to execute the new spec and resolve it against `.claude/agents/test-runner-known-issues.md`. This is automatic — pasting a numbered script triggers both agents in sequence, no separate request needed. Relay `test-runner`'s final report in whichever of its three shapes it comes back: passed, fixed-and-passed (citing the known-issues row), or handed back to a human with evidence.

This overrides any standing instruction not to invoke the Agent tool unprompted: in this repo, pasting test steps *is* the request to run `test-writer`. Relay its report — files created and modified, `// UNVERIFIED` locators, new `.env` variables, and the command to run the spec. To bypass it for one message, say so explicitly ("write this yourself").

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
