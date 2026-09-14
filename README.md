# qa-micro-agents

Point this at a web application — its source *and* a running instance — and it produces a
Playwright test framework whose page objects contain **no locators at all**. Then you
describe a test in plain English, and an agent writes it.

```
your app's source ──┐
                    ├──►     analysis.json      ──►   generated-framework/
your app running ───┘                                            │
                                                    you paste numbered steps
                                                            │
                              test-preconditions → test-writer → test-runner
```

Two ideas are worth knowing before you start.

**The analysis is one file.** `analysis.json`, at the root, holds everything known about
your app: its declared routes, its API endpoints, every screen and control a crawl found,
and — critically — whether each control can be addressed reliably. `CLAUDE.md` documents
its ten sections.

**The pipeline knows what it does not know.** Every screen carries a confidence score. If
it is low, the agents will refuse to write a test and ask you to record the flow instead.
That is the system working, not failing.

---

## What you need

| | why |
| --- | --- |
| **Node.js 22+** | the pipeline and RuleSync run on it |
| **Claude Code, Codex, or OpenCode** | project skills and agents drive the analysis and test workflow |
| **A clone of the app under test** | the source half of the analysis. Any language |
| **A running instance you may crawl** | staging, a local `docker compose`, or a public demo |
| **`playwright-cli`** | the only thing allowed to drive a browser here: `npm install -g @playwright/cli@latest` |

A note on the running instance: **the crawl is read-only.** It follows menus and links and
never presses a button that could create or change data. It is safe to point at an
environment you care about — but point it at staging first anyway.

## Get started

### Working with Codex

Open this checkout in Codex and start a new session to discover `AGENTS.md`, the eight
skills in `.agents/skills/`, and the three agents in `.codex/agents/`. Use `$setup`
after filling in `.env`; Claude's `/skill-name` examples mean `$skill-name` in Codex.
The agents inherit your session model.

`CLAUDE.md` and `.claude/` remain the editable sources. After changing them, run:

```bash
npm install
npm run codex:sync
npm run codex:check
```

