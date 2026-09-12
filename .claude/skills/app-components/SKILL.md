---
name: app-components
description: Read a local clone of the app under test and write down its component conventions — the UI library, how labels attach to controls, what a form/table/dialog looks like in this codebase. Use for "what components does the app use", "how are labels wired", "regenerate components.json". Runs after app-dossier.
---

# app-components

You are recording **conventions, not an inventory**. The list of elements on a screen
comes from the crawl (`app-explorer`), which can prove a locator resolves to one element;
source cannot. What source knows, and the crawl does not, is *how this codebase is built* —
and that is what decides how the generated page objects should address it.

Inputs: `analysis/<app>/app-profile.yaml`, `dossier.json`. Output:
`analysis/<app>/components.json` + `.md`.

## What to find out

**1. The UI library.** Read the frontend manifest's dependencies. Vuetify, PrimeVue,
Material, Ant, Bootstrap, shadcn/Radix, a bespoke design system, or none. Name it and
its version. This predicts the DOM the crawl will meet, which is the point.

**2. How a label attaches to its input.** This is the single most valuable fact in the
file. Read two or three real form templates and determine which holds:

- `<label for="id">` — associated. `getByLabel` works. Best case.
- `aria-label` / `aria-labelledby` — associated. `getByLabel` works.
- Label and input are siblings inside a wrapper, with no `for` — **unassociated**.
  `getByLabel` fails. Record the wrapper's class, because a label-anchored CSS selector
  through that wrapper is the fallback the generator needs.
- The label is a floating placeholder, or is rendered by the library out of the
  component's own source — say so, and say where it comes from.

**3. The shape of the repeated regions.** Find, by reading the templates, what the app's
form, data table, modal, toast/flash message, and navigation look like: the wrapper
class or component name, and how a row/cell/field is marked. The crawl will find these
regions on rendered pages; this tells the compiler what to call them and which class
belongs to which.

**4. Naming.** How components are named and filed (`PascalCase.vue` under `components/`,
`views/<entity>/<action>.js`, co-located `index.tsx`). This is how a route's component
reference is resolved to a file, and how generated class names can echo the app's own
vocabulary instead of inventing one.

**5. Anything hostile to testing.** Shadow DOM, canvas-rendered grids, iframes,
virtualised lists that render only visible rows, animations without a settled state,
`id`s that change per render. Each of these breaks a different assumption downstream,
and each is cheap to spot in source and expensive to discover in a failing test.

## Output

```jsonc
{ "app": "orangehrm", "generatedAt": "...",
  "library": { "name": "oxd (bespoke)", "version": "...", "source": "package.json" },
  "labelAssociation": { "kind": "unassociated-sibling",
                        "wrapper": ".oxd-input-group",
                        "template": ".oxd-input-group:has(label:text-is(\"{label}\")) input",
                        "evidence": "src/components/Input.vue:12" },
  "regions": [ { "name": "RecordTable", "selector": ".oxd-table", "row": ".oxd-table-row",
                 "cell": ".oxd-table-cell", "evidence": "..." },
               { "name": "Toast", "selector": ".oxd-toast", "evidence": "..." } ],
  "naming": { "pattern": "PascalCase.vue", "root": "src/components" },
  "hazards": [ { "kind": "virtualised-list", "where": "...", "impact": "..." } ],
  "notes": [] }
```

`template` uses `{label}` as the placeholder and is emitted once into the generated
framework's component layer — it is one of the very few places an app-specific selector
is allowed to exist, and it never reaches a page object.

## Rules

- **Cite a real file for every convention.** `evidence` is not optional; a convention you
  inferred from the framework's documentation rather than from this app's source is a
  guess, and belongs in `notes` labelled as one.
- **Do not enumerate components.** A 1,485-row list of every file is what the previous
  analyzer produced, and nothing consumed it. Three well-evidenced conventions beat it.
- **An app with no convention is a finding.** Say `"kind": "mixed"` and give two examples.
