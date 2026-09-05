---
name: playwright-codegen
description: Record a live Playwright codegen session against the app under test and shape the recording into a context-enriched reference file. Use for "record a codegen session", "run playwright codegen", "capture a codegen recording for <flow>".
allowed-tools: Bash(npx:*) Bash(node:*)
---

# Playwright codegen recording

Wraps https://playwright.dev/docs/codegen for the one case `playwright-cli` can't
cover: a **human** clicking through a live browser window while Playwright records
TypeScript. `playwright-cli` stays the tool for every agent-driven browser task in this
repo — this skill exists only to capture a human-driven recording and shape its output
into something reusable.

A recording is one of the two inputs `test-writer` reads. `analysis/` says what is on each
screen; a recording is the only record of what the app *does* — the order of steps, what a
click leads to, what the app accepts. The two compose, and shaping (step 3) is where they
meet: an unstable recorded locator is repaired against the label dictionary rather than left
for a human to puzzle over. This skill writes only to `codegen-recordings/`; never to
`generated-framework/` or `analysis/`.

## 1. Resolve BASE_URL

Read, in order, stopping at the first that exists:

1. `generated-framework/.env` — `BASE_URL=`
2. `generated-framework/.env.example` — `BASE_URL=` (warn: using the example default,
   suggest `cp .env.example .env`)
3. `scripts/app-config.yaml` — `baseUrl:`

Never hardcode an app URL. If none of the three resolve, stop and ask the user for one.

## 2. Run codegen (human-driven, backgrounded)

Pick a short kebab-case `<slug>` for the flow being recorded: derive it from the
request when a flow is named or implied (e.g. "record login" → `login`); when no flow
is named at all (e.g. "record a test", "run codegen now"), don't stop to ask — proceed
immediately with the fallback slug `recording` and just state that choice, as a fact,
in the message that reports launch. Either way, launch in the same turn BASE_URL
resolves — the request to record already is the instruction to start; never send a
"should I start?" message first.

```bash
node -e "require('fs').mkdirSync('.playwright-cli/codegen', { recursive: true })"
npx playwright codegen {BASE_URL} \
  --output=.playwright-cli/codegen/<slug>-raw.spec.ts \
  --target=playwright-test
```

