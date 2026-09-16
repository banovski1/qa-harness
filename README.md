<div align="center">

# qa-harness

**Point it at a web app. Get a solid Playwright framework foundation and build on top of it using agents.**

Then describe a test in plain English, and an agent writes it.

[![CI](https://github.com/bklv1/qa-harness/actions/workflows/ci.yml/badge.svg)](https://github.com/bklv1/qa-harness/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Node 22+](https://img.shields.io/badge/node-22%2B-5FA04E.svg)](https://nodejs.org)
[![Sponsor](https://img.shields.io/badge/sponsor-%E2%9D%A4-db61a2.svg)](https://github.com/sponsors/bklv1)

<sub>Built by [Tsvetomir Banovski](https://github.com/bklv1) · [what this is and why](#who-built-this-and-why)</sub>

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

### Four decisions that make that possible

**A handle is emitted only if it addresses exactly one element.** Not "probably one" —
the crawl proves it against the running app. Controls are grouped by the handle each
would carry; a group of one is addressable, a larger one is retried scoped to the
heading above it, and whatever that does not separate is marked unverified and left out.
A numeric suffix never disambiguates anything: `select` and `select2` carrying the same
locator both resolve to both elements, and that failure belongs in the compiler, not in
your test at 2am.

**Source and the running app answer different questions, and you need both.** Source
knows every route the app declares and which endpoint creates a record. Only the running
app can prove a locator is unique. Neither substitutes for the other, and the compiler is
where they join.

**The pipeline knows what it does not know.** Every screen carries a confidence score
between 0 and 1. Below 0.7 the agents *refuse* to write the test and ask you to record
the flow instead. That is the system working, not failing — a spec written past a low
score fails on its third step and costs an hour.

**Failures classify instead of timing out.** `NOT_FOUND`, `AMBIGUOUS`, `HIDDEN`,
`DISABLED`, `COVERED`, `DETACHED` — each with the evidence that distinguishes it, the
component and screen that produced it, and the path to re-crawl. Every wait is a named
condition that reports what it saw instead:

```
waited 5041ms for the table to render — no element matches .oxd-table
```

So the misdiagnosis that ends in a pasted `waitForTimeout` is simply not available.

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

**This is the habit to build.** Recording when asked is the cheapest two minutes in the
whole workflow.

---

## What "done" looks like

A clone of this repo is empty of app data on purpose — `analysis.json` and
`generated-framework/` describe *your* application, so they are produced, never shipped.
Here is a page object the generator wrote for a real screen, trimmed:

```ts
export class EmployeeListPage extends BasePage {
  readonly path = '/pim/viewEmployeeList';

  readonly employeeName = new TextField(this.page, { label: 'Employee Name', via: 'proximity' }, ctx);
  readonly employmentStatus = new Select(this.page, { label: 'Employment Status', via: 'proximity' }, ctx);
  readonly search = new Button(this.page, { label: 'Search' }, ctx);
  readonly employeeList = new RecordTable(this.page, 'employeeList', { keyColumn: 'Id', ... });

  // Everything above came from the analysis. Everything below is yours: actions,
  // assertions, and the domain language a crawl could not know.
}
```

Not one CSS selector, and that app's markup has no `for=` on a single label — `via:
'proximity'` is the crawl recording that it found the label by walking outward, and the
runtime performing the same walk. That is the point of the whole repo.

Run `/setup` against your own app and you get this file, for every screen it reached.

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

## Things learned the hard way, encoded

Each of these cost a debugging session before it became a line of code. They are the
reason the generated framework behaves the way it does:

**Never use `exact: true` on an accessible name.** A button built from an icon plus text
computes its name as `"+ Create Contact"` once the icon font loads, and `"Create
Contact"` before it does. The same test passes and fails depending on font timing.
`wholeName()` anchors the end and requires a word boundary at the start instead.

**A table that has not rendered reads exactly like a table that is empty.** Both give you
zero rows. `settled()` waits for the root element first and then tells you which of the
two it actually is — the distinction between "broken" and "no results", which no row
count can give you.

**`isVisible()` does not wait.** It is a query, not an assertion, and using it as one
produces a test that passes on a fast machine and fails on CI. `expectVisible()` is the
assertion.

**A `<table>` with no header row is a layout table, not a collection.** One app in the
corpus has dozens of them. Treating them as data is how you get a page object full of
tables nobody can address.

**A screen's identity is its URL pattern, anchored.** Without the anchor, `/#Contact`
also matches `/#Contact/view/123`, and a test that never left the detail screen cheerfully
reports that it is on the list.

**`actionTimeout` must be shorter than the test timeout.** A component has to fail while
there is still budget left to diagnose *why*. Otherwise every failure in the suite reads
as `TIMED_OUT`, and the taxonomy above is worthless.

**A table is addressed by what is in it, never by where a row sits.** `.nth(0)` and "the
last row" break the moment sorting, paging or a parallel worker changes anything — which
is exactly when a create test needs to find the row it just made. So every public
accessor takes a value: `row(key)`, `cell(key, column)`, `expectRow(key)`. And since
"the row you just created" is only reliable against a value only *this* run could have
produced, every create test names its record through `uniqueName('Contact')` →
`Contact-k3f9a2`. When `expectRow` fails, it prints the rows that were actually there.

---

## Who built this, and why

I'm [Tsvetomir Banovski](https://github.com/bklv1). I write test automation, and I got
tired of the same failure: a page object full of CSS selectors, a redesign, and a week of
work that produces no new coverage — only the same coverage, re-addressed.

The interesting part was never "generate page objects." Plenty of tools do that, and what
they produce is a pile of brittle selectors with a class around it. The interesting part
is **refusing to emit a handle that has not been proved unique**, and **being honest about
which screens are not ready to be tested.** A generator that always succeeds is a
generator that has quietly moved the failure into your test suite.

So the whole design is organised around evidence. Authentication is verified against the
running app rather than read out of source and believed. A locator is emitted only when
the crawl proved it resolves to one element. A screen the crawl could not reach is marked
`crawled: false` rather than guessed at. And when the evidence is thin, the agents say so
and ask for a recording instead of writing a test that will fail on step three.

If that resonates, or you want to talk about testing, agents, or any of the decisions
above — [open an issue](https://github.com/bklv1/qa-harness/issues), or find me on
[GitHub](https://github.com/bklv1).

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

[Apache-2.0](LICENSE) © Tsvetomir Banovski.

Contributions are licensed under the same terms — Apache-2.0 includes an explicit
contribution grant (section 5), so there is nothing extra to sign.
