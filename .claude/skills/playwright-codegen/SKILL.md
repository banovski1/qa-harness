---
name: playwright-codegen
description: Record a live Playwright codegen session against the app under test and shape the recording into a context-enriched reference file. Use for "record a codegen session", "run playwright codegen", "capture a codegen recording for <flow>".
allowed-tools: Bash(npx:*) Bash(node:*)
---

# Playwright codegen recording

Wraps https://playwright.dev/docs/codegen for the one case `playwright-cli` can't
cover: a **human** clicking through a live browser window while Playwright records
TypeScript. `playwright-cli` stays the tool for every agent-driven browser task in this
repo (`smart-map`, test authoring, ad-hoc automation) — this skill exists only to
capture a human-driven recording and shape its output into something reusable. It does
not join the map → generator → framework pipeline: it produces a standalone reference
file, nothing under `generated-framework/` or `ui-map-results/application-map/`.

## 1. Resolve BASE_URL

Read, in order, stopping at the first that exists:

1. `generated-framework/.env` — `BASE_URL=`
2. `generated-framework/.env.example` — `BASE_URL=` (warn: using the example default,
   suggest `cp .env.example .env`)
3. `scripts/app-config.yaml` — `baseUrl:`

Never hardcode an app URL. If none of the three resolve, stop and ask the user for one.

## 2. Run codegen (human-driven, backgrounded)

Pick a short kebab-case `<slug>` for the flow being recorded (ask the user if it isn't
obvious from their request — e.g. "record login" → `login`).

```bash
mkdir -p .playwright-cli/codegen
npx playwright codegen {BASE_URL} \
  --output=.playwright-cli/codegen/<slug>-raw.spec.ts \
  --target=playwright-test
```

Launch this with `run_in_background: true` — the codegen window blocks until a human
closes it, so the skill must poll for the process to exit rather than wait
synchronously. Tell the user, before launching: *"A browser window will open — click
through the flow, then close that window (or the codegen inspector) to finish
recording."* Poll every ~10-15s; don't spin tighter than that.

Once the process exits, read `.playwright-cli/codegen/<slug>-raw.spec.ts`. If it's
missing or empty, the human likely closed the window without recording anything — say
so and stop rather than shaping an empty file.

## 3. Shape into a context-enriched file

Parse the raw generated spec and write `ui-map-results/codegen-recordings/<slug>.md`
(create the directory if it doesn't exist yet — this is a new, committed sibling of
`ui-map-results/application-map/`, not scratch).

Structure:

```markdown
# Codegen recording: <slug>

- Source URL: <BASE_URL>
- Recorded: <ISO timestamp>

## Steps

1. **goto** `<url>` 
2. **fill** `getByRole('textbox', { name: 'Username' })` = `"Admin"` — stable
3. **click** `locator('.oxd-table tr:nth-child(3) button')` — ⚠ UNSTABLE (positional CSS)
   → candidate template: `tableByColumn` (scripts/framework-generator/generator-config.yaml)
...

## Raw generated code

<details>
<summary>playwright codegen output, unedited</summary>

​```typescript
<the raw file, verbatim>
​```

</details>
```

Shaping rules:
- One numbered step per recorded action, in order, preserving the raw locator
  Playwright emitted and any typed/selected value.
- Flag a step **UNSTABLE** when its locator is raw CSS, uses `nth()`/positional
  indexing, or matches on visible text alone. Leave stable role/label/testid locators
  unflagged — mirrors the stable-vs-`// UNSTABLE` distinction `smart-map` already uses
  for the application map, so a reader recognizes the convention.
- For any flagged step, check whether the target's label matches a
  `locatorTemplates:` entry in `scripts/framework-generator/generator-config.yaml`
  (`labelledInput`, `labelledTextarea`, `labelledSelect`, `topNavTab`, `tableByColumn`)
  and note the template name as a candidate substitute. This is a note for a human or
  `smart-map` to verify and apply — this skill never edits the map or the templates
  block itself.
- Keep the full raw codegen output verbatim in a collapsed appendix so nothing is lost
  in the shaping pass.

## 4. Report

Tell the user:
- Raw file path and shaped file path.
- Step count, and how many were flagged UNSTABLE.
- That the shaped file is a reference only — if they want it acted on, they can hand it
  to `smart-map` (to verify/add locators to the map) or paste its steps into a
  `test-writer` request. Do not auto-invoke either.

## Rules

- The `npx playwright codegen` process is the one deliberate exception to "playwright-cli
  is the only thing that drives a browser here" — it exists solely so a human can record
  a session live. Nothing else in this skill opens a browser outside that one step.
- Never write under `generated-framework/` — it's hook-protected and this output isn't
  generator input anyway.
- Never invent or hardcode BASE_URL or credentials; read them from `.env` /
  `app-config.yaml` per step 1.
- Raw codegen output stays under `.playwright-cli/codegen/` (already gitignored); only
  the shaped Markdown file is committed, under `ui-map-results/codegen-recordings/`.
- This skill does not touch `ui-map-results/application-map/`, the generator, or
  `check-map.mjs` — those stay `smart-map`'s territory.
