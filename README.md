# qa-micro-agents

Turns a running web app into a generated Playwright test framework. See `CLAUDE.md` for
full architecture notes; this is just the setup.

```
scripts/app-config.yaml ──► smart-map skill ──► ui-map-results/ ──► framework-generator ──► generated-framework/
```

## Prerequisites

- Node.js
- [`playwright-cli`](.claude/skills/playwright-cli/SKILL.md) installed globally — the only tool allowed to drive a browser in this repo

## Setup

Run everything from the repo root — all config paths are relative to it.

```bash
# 1. Point scripts/app-config.yaml at your target app (baseUrl, login locators, credentials)

# 2. Build the application map — invoke the `smart-map` skill, e.g. "map the PIM module"
#    (no crawler script; the skill drives playwright-cli itself)
node scripts/framework-generator/check-map.mjs      # gate: schema + shared-nav invariants

# 3. Generate the framework from the map
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

- Never hand-edit `generated-framework/**/*.generated.ts` or `ui-map-results/application-map/*.yaml`
  outside their owning tools — both are overwritten/managed automatically.
- Pasting a numbered QA test script triggers `test-preconditions` → `test-writer` → `test-runner`
  automatically; no separate request needed.
