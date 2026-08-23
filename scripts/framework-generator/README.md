# framework-generator

Application map in, Playwright test framework out.

The `smart-map` skill walks an app and writes `ui-map-results/application-map/*.yaml`.
This tool reads those files and generates a **component object model** framework:
a reusable component library, one page object per mapped page, Playwright
fixtures, a login flow, and smoke specs.

Everything is deterministic — no model in the loop, no network access at
generation time. The same map always produces the same framework.

## Install (one-time)

```bash
cd scripts/framework-generator
npm install
```

## Run

From the **repo root** (so `mapDir` and `outputDir` resolve):

```bash
node scripts/framework-generator/generate.mjs                     # generate
node scripts/framework-generator/generate.mjs --dry-run           # show the file plan, write nothing
node scripts/framework-generator/generate.mjs path/to/config.yaml # a different config
```

## Config (`generator-config.yaml`)

```yaml
language: typescript          # typescript | javascript | java | python | csharp
projectName: orangehrm-e2e
outputDir: ./generated-framework
baseUrl: https://opensource-demo.orangehrmlive.com
mapDir: ui-map-results/application-map
loginConfig: scripts/app-config.yaml   # optional, see below

pages:
  folderSegment: auto         # see below; or a 1-based segment number
  dropParamSegments: true     # drop trailing /empNumber/7 pairs from page identity
  mergeDuplicates: true       # collapse *Module redirect pages onto their list-page twin

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

`loginConfig` points at `scripts/app-config.yaml`. The login flow is not in the
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
`languages/<lang>.mjs`. The orchestrator does not change — it never branches on
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
generate.mjs      orchestration + config validation; never branches on language
map-reader.mjs    YAML -> normalized model; owns every quirk of the map format
naming.mjs        identifier and class-name derivation (pure functions)
code-writer.mjs   indent-aware string builder
file-writer.mjs   the generated/protected write policy
languages/        one adapter per language, registered in index.mjs
```

`map-reader.mjs` is where the input's rough edges are absorbed, so no language
adapter has to know about them:

- elements with no locator are skipped (synthetic dropdown containers),
- table columns come from the structured `columns:`/`rowCount:` keys, with the
  prose `comment:` form kept as a fallback for older files,
- chrome repeated on nearly every page is lifted into one `NavigationBar`
  component instead of being regenerated per page,
- `*Module` URLs that redirect onto a list page are merged into one page object
  with the extra URL kept as an alias,
- names that start with a digit or collide with a keyword are made safe per
  target language,
- the folder-grouping segment is detected from the mapped URLs, so pointing the
  generator at a different app needs no tuning.

## Limitations

- Locators are only as good as the map. Positional (`nth`) locators are emitted
  with an `// UNSTABLE` comment and listed in the generated `GENERATION-REPORT.md`.
  They are all left over from the deleted crawler; re-walking a module with the
  `smart-map` skill replaces them with label-scoped `css` locators.
- The map is a snapshot. If the app changed since it was walked, re-walk the module
  first — the generator cannot know a locator has gone stale.
- A page whose `url:` contains an `{id}` placeholder gets a smoke spec that cannot
  navigate, because `goto()` uses the literal path. Those specs fail until the
  generator learns to skip or parameterise them.
- No API-client generation: the map describes the UI only.