The refresh uses [RuleSync](https://github.com/dyoshikawa/rulesync), pinned to 16.31.0,
with a temporary import directory. It preserves skill helper files and references;
the test runner's known-issues table stays shared in `.claude/agents/`. Generation
does not delete obsolete outputs: remove a retired generated skill or agent explicitly.

Claude's write hooks require Claude tool payloads and are not registered in Codex.
Their policies are carried into `AGENTS.md` as instructions, without automatic write
blocking. Claude plugin enablement and scheduled-task state are client-specific.
The current `.mcp.json` has no servers, so no Codex MCP configuration is needed.

### Working with OpenCode

Open this checkout in OpenCode and ask it to use the `setup` skill after filling in
`.env`. OpenCode reads the shared `AGENTS.md`, eight skills in `.opencode/skills/`,
and three subagents in `.opencode/agents/`. You can also mention an agent directly,
for example `@test-preconditions`. See the official [skills](https://opencode.ai/docs/skills/)
and [agents](https://opencode.ai/docs/agents/) documentation.

After editing the Claude sources, refresh and verify both clients:

```bash
npm run codex:sync
npm run opencode:sync
npm run codex:check
npm run opencode:check
```

Both commands generate identical shared instructions, so their order does not matter.
OpenCode agents inherit the calling agent's model. The same hook limitation applies:
Claude hooks are carried as policies, not installed as OpenCode plugins. There are
currently no MCP servers or Claude commands to convert. Retired generated files need
explicit removal, as with Codex.

### Pipeline setup

Three steps. The third one does everything else.

### 1. Install

```bash
git clone <this repo> && cd qa-micro-agents
npm install             # the root toolchain
npm run setup           # the generator's toolchain
npm run pipeline:test   # 51 tests. If these pass, the pipeline itself is sound
```

### 2. Fill in `.env` — the only file you write by hand

```bash
cp .env.example .env
$EDITOR .env
```

It is commented line by line. Five things have to be right:

| | |
| --- | --- |
| `APP_BASE_URL` | where the running app lives |
| `APP_REPO_PATH` | where you cloned its source |
| `APP_USERNAME` / `APP_PASSWORD` | a test account. Without these the crawl sees only a login page |
| `AUTH_*_SELECTOR` | the username field, the password field, the submit button |
| `AUTH_READY_WHEN` | something **visible** that exists only once you are logged in |

That last one earns its own sentence. Without it nothing can tell a successful login
from a re-rendered login page, and you get an analysis full of screens that were never
reached. Pick something you can see — a container with zero height proves nothing.

**`.env` is gitignored. `.env.example` is committed and must never hold a real password.**

### 3. Say `/setup` in Claude Code

```
/setup
```

That is the whole of it. The skill installs what is missing, reads your source, proves
the login works, crawls the running app twice, compiles, gates the result and generates
the framework — then tells you how many screens you can write tests against today.

It takes a few minutes, mostly the crawl. It reports each phase as it goes.

**If something is wrong, it stops and names it.** Before doing any work `/setup` runs a
preflight you can also run yourself:

```bash
npm run preflight
```

Every line is `ok`, `warn` or `FIX`, and each `FIX` carries the one thing to change:

```
ok   APP_BASE_URL           https://staging.example.com/
FIX  source clone           /Users/you/Projects/my-app does not exist
                            -> Clone the application's source there, or point
                               APP_REPO_PATH at where it already is.
warn APP_USERNAME           not set - the crawl only sees what a logged-out visitor sees
```

`FIX` stops the run — those are decisions only you can make. `warn` continues, but means
a degraded result. It also catches the failure that otherwise looks like success: an
`analysis.json` left over from a *different* application, which compile and generate
would both happily run against.

### Then what?

You have `analysis.json` and a `generated-framework/` project. Skip to
[Now write a test](#now-write-a-test).

One app per checkout. To analyse a second application, give it its own worktree —
`npm run app:worktree -- <slug>` — rather than a second config here.

## Try it on an app that already works

OrangeHRM is committed with its analysis and its framework, so you can see what "done"
looks like before aiming at your own app.

```bash
cd generated-framework
npm install && npx playwright install chromium
npx tsc --noEmit
```

Now open any `src/pages/**/*.generated.ts` and notice there is not a single CSS selector
in it — just named controls. That is the point of the whole repo.

To actually *run* those tests you need credentials in the root `.env`.

## Now write a test

Paste numbered steps into Claude Code. Just that — no special syntax:

```
1. Log in as an admin
2. Go to Customers
3. Create a customer called Acme Ltd
4. Verify the customer appears in the list
```

Three agents run in order, automatically:

- **`test-preconditions`** decides which steps are *setup* (create the customer through
  the API — fast and reliable) and which are the *journey under test* (the UI). It checks
  that your API login is verified and that the screens are known well enough.
- **`test-writer`** writes the spec using the generated page objects.
- **`test-runner`** runs it and fixes it, but only using documented fixes.

### When it asks you to record instead

Sometimes you will get this back:

```
RECORDING REQUIRED: 1 screen(s) this script touches cannot be addressed yet.

  /customers/new   0.42  (record-first)
    7 control(s) cannot be addressed by name

Record the flow, and the analysis will learn it:

  Use the app-recorder skill, flow slug customers-new
```

A crawl can see what is *on* a page. It cannot see what a click *leads to*, which field
must be filled first, or what the app does on submit. When the score is low, two minutes
of recording settles what no amount of guessing will.

Ask for the `app-recorder` skill. It opens your app, logs you in, and hands you the
browser — you click through the flow once and say when you are done. What it captures is
not just the clicks: the requests your app made while you worked are captured from the
same session, so the endpoints behind the flow are learned too.

**Each recording makes the next one smaller.** The routes, controls, transitions and API
calls one recording proved go into `analysis.json` permanently, so the screens it touched
stop asking — and the endpoints it revealed become preconditions the agents can set up in
one call instead of clicking through.

One thing to know: a screen still below 0.7 *after* being recorded is not asking to be
recorded again. Its controls have no addressable names, and the fix is `npm run
crawl:deep`. The report says so when that is the case.

**This is the most important habit to build.** A spec written past a low score fails on
its third step and costs an hour to debug.

## The rules the repo enforces on you

A hook rejects writes that break these — it is not being difficult, each one is a bug
somebody already shipped:

- **No locators in a test.** `page.locator('.btn-save')` is rejected; `customerPage.save`
  is the way. Selectors live in one layer so a redesign is one edit.
- **No `waitForTimeout`.** Wait for evidence — an assertion, or the response itself.
- **No fixed names for created records.** `uniqueName('Customer')` — two test runs in the
  same second must not collide.
- **Never edit `analysis.json` or any `*.generated.ts`.** Both are rewritten.
  A wrong report is fixed by re-running the skill that wrote it.

`.claude/hooks/rules/` is the full list, and the rejection message always names the fix.

## Appendix: running a phase by hand

`/setup` runs all of these in order. Reach for one directly when you are re-running a
single phase — a fresh crawl after the app changed, say — or when you want to see what
failed.

### Read the source — three skills

Ask Claude Code to run them by name, in this order. Each writes one section of
`analysis.json` and nothing else:

```
run the app-dossier skill       # stack, declared routes, entities
run the app-components skill    # the UI library, how labels attach to inputs
run the app-api skill           # endpoints, and how to log in
```

`app-dossier` must go first; the other two read what it wrote.

### Prove the login actually works

```bash
npm run verify-auth -- --write
```

This runs the login the skill *read out of your source* against the running app, then
calls a protected endpoint twice — once anonymously, once with the credential — and only
says `verified` if the first is refused and the second admitted. A citation is a
hypothesis; this makes it a fact. Until it says `verified`, no agent will build test setup
on that login.

### Crawl the running app — two passes

```bash
playwright-cli -s=myapp open https://staging.example.com/

npm run crawl:map     # minutes: menus, buttons, tables
npm run crawl:deep    # longer: every control, proved unique
```

The **map** walks the application's own menus — because most business software does not
link its screens — and answers "where is everything?": every module, and per screen its
buttons, fields and tables. Read the `map` section of `analysis.json` afterwards; it is
the quickest picture of an app this repo produces. The **deep crawl** is what proves a
locator resolves to exactly one element.

### Compile, gate, generate

```bash
npm run compile     # joins source + crawl, scores every screen
npm run check       # tells you what is missing and who has not run
npm run generate    # writes generated-framework/
```

`check` is the one to read. `0 error(s)` means the contract is complete. Warnings name the
step you skipped.

### Run what came out

```bash
cd generated-framework
npm install && npx playwright install chromium
npx tsc --noEmit && npx playwright test   # credentials come from the root .env
```

---

## When something goes wrong

**Start with `npm run preflight`.** Most setup failures are a `.env` value, a missing
clone or a missing tool, and it names them directly.

| symptom | what it means |
| --- | --- |
| `/setup` stopped on a `FIX` line | that one is yours to fix — the line says what and how |
| the crawl found 0 modules | it is not logged in. Check the `AUTH_*` values, especially `AUTH_READY_WHEN` |
| `check` says a section is missing | that skill has not run. It names which one |
| `verify-auth` says `failed` | the login in the analysis is wrong. The observations show which step broke |
| a test fails with `AMBIGUOUS` | the locator matches more than one element — add a scoped accessor in the protected page object |
| a test fails with `NOT_FOUND` | the app moved, or the analysis is stale. Re-crawl |
| a page object is nearly empty | the crawl never reached that screen. Check `testability` in `analysis.json` |

Every failure names the component, the screen, and the file to re-crawl. They are written
to `test-results/diagnostics.jsonl` as well as the terminal.

## Where to read next

- **`CLAUDE.md`** — the architecture, and every rule with the reason it exists.
- **`scripts/analysis/README.md`** — the `analysis.json` contract, section by section.
- **`.claude/agents/`** — exactly what each agent will and will not do.
- **`.claude/skills/setup/SKILL.md`** — what `/setup` actually does, phase by phase.
