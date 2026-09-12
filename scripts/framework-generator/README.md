# framework-generator

`app-model.json` in, a Playwright project out. Nothing here reads the application, the crawl or the
repo: every decision was made by `scripts/model-compiler/compile-model.ts`.

```bash
npx tsx scripts/framework-generator/emit/emit.ts --app <app> [--dry-run]
```

- `emit/emit.ts` renders page objects, region components and the project scaffold.
- `emit/runtime/` is copied verbatim into `<output>/src/`. It is ordinary reviewable TypeScript —
  `BaseComponent` and its diagnostics, the field classes, `RecordTable`, `BasePage`, `uniqueName`.
  Edit it here; it is overwritten in the output on every run.
- `file-writer.ts` is the generated/protected policy. Nothing is ever deleted, so delete the
  output's `src/` before a regeneration that renames classes.

Adding a control kind means adding a class in `emit/runtime/components/fields.ts` and a case in
`fieldComponentFor()` in the compiler. Nothing else branches on kind.
