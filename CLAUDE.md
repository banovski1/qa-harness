# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A two-stage, fully deterministic pipeline that turns a running web app into a Playwright test framework. No model is in the loop at either stage — the same input always produces the same output.

```
app-map-config.yaml ──► scripts/ui-mapper-script ──► ui-map-results/ ──► scripts/framework-generator ──► generated-framework/
   (login flow spec)      (crawls the a11y tree)      (the application map)     (renders page objects)      (a real Playwright project)
```

The three top-level directories map onto that pipeline: `scripts/` holds the two tools, `ui-map-results/` holds the intermediate artifact, `generated-framework/` holds the committed output. Every path in both tools' configs is relative to the **repo root**, so always run them from there.

The demo target is OrangeHRM's public demo, but neither tool contains app-specific code — retargeting is a config edit only.

## Commands

Each tool has its own `node_modules`; install once per tool.

```bash
# Stage 1 — crawl the app and rebuild the map (opens a Chromium window)
cd scripts/ui-mapper-script && npm install     # postinstall downloads Chromium
node scripts/ui-mapper-script/mapper.mjs [path/to/spec.yaml]     # from repo root

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

There is no test suite for the two tools themselves; `--dry-run` plus a `git diff` of `generated-framework/` is the verification loop.

## Architecture notes that span files

**Never hand-edit the generated artifacts.** `ui-map-results/**` is owned by the mapper and `generated-framework/**/*.generated.ts` by the generator; edits there are silently destroyed on the next run.

**The generated/protected write policy** (`framework-generator/file-writer.mjs`) is the core contract. Every emitted file is tagged `generated` (overwritten every run) or `protected` (written once, then never touched). So `<Name>Page.generated.ts` carries the mapped locators and `<Name>Page.ts` — its subclass — carries your actions and assertions. Nothing is ever deleted. Put real test logic only in protected files.

**The locator vocabulary is closed and shared.** `ui-mapper-script/locator-spec.mjs` defines the `{ strategy, args, name, within, nth }` shape used by the login spec (input), the emitted map (output), and the generator (consumer). Adding a strategy means touching that one module. The mapper verifies every candidate resolves to exactly one element via `locator.count()`; ambiguous elements are skipped rather than guessed.

**`map-reader.mjs` absorbs every quirk of the map format** so no language adapter has to know about them: skipping locator-less synthetic nodes, parsing table columns out of the prose `comment:` string, lifting chrome present on ≥`sharedChromeThreshold` of pages into one `NavigationBar`, merging `*Module` redirect pages onto their list-page twin, keeping identifiers safe per target language, and detecting the URL segment used for folder grouping.

**`generate.mjs` never branches on language.** Languages are adapters in `languages/`, registered in `languages/index.mjs`, satisfying `{ id, extension, emptyDirs, staticFiles, renderPage, renderTest }`; `renderPage` returning `null` means "scaffold only". Only TypeScript renders page objects today — adding another language means implementing `renderPage` in its adapter and nothing else.

**Unstable locators are expected, not a bug.** Roughly a third of a typical map is positional because the element had no accessible name. Those are emitted with an `// UNSTABLE` comment and tabulated in `generated-framework/GENERATION-REPORT.md`. Replace them with stable locators in the *protected* file as you touch them.

**The login flow is not in the map** — the mapper logs in before crawling. The generator reads the login locators from the mapper's spec (`loginConfig:` in `generator-config.yaml`) to emit a working login helper. Credentials never flow through: they come from `APP_USERNAME`/`APP_PASSWORD` in the generated project's `.env`.

**`.gitattributes` pins `eol=lf`** because the generator writes LF and `generated-framework/` is committed. Do not relax it — under Windows `core.autocrlf` every generated file would show as modified with no content change.

## Browser automation rule

`node scripts/ui-mapper-script/mapper.mjs` is the only thing allowed to drive a browser. Never use the Playwright MCP (`mcp__playwright__*`) tools — not for crawling, not to verify a locator, not to "just check" the login page. If the mapper fails, fix the spec or fix the mapper.

The `app-map` skill (`.claude/skills/app-map/SKILL.md`) is the entry point for "map the app" requests; it validates the spec, prompting only for missing **required** fields, then runs the mapper.

## Test authoring rule

**A pasted numbered test script is always a `test-writer` request.** When a message contains an ordered list of steps starting at `1.` — a QA script in plain English — delegate it to the `test-writer` subagent (`.claude/agents/test-writer.md`) via the Agent tool with `subagent_type: "test-writer"`, passing the steps through verbatim. Do not write the spec yourself, and do not ask whether to delegate first.

This overrides any standing instruction not to invoke the Agent tool unprompted: in this repo, pasting test steps *is* the request to run `test-writer`. Relay its report — files created and modified, `// UNVERIFIED` locators, new `.env` variables, and the command to run the spec. To bypass it for one message, say so explicitly ("write this yourself").
