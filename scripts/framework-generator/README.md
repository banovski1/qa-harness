# framework-generator

Static analysis in, Playwright test framework out.

`scripts/repo-analyzer/` reads a local clone of the app under test and writes `analysis/`.
This tool reads those reports and generates a **component object model** framework:
a reusable component library, one page object per route, Playwright fixtures, a login
flow, and smoke specs.

Everything is deterministic — no model in the loop, no browser, no network access at
generation time. The same analysis always produces the same framework.

## Install (one-time)

```bash
npm ci --prefix scripts/framework-generator
```

## Run

From the **repo root** (so `analysisDir` and `outputDir` resolve):

```bash
npm run generate --prefix scripts/framework-generator                     # generate
npm run generate:dry --prefix scripts/framework-generator           # show the file plan, write nothing
npm run generate --prefix scripts/framework-generator -- path/to/config.yaml # a different config
```

## Verify

```bash
npm test --prefix scripts/framework-generator
npm run typecheck --prefix scripts/framework-generator
npm run check-analysis --prefix scripts/framework-generator
npm run generate:dry --prefix scripts/framework-generator
```

Run the gate and dry run after `npm run analyze` refreshes the configured application's reports.

## Config (`generator-config.yaml`)

The app clone path and test base URL live in root `app-config.yaml`:

```yaml
appPath: ~/Projects/espocrm
baseUrl: http://localhost:8080
```

```yaml
language: typescript          # typescript | javascript | java | python | csharp
projectName: e2e
outputDir: ./generated-framework
analysisDir: analysis
loginConfig: app-config.yaml   # optional, see below

pages:
  folderSegment: auto         # see below; or a 1-based segment number
  mergeDuplicates: true       # routes rendering the same component are one screen: the
                              # shortest URL is the page, every other mount an alias

elements:
  sharedChromeThreshold: 0.8  # elements on >= 80% of pages become a shared nav component
  includeUnstable: true       # emit positional locators, annotated with why they are brittle
  includeStates: true         # emit state elements (menus, dropdown options)

waits:
  spinnerSelector: '[role="progressbar"], [aria-busy="true"]'

tests:
  generateSmokeSpecs: true

locatorTemplates:             # label -> selector patterns; see below
  labelledInput: '.oxd-input-group:has(label:text-is("{label}")) input'
```

`folderSegment: auto` works out which URL segment names the app's module by
stripping the prefix every mapped URL shares, and logs what it picked:

| Mapped URLs | Detected | Folders |
|---|---|---|
| `/users/list`, `/orders/list` | 1 | `users/`, `orders/` |
| `/web/index.php/admin/viewSystemUsers`, `/web/index.php/pim/…` | 3 | `admin/`, `pim/` |
| `/app/v2/billing/invoices`, `/app/v2/settings/profile` | 3 | `billing/`, `settings/` |

At least one segment is always left for the action, so a flat app (`/users`,
`/orders`) still groups by those rather than collapsing into one folder. Set a
number instead if you want different grouping.

`waits.spinnerSelector` feeds the generated `waitForSpinnerToClear()` helper. The
default is role-based and works on any accessible app; add your own class if your
app renders a spinner with no busy state.

A map file names a template instead of repeating the selector:

```yaml
locator: { strategy: template, args: ["labelledInput"], name: "City" }
```

`fromMap` expands that into the plain `css` spec at read time, so `resolve()`, the
other language adapters and every other consumer only ever see a selector they
already understand. An unknown template id or a missing `name:` is a hard error, not
a silent drop.

The analyzer emits these directly: an element whose label it resolved but whose markup
associates no `<label for>` lands on rung 4 of the locator ladder
(`locator-ladder.ts`), which is exactly a `template` locator. Nothing has to convert
them after the fact.

`locatorTemplates` answers "how does this app connect a visible label to its
control". Each entry is a selector with a `{label}` placeholder, and the generator
emits it once into `src/components/locator-templates.generated.ts` — the only file
in the output that names an app-specific selector. A page-object accessor whose
mapped locator the template reproduces **exactly** is then emitted as a component
factory carrying just the label:

