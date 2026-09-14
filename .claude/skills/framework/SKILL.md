---
name: framework
description: Build the test framework from an approved draft and prove it compiles and runs — generate, install, typecheck, smoke. Use for "/framework", "generate the framework", "build the tests", "does the framework compile", "the draft is approved". Runs after /setup.
allowed-tools: Bash(npm:*) Bash(npx:*) Bash(node:*) Bash(cat:*) Bash(ls:*) Bash(head:*) Bash(grep:*) Bash(rm:*)
---

# Building the framework, once

`/setup` ends at `framework-draft.md` — a proposal, with nothing written. This skill is
the other half: turn an approved draft into a Playwright project, and prove the project
compiles and runs before handing it to whoever writes the tests.

**The generator runs once.** There is no second run to fix a mistake, and no undo but
`rm -rf generated-framework/`. So every phase below checks before it spends.

---

## Phase 0 — is the draft approved?

```bash
npm run draft
```

Re-rendering is free and it is the check: `draft.ts` writes `framework-draft.md` from the
current `analysis.json`, and `.framework-draft.lock` holds the SHA-256 of what the human
approved. Then read the lock and compare:

```bash
cat .framework-draft.lock
```

Three outcomes, and each gets a different answer — do not collapse them into "not ready":

- **No lock file.** Nobody has approved anything. Tell the user the draft is at
  `framework-draft.md`, say what it contains (page objects, components, API resources,
  and a testability score per screen), and ask them to read it and run
  `npm run draft -- --approve`. **Stop.**
- **Lock exists but its `hash` does not match the re-rendered draft.** The analysis
  changed after approval — someone recompiled, or ingested a recording. The approval has
  expired *by design*. Say so plainly: what they approved is not what would be built.
  Ask them to re-read and re-approve. **Stop.**
- **Hash matches.** Proceed, and say so: "draft approved, lock matches".

**Never run `npm run draft -- --approve` on the user's behalf.** Approving is the one act
this whole gate exists to require of a human. If you find yourself reasoning that the
draft looks fine so approving it is safe, that is the failure the gate was built to stop.

## Phase 1 — is there already a framework?

```bash
ls generated-framework 2>/dev/null
```

Anything there besides `node_modules/`, `test-results/`, `playwright-report/` and
`.auth/` means a framework already exists. `npm run generate` will refuse, and it is
right to — that directory is somebody's work and nothing here can merge into it.

Check it now rather than after a two-minute install. Tell the user what is there and that
the only way past is removing the directory. **Do not remove it yourself**; that is their
call, and it is not recoverable except from git.

## Phase 2 — generate

```bash
npm run generate
```

Report the file count it prints. Expect roughly one file per screen, one per component,
and one per API resource — for a mid-sized app that is a few hundred.

If it refuses here despite Phases 0 and 1 passing, read the message rather than retrying:
both gates print exactly what is wrong and the command that fixes it.

## Phase 3 — install

Warn first: this is the slow part, a few minutes, and it needs the network.

```bash
cd generated-framework
npm install
npx playwright install chromium
```

## Phase 4 — typecheck

```bash
npx tsc --noEmit
```

**A failure here is a generator bug, not a project bug.** The emitted code was written
from `analysis.json` by `scripts/framework-generator/`, and nothing regenerates it — so a
hand-patch to the output is a fix that the next application will not get, and that the
next reader cannot trace to anything.

Fix it in the generator, then `rm -rf generated-framework` and start again from Phase 2.
Say that to the user rather than quietly editing the output.

## Phase 5 — smoke

`emit()` creates `tests/e2e/` and puts nothing in it — a freshly generated framework has
no specs. Running Playwright against zero tests exits non-zero ("no tests found"), which
is expected here, not a failure to chase.

The honest smoke check at this point is narrower: confirm Playwright itself starts and
the project is wired correctly.

```bash
npx playwright test --project=chromium --list
```

A clean "no tests found" with no config or fixture error means the scaffold compiles and
Playwright can load it. A config error, a fixture that throws, or an import that fails to
resolve — that is a real framework defect, and Phase 5 is where it is caught before a spec
ever exists to surface it.

The first real evidence — an actual browser run, `test-results/framework.log.jsonl`
populated, components proving or failing to prove their locators — comes once a spec
exists. That is `test-writer`'s job, not this skill's. Once a spec has run, the log is
worth reading the same way:

```bash
head -20 test-results/framework.log.jsonl
```

- how many interactions were logged, and how many carry `"outcome":"ok"`;
- any record whose `strategy` is `proximity` — those controls are addressed by walking
  the DOM from a label the app never associated, which works and is worth knowing about
  early, because it is the first thing to break when the markup moves;
- any `outcome` that is not `ok`, with its component and screen. The classification
  (`NOT_FOUND`, `AMBIGUOUS`, `HIDDEN`, `DISABLED`, `COVERED`, `DETACHED`, `TIMED_OUT`)
  has already done the diagnosis — read it before the stack trace.

A failing spec against a live application is not automatically a framework defect. Say
which it looks like: a locator that resolves to nothing is the framework; a login that
times out is the environment.

## Phase 6 — hand off

Tell the user what they have: how many page objects, how many screens scored ≥ 0.7 in the
draft (those are the ones worth writing tests against today), and where the log lives.

Test authoring is not this skill's job. A pasted numbered test script goes to
`test-preconditions` → `test-writer` → `test-runner`. Say so and stop.

---

## Rules

- **Approval is the user's, always.** This skill verifies the lock; it never writes one.
- **Never pass `--force`.** It skips the draft/approval gate and exists for CI, where
  there is no human to approve a draft. Using it to get past an unapproved draft is
  exactly what the gate exists to prevent.
- **Never edit anything under `generated-framework/` to make a phase pass.** The fix is
  upstream, in the generator or in the analysis. The output is not a draft you correct.
- **Never remove `generated-framework/` without being asked.** It is not recoverable
  except from git, and it may hold weeks of hand-written tests.
- **Never hand-edit `analysis.json`.** A skill writes its section through
  `scripts/analysis/write-section.ts`.
- **`playwright-cli` is the only thing that drives a browser here.** The Playwright MCP
  tools are blocked by a hook.
- If a phase fails for a reason Phase 0 or 1 could have caught, that is a gap in this
  skill — say so, so the check can be added.