(The `node -e mkdirSync` form works identically on macOS/Linux/Windows; `mkdir -p` does
not, since Windows `cmd.exe` doesn't understand `-p`.)

Launch this with `run_in_background: true`. The process stays alive until the human
ends the recording — by closing the browser window, closing just the codegen inspector
panel, or clicking "stop recording" in the inspector's own controls; all three tear
down the same backgrounded process the same way. Tell the user, before launching: *"A
browser window and a codegen inspector will open — click through the flow, then close
either one (or hit stop recording in the inspector) to finish; that's what triggers
shaping the recording."* Poll every ~10-15s; don't spin tighter than that. The moment
the process exits, immediately proceed to step 3 — process exit *is* the trigger, not a
separate confirmation from the user.

Once the process exits, read `.playwright-cli/codegen/<slug>-raw.spec.ts`. If it's
missing or empty, the human likely closed the window without recording anything — say
so and stop rather than shaping an empty file.

## 3. Shape into a context-enriched file

Parse the raw generated spec first, then derive the **output slug** from what was
actually recorded — this is what keeps successive recordings from colliding or
overwriting each other, and makes the filename itself a useful index of examples.
Build it as `<content-slug>-<timestamp>`:

- `<content-slug>`: a short kebab-case summary of the flow, read from the recorded
  actions — e.g. the page(s)/module(s) visited and the key action taken (`login`,
  `pim-add-employee`, `leave-apply-request`). Prefer the module name(s) from URLs
  (`/web/index.php/pim/...` → `pim`) plus the most distinguishing clicked
  role/label (an "Add Employee" listitem click → `add-employee`). If the request
  named a flow (e.g. "record login"), that name is still the base — append the
  timestamp to it rather than inventing a different content-slug.
- `<timestamp>`: `YYYYMMDD-HHmmss`, taken from when the recording finished (step 2),
  so two recordings of the same flow on different days/sessions never collide.

The raw file from step 2 was written under a throwaway slug — rename/copy it
alongside the shaped file so the pair stays matched: write the shaped file to
`codegen-recordings/<content-slug>-<timestamp>.md`, and copy the raw
spec to `.playwright-cli/codegen/<content-slug>-<timestamp>-raw.spec.ts` (the
original `.playwright-cli/codegen/<slug>-raw.spec.ts` is scratch and can stay or be
left — it's gitignored either way).

Create the destination directory first, cross-platform:

```bash
node -e "require('fs').mkdirSync('codegen-recordings', { recursive: true })"
```

Structure:

```markdown
# Codegen recording: <content-slug>

- Source URL: <BASE_URL>
- Recorded: <ISO timestamp>

## Steps

1. **goto** `<url>` 
2. **fill** `getByRole('textbox', { name: 'Username' })` = `"Admin"` — stable
3. **click** `locator('.oxd-table tr:nth-child(3) button')` — ⚠ UNSTABLE (positional CSS)
   → resolves to `recordsTable` — "Username" (table, rung 4) via `tableByColumn`
     [analysis/label-dictionary.json → /admin/viewSystemUsers]
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
- Rank every step's locator with `classify()` from
  `scripts/framework-generator/locator-ladder.mjs`, and record the rung. That module is the
  single ranking the whole repo shares, so a step flagged here reads the same way it would to
  the write-hook or the generator. Rungs 1-6 are stable; 7 and 8 are flagged **UNSTABLE**
  with the reason `classify` gives (positional, unnamed role, raw CSS, text-only).
- **Repair each flagged step against the label dictionary.** Take the route from the most
  recent `goto` (or the URL the step ran against), strip the `/web/index.php` prefix, and look
  it up in `analysis/label-dictionary.json`. Match the flagged element to a dictionary entry by
  position in the form and by kind, and record the resolved element — its `name`, `label` and
  rung — as the substitute. Write what it *is*, not what it might be:

  ```
  9. **click** `locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow')` — ⚠ UNSTABLE (raw CSS)
     → resolves to `leaveTypeDropdown` — "Leave Type" (dropdown, rung 4) via `labelledSelect`
       [analysis/label-dictionary.json → /leave/applyLeave]
  ```

  When the route is absent from the dictionary, or no entry plausibly matches, say so
  explicitly — `→ no dictionary entry for this control` — rather than guessing. An unrepaired
  step is a fact worth recording; a wrong repair is worse than none.
- **Redact credentials.** A login flow records `fill('Admin')` and `fill('admin123')` in
  clear. Replace the value with `«APP_USERNAME»` / `«APP_PASSWORD»` in the numbered steps
  **and** in the raw appendix, and note the redaction under the heading. These files are
  committed; a recording is not a place to keep a password.
- Keep the full raw codegen output verbatim in a collapsed appendix so nothing is lost
  in the shaping pass.

## 4. Report

Tell the user:
- Raw file path and shaped file path (both carrying the final `<content-slug>-<timestamp>` name).
- Step count, and how many were flagged UNSTABLE.
- How many flagged steps were repaired from the label dictionary, and how many could not be.
- That the shaped file is a reference — if they want it acted on, they can paste its steps
  into a `test-writer` request. Do not auto-invoke it.
- `codegen-recordings/` is a growing library of one file per recording —
  point them there if they ask "what have I recorded before".

## Rules

- The `npx playwright codegen` process is the one deliberate exception to "playwright-cli
  is the only thing that drives a browser here" — it exists solely so a human can record
  a session live. Nothing else in this skill opens a browser outside that one step.
- Never write under `generated-framework/` — it's hook-protected and this output isn't
  generator input anyway.
- Never invent or hardcode BASE_URL or credentials; read them from `.env` /
  `app-config.yaml` per step 1.
- Raw codegen output stays under `.playwright-cli/codegen/` (already gitignored); only
  the shaped Markdown file is committed, under `codegen-recordings/`.
- Every shaped file gets a unique `<content-slug>-<timestamp>.md` name (step 3) —
  never reuse the launch-time slug as the final filename, so recordings accumulate as
  a library instead of overwriting each other.
- This skill reads `analysis/label-dictionary.json` and never writes to it. The analysis is
  the repo analyzer's output; a recording that disagrees with it is a reason to re-run the
  analyzer, not to edit its report.
- Once BASE_URL resolves and a slug is chosen (from the request, or the `recording`
  fallback), launch codegen immediately in the same turn — do not ask for confirmation
  to start.
