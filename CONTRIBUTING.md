# Contributing

Thanks for being here. Three things to know before you open a pull request.

### 1. Sign the CLA

A bot asks once, on your first PR. [`CLA.md`](CLA.md) says what it is and why it
exists — short version: you keep your copyright, the project keeps a single
relicensable IP chain.

### 2. `master` is protected

You cannot push to it, and neither can the maintainer. Everything lands through a
pull request that is reviewed and green. Branch from `master`, name it after what
it does (`fix/ambiguous-locator-report`), open the PR.

### 3. The pipeline has a test suite, and it is the review

```bash
npm install
npm run setup             # the generator's own toolchain
npm run pipeline:test     # the compiler and analysis suites
npm run pipeline:typecheck
npm run hooks:test        # the write-guard rule set
```

All four run in CI on every PR. A change to `scripts/model-compiler/` without a
fixture is not finished.

---

## What a good change looks like

**The compiler is pure and snapshot-tested.** `compile-model.ts` takes
`analysis.json` and returns `analysis.json`. It reads no network, no clock, no
environment. Keep it that way — the snapshots are the only reason a generator
change can be trusted.

**A generator change validated against one application has not been validated.**
The corpus in `CLAUDE.md` lists four apps and the problem each one proved. Make
worktrees (`npm run app:worktree -- <slug>`), regenerate in each, compare. Say in
the PR which apps you checked.

**Locators live in exactly one layer.** If your change puts a CSS selector
anywhere outside a component class, `assertNoSelectors` will fail and it is right.

**The write hooks apply to you too.** `.claude/hooks/rules/` rejects writes that
break the repo's rules, with the fix named in the rejection. Adding a rule means
adding a fixture in `.claude/hooks/__fixtures__/`.

**Claude is the source; Codex and OpenCode are generated.** Edit `CLAUDE.md` and
`.claude/`, then:

```bash
npm run codex:sync && npm run opencode:sync
npm run codex:check && npm run opencode:check
```

CI fails if the generated trees drift from their source.

## What not to send

- Hand-edits to `analysis.json`. It is produced. Fix the skill that wrote it.
- Hand-edits to `recordings/`. They are evidence of what happened.
- A real credential in `.env.example`, a recording, or a fixture. `.env` is
  gitignored; keep it that way.
- Playwright MCP tooling. `playwright-cli` is the only thing that drives a browser
  here, and `CLAUDE.md` explains why there is no exception.

## Reporting things

- A bug: the issue template asks for `npm run preflight` output and the relevant
  lines of `test-results/framework.log.jsonl`. Those two answer most questions.
- A vulnerability: privately. See [`SECURITY.md`](SECURITY.md).

## Licence

By contributing you agree your work is licensed under Apache-2.0 (see
[`LICENSE`](LICENSE)) and covered by [`CLA.md`](CLA.md).
