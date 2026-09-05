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
# 1. Point scripts/app-config.yaml at your target app (baseUrl, login locators, credentials)

# 2. Analyse the clone — routes, components, elements and their labels
cd scripts/repo-analyzer && npm install
node scripts/repo-analyzer/routes.mjs     --app ../orangehrm   # from repo root
node scripts/repo-analyzer/components.mjs --app ../orangehrm   # needs routes.mjs first
node scripts/repo-analyzer/live-urls.mjs  --path-prefix /web/index.php
node scripts/framework-generator/check-analysis.mjs            # gate: freshness + schema

# 3. Generate the framework from the analysis
cd scripts/framework-generator && npm install
node scripts/framework-generator/generate.mjs        # from repo root
node scripts/framework-generator/generate.mjs --dry-run   # preview only, writes nothing

# 4. Run the generated project
cd generated-framework
npm install && npx playwright install chromium
cp .env.example .env          # fill in APP_USERNAME / APP_PASSWORD
npm run typecheck
npm test
```

## Notes

- Never hand-edit `generated-framework/**/*.generated.ts` or anything under `analysis/` — both are
  overwritten by the tool that owns them. Put your own code in the protected `<Name>Page.ts`
  subclass, and fix an analysis by re-running the analyzer.
- To capture a flow for `test-writer`, invoke the `playwright-codegen` skill and click through it
  yourself; it writes a shaped file into `codegen-recordings/`.
- Pasting a numbered QA test script triggers `test-preconditions` → `test-writer` → `test-runner`
  automatically; no separate request needed.