```ts
get employeeNameInput(): InputComponent { return InputComponent.byLabel(this.page, 'Employee Name'); }
```

The equivalence is checked per element, so a genuine one-off keeps the locator the
mapper verified rather than being bent to fit a pattern. That makes the block safe
to add or edit wholesale: a template that stops matching degrades to the previous
output instead of silently addressing a different element, and
`GENERATION-REPORT.md` counts how many accessors took each path — a drop there is
the signal that a template needs updating. Known ids are `labelledInput`,
`labelledTextarea`, `labelledSelect`, `topNavTab` and `tableByColumn`; an app whose
labels are properly associated with their controls needs none of them, because
`getByLabel` already works.

`loginConfig` points at a YAML file with a `login:` block. The login flow is not in the
application map — the mapping skill logs in before it starts walking — so reading
the locators from there is what lets the generator emit a working login helper
instead of a stub. Credentials are never read from it; they come from
`APP_USERNAME` / `APP_PASSWORD` in the generated project's `.env`.

## Language support

| Language | Folder tree + project file + base classes | Page objects from the map |
|---|---|---|
| TypeScript | yes | **yes** |
| JavaScript | yes | not yet |
| Java | yes | not yet |
| Python | yes | not yet |
| C# | yes | not yet |

Adding page objects for another language means implementing `renderPage` in
`languages/<lang>.ts`. The orchestrator does not change — it never branches on
the language.

## Regenerating is safe

Every emitted file is either **generated** or **protected**:

- `<Name>Page.generated.ts` holds the mapped elements and is **overwritten on
  every run**, so a fresh mapping session always updates your locators.
- `<Name>Page.ts` holds your actions and assertions and is **written once, then
  never touched again**.

Nothing is ever deleted. Re-run after every mapping session.

## How it works

```
generate.ts         orchestration + config validation; never branches on language
analysis-reader.ts  JSON reports -> normalized model
page-model.ts       URL grouping, aliases, and shared page-model rules
naming.ts           identifier and class-name derivation (pure functions)
code-writer.ts      indent-aware string builder
file-writer.ts      the generated/protected write policy
languages/          one adapter per language, registered in index.ts
```

`analysis-reader.ts` and `page-model.ts` absorb the input's rough edges, so no language
adapter has to know about them:

- elements with no locator are skipped (synthetic dropdown containers),
- table columns come from the structured `columns:`/`rowCount:` keys, with the
  prose `comment:` form kept as a fallback for older files,
- chrome repeated on nearly every page is lifted into one `NavigationBar`
  component instead of being regenerated per page,
- routes that render the same component are one page object — the shortest URL
  is canonical and every other mount an alias, so a screen the router exposes
  at eight paths is one class, not eight,
- a class is named from its path's trailing segments and extends toward the
  root only while two pages collide (`KyeAssignmentsPage` / `KytpAssignmentsPage`),
  so no page ever comes back as `SomethingPage22`,
- `{id}`-style parameter segments are dropped from page identity, whatever the
  parameter is called,
- names that start with a digit or collide with a keyword are made safe per
  target language,
- the folder-grouping segment is detected from the mapped URLs, so pointing the
  generator at a different app needs no tuning.

## Limitations

- **Nothing here proves a locator resolves to exactly one element.** That is the cost of
  dropping the browser from this half of the pipeline. Where two controls on a page share
  a label, both getters are emitted with an `// UNSTABLE` comment and tallied in
  `GENERATION-REPORT.md`; the fix is a scoped accessor in the protected page object, and a
  `playwright-codegen` recording is how you see which control is which.
- The analysis is a snapshot of a commit. `check-analysis.ts` fails when it no longer
  matches the clone's `HEAD`, because a stale analysis generates a framework for an app
  that has moved on.
- Elements no template describes are invisible here: a control labelled only by adjacent
  copy, or rendered by an external design-system package, appears in no page object. The
  navigation bar is the standing example — it is declared in `navigation:` rather than
  derived.
- A page whose `url:` contains an `{id}` placeholder gets a smoke spec that cannot
  navigate, because `goto()` uses the literal path. Those specs fail until the
  generator learns to skip or parameterise them.
- No API-client generation: the map describes the UI only.
