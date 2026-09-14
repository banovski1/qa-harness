# framework-generator

`analysis.json` in, a Playwright project out — once. Nothing here reads the application,
the crawl or the repo: every decision was made by `scripts/model-compiler/compile-model.ts`.

```bash
npm run draft              # render framework-draft.md from the current analysis
npm run draft -- --approve # record that a human read it (writes .framework-draft.lock)
npm run generate           # build generated-framework/ from the approved draft
npm run generate -- --dry-run
```

## Draft, approve, generate

The generator runs once, into a directory that starts empty. There is no second run to
merge into, so what a human approves has to be exactly what gets built:

- `emit/draft.ts` renders `framework-draft.md` (via `emit/draft-render.ts`) from the same
  model `emit.ts` would build, and `emit/plan.ts` is the list of files it plans to write —
  the draft shows it, `emit.ts` walks it. `--approve` hashes the rendered markdown into
  `.framework-draft.lock`.
- `emit/gates.ts` is the second refusal (the first is `assertOutputEmpty` below): before
  writing anything, `emit.ts` checks that the draft on disk, the lock's hash of it, and the
  draft the current analysis would produce all agree. Any disagreement — a re-run of a
  skill, a newer commit, a hand-edited draft — means the human approved something other
  than what is about to be built, and generation refuses.
- `--force` skips both gates and generates unapproved. It exists for CI, where there is no
  human in the loop to approve a draft; using it to get past an unapproved draft anywhere
  else is exactly what the gate exists to prevent.

## Write policy

`file-writer.ts` is the whole write policy, and it is one rule: `assertOutputEmpty`
refuses to write into `generated-framework/` if anything is already there (past the run
output every test leaves behind — `node_modules`, `test-results`, `playwright-report`,
`.auth`, `.git`). A framework that exists is someone's work, and nothing here is clever
enough to merge into it. To regenerate from scratch, remove the directory first — there is
no generated/protected split to preserve across runs any more, because there is no second
run.

## What gets emitted

- `emit/pages.ts` — one class per screen, `src/pages/<module>/<Name>.ts`, extending
  `BasePage`. The generator-derived getters and the footer comment ("Everything above came
  from the analysis. Everything below is yours") are emitted together in the same file;
  there is no `.generated.ts` companion.
- `emit/components.ts` — the region and field component classes mapped by the compiler.
- `emit/api.ts` — one file per API resource (`src/api/<Name>Api.ts`), an aggregate
  (`src/api/Api.ts`), and the precondition helpers (`src/api/Preconditions.ts`).
- `emit/project.ts` — the Playwright project scaffold: config, fixtures, `auth.setup.ts`.
- `emit/naming.ts` — the shared vocabulary every renderer uses: how a name becomes a class,
  a property, a folder, and the provenance header stamped on every emitted file.
- `emit/runtime/` is copied verbatim into `<output>/src/`. It is ordinary reviewable
  TypeScript — `BaseComponent` and its diagnostics, `BasePage`, `uniqueName`, and one class
  per control kind under `emit/runtime/components/` (`TextField.ts`, `Select.ts`,
  `RecordTable.ts`, …). Edit it here, not in the output — a regeneration only happens
  against an empty directory, so there is nothing to overwrite it, but the source of truth
  is still here.

Adding a control kind means adding a class under `emit/runtime/components/` and a case in
`fieldComponentFor()` in the compiler. Nothing else branches on kind.

## Tests

```bash
npm test --prefix scripts/framework-generator        # __tests__/*.test.ts
npm run typecheck --prefix scripts/framework-generator
```
