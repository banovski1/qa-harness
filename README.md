# qa-micro-agents

Turns a local clone of a web app into a generated Playwright test framework, deterministically —
no browser anywhere in the generation path. See `CLAUDE.md` for full architecture notes; this is
just the setup.

```
a local clone of the app ──► repo-analyzer ──► analysis/ ──► framework-generator ──► generated-framework/
                                                    │
codegen-recordings/ ────────────────────────────────┴──► test-writer ──► specs
```

`analysis/` is what the app *has*: every route, the elements each screen renders, and the label of
each one. `codegen-recordings/` is what the app *does*: a human's flow through a real browser,
recorded once. Tests are written from both.

## Prerequisites

- Node.js
- A local clone of the app under test, beside this repo
- [`playwright-cli`](.claude/skills/playwright-cli/SKILL.md) installed globally — the only tool allowed to drive a browser in this repo

## Setup

Run everything from the repo root — all config paths are relative to it.

```bash
# 1. Point app-config.yaml at your target app. It is the source of truth for the two
#    required app facts: appPath and baseUrl. Credentials are NOT stored here — they
#    go in generated-framework/.env as APP_USERNAME / APP_PASSWORD.

# 2. Analyse the clone — routes, components, elements, API docs and live URLs
npm ci --prefix scripts/repo-analyzer
npm ci --prefix scripts/framework-generator
npm run analyze
# If the app is mounted under a prefix:
# npm run analyze -- --path-prefix <mount-prefix>
npm run check-analysis --prefix scripts/framework-generator            # gate: freshness + schema

# 3. Generate the framework from the analysis
npm run generate --prefix scripts/framework-generator        # from repo root
npm run generate:dry --prefix scripts/framework-generator   # preview only, writes nothing

# 4. Run the generated project
cd generated-framework
npm install && npx playwright install chromium
cp .env.example .env          # fill in APP_USERNAME / APP_PASSWORD
npm run typecheck
npm test
```

## Tooling Checks

Run these from the repository root; both packages execute TypeScript through `tsx`
and type-check it separately without emitting build files.

```bash
npm test --prefix scripts/repo-analyzer
npm run typecheck --prefix scripts/repo-analyzer
npm test --prefix scripts/framework-generator
npm run typecheck --prefix scripts/framework-generator
```

## This is the `clean` branch

It carries the toolchain and no target app: no `analysis/`, no `codegen-recordings/`, no
`generated-framework/`. Those appear when you run the analyzer, record a flow, and generate.

### Branching for a new language

```bash
git switch clean
git switch -c java
```

Then:

1. Set `language: java` in `scripts/framework-generator/generator-config.yaml`, and set `baseUrl` in root `app-config.yaml`.
2. Implement `renderPage` in `scripts/framework-generator/languages/java.ts`. Only
   `typescript.ts` does today — the rest return `null`, which the orchestrator treats as
   "scaffold only" and reports at generation time. `typescript.ts` is the worked reference.
3. Run the analyzer against your app clone, then `generate.ts`.

The adapter contract is `{ id, extension, emptyDirs, staticFiles, renderPage, renderTest }`,
registered in `languages/index.ts`. `generate.ts` never branches on language, so a new target
means implementing that one module and nothing else.

## Notes

- Never hand-edit `generated-framework/**/*.generated.ts` or anything under `analysis/` — both are
  overwritten by the tool that owns them. Put your own code in the protected `<Name>Page.ts`
  subclass, and fix an analysis by re-running the analyzer.
- To capture a flow for `test-writer`, invoke the `playwright-codegen` skill and click through it
  yourself; it writes a shaped file into `codegen-recordings/`.
- Pasting a numbered QA test script triggers `test-preconditions` → `test-writer` → `test-runner`
  automatically; no separate request needed.
