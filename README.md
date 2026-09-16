<div align="center">

# qa-harness

**Point it at a web app. Get a Playwright framework whose page objects contain no locators at all.**

Then describe a test in plain English, and an agent writes it.

[![CI](https://github.com/bklv1/qa-harness/actions/workflows/ci.yml/badge.svg)](https://github.com/bklv1/qa-harness/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Node 22+](https://img.shields.io/badge/node-22%2B-5FA04E.svg)](https://nodejs.org)
[![Sponsor](https://img.shields.io/badge/sponsor-%E2%9D%A4-db61a2.svg)](https://github.com/sponsors/bklv1)

</div>

```
your app's source ──┐
                    ├──►  analysis.json  ──►  framework-draft.md ──(you approve)──►  generated-framework/
your app running ───┘                                                                        │
                                                                              you paste numbered steps
                                                                                             │
                                                        test-preconditions → test-writer → test-runner
```

---

## Why this exists

Every page object you have ever maintained rots because a selector lives in it. This
one puts selectors in exactly one layer and lets everything above it speak English:

```ts
// a test against generated page objects — this is the whole vocabulary
await employeeListPage.goto();
await employeeListPage.employeeName.fill(name);
await employeeListPage.search.click();
await employeeListPage.employeeList.expectRow(id);
```

Not a CSS selector in sight, and a hook rejects one if you add it. The page object
behind it is equally selector-free — every control is a named component built from the
label a human reads, proved by the crawl to resolve to exactly one element.

Two ideas are worth knowing before you start.

**The analysis is one file.** `analysis.json` holds everything known about your app —
declared routes, API endpoints, every screen and control a crawl found, and whether each
control can be addressed *reliably*. Nothing else is derived and committed beside it.

**The pipeline knows what it does not know.** Every screen carries a confidence score.
When it is low the agents refuse to write the test and ask you to record the flow
instead. That is the system working, not failing.

---

## What you need

| | why |
| --- | --- |
| **Node.js 22+** | the pipeline runs on it |
| **Claude Code, Codex, or OpenCode** | the skills and agents that drive analysis and test writing |
| **A clone of the app's source** | declared routes, entities, endpoints. Any language |
| **A running instance you may crawl** | staging, a local `docker compose`, or a public demo |
| **`playwright-cli`** | the only thing allowed to drive a browser here — `npm i -g @playwright/cli@latest` |

**The crawl is read-only.** It follows menus and links and never presses a button that
could create or change data. Point it at staging first anyway.

---

## Quickstart

### 1 · Install

```bash
git clone https://github.com/bklv1/qa-harness.git && cd qa-harness
npm install && npm run setup
npm run pipeline:test    # if these pass, the pipeline itself is sound
```

### 2 · Fill in `.env` — the only file you write by hand

```bash
cp .env.example .env && $EDITOR .env
```

It is commented line by line. Five things have to be right:

| | |
| --- | --- |
| `APP_BASE_URL` | where the running app lives |
| `APP_REPO_PATH` | where you cloned its source |
| `APP_USERNAME` / `APP_PASSWORD` | a test account — without it the crawl sees a login page and nothing else |
| `AUTH_*_SELECTOR` | the username field, the password field, the submit button |
| `AUTH_READY_WHEN` | something **visible** that exists only once you are logged in |

> That last one earns its own sentence. Without it nothing can tell a successful login
> from a re-rendered login page, and you get an analysis full of screens that were never
> reached. A container with zero height proves nothing — pick something you can see.

**`.env` is gitignored. `.env.example` is the committed template and holds placeholders only.**

### 3 · Say `/setup`

```
/setup
```

It installs what is missing, reads your source, proves the login actually works, crawls
the running app twice, compiles and gates the result — then writes `framework-draft.md`
and **stops**. Every page object, component and API resource it *would* generate, with
the testability score and the evidence behind each control. It generates nothing.

Read the draft. If it is the right foundation:

```bash
npm run draft -- --approve   # records that a human read it
npm run generate             # writes generated-framework/ — once, and only once
```

Takes a few minutes, mostly the crawl. It reports each phase as it goes.

### When it stops instead

`/setup` runs a preflight first, which you can also run yourself:

```bash
npm run preflight
```

Every line is `ok`, `warn` or `FIX`, and each `FIX` names the one thing to change:

```
ok   APP_BASE_URL           https://staging.example.com/
FIX  source clone           /Users/you/Projects/my-app does not exist
                            -> Clone the application's source there, or point
                               APP_REPO_PATH at where it already is.
warn APP_USERNAME           not set - the crawl only sees what a logged-out visitor sees
```

`FIX` stops the run — those are decisions only you can make. `warn` continues, degraded.

---

## Write a test

Paste numbered steps. No special syntax:

```
1. Log in as an admin
2. Go to Customers
3. Create a customer called Acme Ltd
4. Verify the customer appears in the list
```

Three agents run in order, automatically:

| agent | what it does |
| --- | --- |
| **`test-preconditions`** | splits *setup* (create the customer over the API — fast, reliable) from the *journey under test* (the UI), and checks the login is verified and the screens are known well enough |
| **`test-writer`** | writes the spec against the generated page objects |
| **`test-runner`** | runs it and fixes it, using documented fixes only |

### When it asks you to record instead

```
RECORDING REQUIRED: 1 screen(s) this script touches cannot be addressed yet.

  /customers/new   0.42  (record-first)
    7 control(s) cannot be addressed by name
```

A crawl sees what is *on* a page. It cannot see what a click *leads to*. Ask for the
`app-recorder` skill: it opens your app, logs you in, and hands you the browser. You
click the flow once. It captures the clicks **and** the requests your app made while
you worked, so the endpoints behind the flow are learned too.

**Each recording makes the next one smaller** — routes, controls, transitions and API
calls go into `analysis.json` permanently.

> A screen still below 0.7 *after* being recorded is not asking for a second recording.
> Its controls have no addressable names, and the fix is `npm run crawl:deep`.

**This is the habit to build.** A spec written past a low score fails on step three and
costs an hour.

---

## See it working first

OrangeHRM is committed with its analysis and its framework, so you can see what "done"
looks like before aiming this at your own app:

```bash
cd generated-framework && npm install && npx tsc --noEmit
```

Open any `src/pages/**/*.ts`. Not one CSS selector. That is the point of the whole repo.

---

## The rules the repo enforces on you

A hook rejects writes that break these. Each one is a bug somebody already shipped:

- **No locators in a test.** `page.locator('.btn-save')` is rejected; `customerPage.save`
  is the way. Selectors live in one layer so a redesign is one edit.
- **No `waitForTimeout`.** Wait for evidence — an assertion, or the response itself.
- **No fixed names for created records.** `uniqueName('Customer')`. Two runs in the same
  second must not collide.
- **Never hand-edit `analysis.json`.** A wrong report is fixed by re-running the skill
  that wrote it.

`.claude/hooks/rules/` is the full list, and the rejection always names the fix.

---

## Where to go next

| | |
| --- | --- |
| [**RUNBOOK.md**](RUNBOOK.md) | run any phase by hand, and what to do when something breaks |
| [**CLAUDE.md**](CLAUDE.md) | the architecture, and every rule with the reason it exists |
| [**CONTRIBUTING.md**](CONTRIBUTING.md) | how to send a change, and what a good one looks like |
| `scripts/analysis/README.md` | the `analysis.json` contract, section by section |
| `.claude/agents/` | exactly what each agent will and will not do |

Using **Codex** or **OpenCode** instead of Claude Code? Both are supported —
[RUNBOOK.md](RUNBOOK.md#other-agent-clients) has the details. Claude's `/skill-name`
is `$skill-name` in Codex.

---

## Support this project

qa-harness is Apache-2.0 and free to use. If it saved you a week of writing page
objects, [**sponsor it**](https://github.com/sponsors/bklv1) — it funds the corpus of
apps every generator change is validated against.

## Licence

[Apache-2.0](LICENSE) © Cvetomir Banovski.

Contributions are licensed under the same terms — Apache-2.0 includes an explicit
contribution grant (section 5), so there is nothing extra to sign.
