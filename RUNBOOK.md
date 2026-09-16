# Runbook

`/setup` runs every phase below in order, and `/framework` does the generate half.
Reach for a single phase directly when you are re-running one — a fresh crawl after
the app changed, say — or when you want to see what failed.

**No command takes `--app`.** There is one application per checkout, the one `.env`
describes. To analyse a second, give it its own worktree:

```bash
npm run app:worktree -- <slug>
```

---

## Running a phase by hand

### 1 · Read the source — three skills

Ask your agent to run them by name, in this order. Each writes one section of
`analysis.json` and nothing else:

```
run the app-dossier skill       # stack, declared routes, entities
run the app-components skill    # the UI library, how labels attach to inputs
run the app-api skill           # endpoints, and how to log in
```

`app-dossier` must go first; the other two read what it wrote.

### 2 · Prove the login actually works

```bash
npm run verify-auth -- --write
```

This runs the login the skill *read out of your source* against the running app, then
calls a protected endpoint twice — once anonymously, once with the credential — and says
`verified` only if the first was refused and the second admitted. A citation is a
hypothesis; this makes it a fact.

A login answering `200` is not evidence. A re-rendered login page answers `200` too.

Until it says `verified`, no agent will build test setup on that login.

### 3 · Crawl the running app — two passes

```bash
playwright-cli -s=myapp open https://staging.example.com/

npm run crawl:map     # minutes: menus, buttons, tables
npm run crawl:deep    # longer: every control, proved unique
```

The **map** walks the application's own menus — because most business software does not
link its screens — and answers "where is everything?": every module, and per screen its
heading, buttons, fields and tables. Read the `map` section of `analysis.json`
afterwards; it is the quickest picture of an app this repo produces. It is budgeted per
module and reports what it skipped and why.

The **deep crawl** is what proves a locator resolves to exactly one element.

### 4 · Compile and gate

```bash
npm run compile     # joins source + crawl, scores every screen
npm run check       # says what is missing, and who has not run
```

`check` is the one to read. `0 error(s)` means the contract is complete. Warnings name
the step you skipped.

### 5 · Record a flow the crawl could not reach

```bash
npm run record:ingest -- recordings/<flow>-<timestamp>.json
npm run compile
```

The `app-recorder` skill drives the recording itself. `npm run check` fails if the
ingest happened and the compile did not.

The merge is **additive, and the crawl always wins.** A recording proves a human
addressed one element once; it cannot prove no *second* element carries the same handle,
which is the one thing the crawl exists to establish.

### 6 · Draft, then generate — once

```bash
npm run draft                # writes framework-draft.md; writes no code
npm run draft -- --approve   # records that a human read it
npm run generate             # writes generated-framework/ — once, and only once
```

The draft is every page object, component and API resource the generator would write,
with the testability score and the evidence behind each control. It exists so the
decision to generate — which cannot be undone short of `rm -rf generated-framework/` —
is made by a human who read what will be built.

Recompiling the analysis changes the draft, which expires the approval automatically.

> `--force` skips the draft gate entirely. It exists for CI, where there is no human to
> approve. Never reach for it to get past an unapproved draft yourself.

### 7 · Run what came out

```bash
cd generated-framework
npm install && npx playwright install chromium
npx tsc --noEmit && npx playwright test   # credentials come from the root .env
```

---

## Reading the testability score

`compile-model.ts` scores every screen in place. The number answers one question:
*is there enough here to address the controls a test would touch?*

| score | what to do |
| --- | --- |
| **≥ 0.7** | write the test |
| **0.3 – 0.7** | record the flow first |
| **< 0.3** | the screen is a URL and little else — re-crawl it |

A low score is a request for evidence, not a defect in your app. And a screen still
below 0.7 *after* being recorded is not asking for a second recording: its controls
cannot be addressed by name, and the fix is `npm run crawl:deep`. The `missing` list
says so in those words.

---

## When something goes wrong

**Start with `npm run preflight`.** Most setup failures are a `.env` value, a missing
clone or a missing tool, and it names them directly. It also catches the failure that
otherwise looks like success: an `analysis.json` left over from a *different*
application, which compile and generate would both happily run against.

| symptom | what it means |
| --- | --- |
| `/setup` stopped on a `FIX` line | that one is yours — the line says what and how |
| the crawl found 0 modules | it is not logged in. Check `AUTH_*`, especially `AUTH_READY_WHEN` |
| `check` says a section is missing | that skill has not run. It names which one |
| `verify-auth` says `failed` | the login read out of your source is wrong. The observations show which step broke |
| a test fails with `AMBIGUOUS` | the locator matches more than one element — add a scoped accessor in the page object |
| a test fails with `NOT_FOUND` | the app moved, or the analysis is stale. Re-crawl |
| a page object is nearly empty | the crawl never reached that screen. Check `testability` in `analysis.json` |
| every failure reads `TIMED_OUT` | `actionTimeout` is not shorter than the test timeout. It must be, or nothing gets diagnosed |

Every failure names the component, the screen, and the file to re-crawl. It is one line
in `generated-framework/test-results/framework.log.jsonl`, which holds a JSON record for
**every** interaction a component makes, not only the ones that fail — so the lines just
before a failure show how the control was being addressed right up to the step that broke.

---

## Other agent clients

`CLAUDE.md` and `.claude/` are the editable sources. The Codex and OpenCode trees are
generated from them with [RuleSync](https://github.com/dyoshikawa/rulesync), pinned to
16.31.0. CI fails if they drift.

```bash
npm run codex:sync && npm run opencode:sync
npm run codex:check && npm run opencode:check
```

Both commands generate identical shared instructions, so their order does not matter.
Generation does **not** delete obsolete outputs: remove a retired skill or agent
explicitly.

### Codex

Open this checkout in Codex and start a session to discover `AGENTS.md`, the skills in
`.agents/skills/`, and the agents in `.codex/agents/`. Use `$setup` after filling in
`.env`; Claude's `/skill-name` examples mean `$skill-name`. Agents inherit your session
model.

### OpenCode

Open the checkout and ask it to use the `setup` skill. OpenCode reads the shared
`AGENTS.md`, the skills in `.opencode/skills/`, and the subagents in `.opencode/agents/`.
You can mention an agent directly, for example `@test-preconditions`. See the official
[skills](https://opencode.ai/docs/skills/) and [agents](https://opencode.ai/docs/agents/)
docs.

### The hook limitation

Claude's write hooks require Claude tool payloads and are not registered in Codex or
OpenCode. Their policies are carried into `AGENTS.md` as instructions, **without
automatic write blocking**. Claude plugin enablement and scheduled-task state are
client-specific, and the current `.mcp.json` has no servers.

---

## The tests of the pipeline itself

```bash
npm run pipeline:test        # the compiler and analysis suites
npm run pipeline:typecheck
npm run hooks:test           # the write-guard rule set
```

All three run in CI on every pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).
