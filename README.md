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
its nine sections.

**The pipeline knows what it does not know.** Every screen carries a confidence score. If
it is low, the agents will refuse to write a test and ask you to record the flow instead.
That is the system working, not failing.

---

## What you need

| | why |
| --- | --- |
| **Node.js 20+** | everything runs on it |
| **Claude Code** | the skills and agents in `.claude/` are how the analysis and the tests get written |
| **A clone of the app under test** | the source half of the analysis. Any language |
| **A running instance you may crawl** | staging, a local `docker compose`, or a public demo |
| **`playwright-cli`** | the only thing allowed to drive a browser here: `npm install -g @playwright/cli@latest` |

A note on the running instance: **the crawl is read-only.** It follows menus and links and
never presses a button that could create or change data. It is safe to point at an
environment you care about — but point it at staging first anyway.

## Setup — once

```bash
git clone <this repo> && cd qa-micro-agents
npm install          # the root toolchain
npm run setup        # the generator's toolchain
npm run pipeline:test   # 47 tests. If these pass, the pipeline itself is sound
```

Nothing is configured yet. That is the next step.

## Try it on an app that already works

OrangeHRM is committed with its analysis and its framework. Start here — you will see what
"done" looks like before you aim at your own app.

```bash
cd generated-framework
npm install && npx playwright install chromium
npx tsc --noEmit
```

Now open any `src/pages/**/*.generated.ts` and notice there is not a single CSS selector
in it — just named controls. That is the point of the whole repo.

To actually run the tests you need credentials in the root `.env` (below).

## Aim it at your own app

### 1. Write the .env — the only file you write by hand

```bash
cp .env.example .env
$EDITOR .env
```

`.env.example` is commented line by line. You need four things to be right:
`APP_BASE_URL`, `APP_REPO_PATH`, the `AUTH_*` selectors, and `AUTH_READY_WHEN` — something
genuinely visible once you are logged in.

`APP_USERNAME` and `APP_PASSWORD` go in `.env` too. **`.env` is gitignored; `.env.example`
is committed and must never hold a real password.**

One app per checkout. To analyse a second application, give it its own worktree —
`npm run app:worktree -- <slug>` — rather than a second config here.

### 2. Read the source — three skills, in Claude Code

Ask Claude Code to run them by name, in this order. Each writes one section of
`analysis.json` and nothing else:

```
run the app-dossier skill       # stack, declared routes, entities
run the app-components skill    # the UI library, how labels attach to inputs
run the app-api skill           # endpoints, and how to log in
```

`app-dossier` must go first; the other two read what it wrote.

### 3. Prove the login actually works

```bash
npm run verify-auth -- --write
```

This runs the login the skill *read out of your source* against the running app, then
calls a protected endpoint twice — once anonymously, once with the credential — and only
says `verified` if the first is refused and the second admitted. A citation is a
hypothesis; this makes it a fact. Until it says `verified`, no agent will build test setup
on that login.

### 4. Crawl the running app — two passes

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

### 5. Compile, gate, generate

```bash
npm run compile     # joins source + crawl, scores every screen
npm run check       # tells you what is missing and who has not run
npm run generate    # writes generated-framework/
```

`check` is the one to read. `0 error(s)` means the contract is complete. Warnings name the
step you skipped.

### 6. Run what came out

```bash
cd generated-framework
npm install && npx playwright install chromium
cp .env.example .env      # APP_USERNAME / APP_PASSWORD again, for the tests
npx tsc --noEmit && npx playwright test
```

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
Recording needed before this can be written:
  /customers/new — confidence 0.42 (7 control(s) cannot be addressed by name)
  Record it:  npx playwright codegen https://staging.example.com/customers/new
```

A crawl can see what is *on* a page. It cannot see what a click *leads to*, which field
must be filled first, or what the app does on submit. When the score is low, two minutes
of recording settles what no amount of guessing will. Run the command, click through the
flow once, and the `playwright-codegen` skill turns it into evidence the agents can use —
including registering it against the screens it covers, which is what raises the score.
A recording that is saved but never registered changes nothing.

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

## When something goes wrong

| symptom | what it means |
| --- | --- |
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
