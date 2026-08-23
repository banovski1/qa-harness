---
name: smart-map
description: Build the application map by walking the app in a real browser with playwright-cli, one module at a time. Use for "map the app", "map the PIM module", "application map", "regenerate ui-map-results", "component inventory", "improve the locators for <module>".
---

This skill is the only thing that builds `ui-map-results/application-map/`. There is no crawler — you
drive the app yourself, decide which controls matter, verify every locator resolves, and write one file
per screen. Each file carries two halves: `elements:` (the strict schema the framework generator reads)
and `actions:` (what the controls actually do, which the generator ignores and `test-writer` reads).

Work one module at a time. A module is a normal session; the whole app is not.

## 1. Set up the session

Read `scripts/app-config.yaml` for `baseUrl`, `login.*`, `credentials.*`, `denyClickNames` and
`idSegmentPattern`.

If `.playwright-cli/smartmap-auth.json` exists, reuse it:

```bash
playwright-cli -s=smartmap state-load .playwright-cli/smartmap-auth.json
playwright-cli -s=smartmap open <baseUrl>
```

Otherwise log in and save the state:

```bash
playwright-cli -s=smartmap open <baseUrl><login.loginUrl>
playwright-cli -s=smartmap fill 'getByRole("textbox", { name: "Username" })' "<username>"
playwright-cli -s=smartmap fill 'getByRole("textbox", { name: "Password" })' "<password>"
playwright-cli -s=smartmap click 'getByRole("button", { name: "Login" })'
playwright-cli -s=smartmap state-save .playwright-cli/smartmap-auth.json
```

Confirm `login.successSignal` is present. A saved state often expires — if a screen comes back as the
login form, log in again and re-save. Do not mistake that for a bad URL.

Which screens to walk, in order of preference:

1. Paths the user named.
2. The `url:` values in the existing `application-map/web-index.php-<module>-*.yaml` files.
3. The module's own links: open its top-bar entry, snapshot, harvest same-origin targets. Show the
   resolved list and confirm it before walking — this source guesses.

A screen with no existing file is fine and expected; that is new coverage.

## 2. Walk each screen

```bash
playwright-cli -s=smartmap goto <baseUrl><path>
playwright-cli -s=smartmap snapshot --filename=.playwright-cli/<slug>.yml
```

`Read` the snapshot file. Never let a full snapshot into the conversation — a list screen on this app
runs to ~1000 lines. At that size take `snapshot --depth=6` for the shape, then `find "<text>"` or
`snapshot <ref>` to drill in.

Then exercise it. Click every tab, dropdown, expander, "Add", filter toggle and row action; record what
appears; reset with `press Escape` or `reload`. Fill forms with obvious throwaway data. Where submitting
is the only way to learn the rules, submit the form **empty** and record the validation messages.

Never click a control whose label contains a `denyClickNames` word — delete, save, submit, remove,
logout, sign out, trash, terminate, reset. Read those off the DOM and record them as
`kind: destructive` with `notExercised: true`.

## 3. Harvest and verify in batches

One `run-code` call per screen for attributes, one for verification. Run them through the **Bash** tool
with outer single quotes — PowerShell 5.1 mangles inline nested quotes.

Harvest the whole screen's structure at once rather than one `eval` per element:

```bash
playwright-cli -s=smartmap --raw run-code 'async page => await page.evaluate(() =>
  [...document.querySelectorAll(".oxd-input-group")].map(el => {
    const l = el.querySelector("label");
    return ((l && l.innerText.trim()) || "?") + "::" +
      [...el.querySelectorAll("input,.oxd-select-text,textarea")].map(c => c.type || c.tagName).join(",");
  }))'
```

Then verify every candidate locator in one call. **A locator is only usable at `count === 1`:**

```bash
playwright-cli -s=smartmap --raw run-code 'async page => {
  const g = (l) => `.oxd-input-group:has(label:text-is("${l}"))`;
  return {
    city: await page.locator(g("City") + " input").count(),
    country: await page.locator(g("Country") + " .oxd-select-text").count(),
    save: await page.getByRole("button", { name: "Save", exact: true }).count()
  };
}'
```

Anything returning 0 or >1 needs a better locator before it goes in the file.

### Locator ladder

1. Named role: `{ strategy: getByRole, args: ["button"], name: "Search" }`.
2. `getByPlaceholder` / `getByLabel` / `getByTestId` where a real one exists.
3. **`template` + label** — for the label-scoped patterns this app repeats on every form.
   `locatorTemplates:` in `scripts/framework-generator/generator-config.yaml` holds the selector; the
   map names the template and the label, and the generator expands one into the other:

   | template | expands to | use for |
   |---|---|---|
   | `labelledInput` | `.oxd-input-group:has(label:text-is("{label}")) input` | a text field |
   | `labelledTextarea` | the same, ending `textarea` | a multi-line field |
   | `labelledSelect` | the same, ending `.oxd-select-text` | a dropdown trigger |
   | `topNavTab` | `.oxd-topbar-body-nav-tab > a:text-is("{label}")` | a module's top-bar tab |
   | `tableByColumn` | `.oxd-table:has(.oxd-table-th:text-is("{label}"))` | a table keyed by a column |

   ```yaml
   locator: { strategy: template, args: ["labelledInput"], name: "City" }
   ```

   Prefer this over rung 4 whenever the pattern fits: it is shorter to write, impossible to mistype
   into a *nearly* correct selector, and it survives a redesign of the wrapper as a config edit.
   **Verify it exactly as you would a raw selector** — expand the template yourself and count, since
   the template guarantees the shape but not that the label is unique on the screen.
4. **`css` scoped by label text** — for a control the templates do not cover, because the visible
   label is an unassociated sibling `<label>` and `getByLabel()` therefore fails:
   `.oxd-input-group:has(label:text-is("City")) input`, or ` .oxd-select-text` for a dropdown.
5. **`css` scoped by section heading**, for a control that repeats per section:
   `.orangehrm-horizontal-padding:has(h6:text-is("Work Experience")) button` — on Qualifications the
   unscoped `Add` matches 6 buttons and each scoped one matches 1.
6. `within:` chained off a named ancestor.
7. Positional `nth:` — last resort only, and it must carry `unstable: true` with a reason.

Use **double** quotes inside a css selector. `code-writer.mjs quote()` emits single-quoted TypeScript,
so double quotes inside pass through safely; a literal apostrophe gets escaped for you.

## 4. Write one file per screen

Path: `ui-map-results/application-map/<slug>.yaml`, where `<slug>` is the canonical URL split on `#`
then `/`, braces stripped, empties dropped, joined with `-`. It must match the existing filename so a
remap overwrites rather than duplicates.

```yaml
page: web-index.php-pim-contactDetails-empNumber-id
url: /web/index.php/pim/contactDetails/empNumber/{id}
title: "OrangeHRM"
elements:
  # --- shared chrome: pasted verbatim, never re-located (see the chrome rule below) ---
  - name: clientBrandBannerLink
    component: link
    locator: { strategy: getByRole, args: ["link"], name: "client brand banner" }
    comment: "client brand banner (link)"
  # --- this screen ---
  - name: cityInput
    component: input
    locator: { strategy: template, args: ["labelledInput"], name: "City" }
    comment: "City (input)"
  - name: countryDropdown
    component: dropdown
    locator: { strategy: template, args: ["labelledSelect"], name: "Country" }
    comment: "Country (dropdown)"
  - name: employeePhotoInput
    component: input
    locator: { strategy: css, args: ["input[type=\"file\"]"] }
    comment: "Employee photo file (input)"
actions:
  - do: Edit contact details
    kind: form
    fields:
      - { label: City, locator: '.oxd-input-group:has(label:text-is("City")) input', type: text }
    submit: 'getByRole("button", { name: "Save" })'
    effect: Saves in place with a success toast. No navigation.
```

Every rule below exists because the generator depends on it:

- **`url:`** canonical: leading `/`, no host, no query string, numeric segments collapsed to `{id}` per
  `idSegmentPattern`. A non-canonical URL shifts the shared prefix every other URL agrees on and
  **renames every generated file in the project**. This is the worst mistake available here.
- **`page:`** equals the filename slug.
- **`component:`** from this closed set only — `button link input longInput checkbox switch radio tab
  menuItem text image table dropdown`. Anything else silently degrades to `GenericComponent`.
- **`locator:`** from the closed vocabulary — `getByRole getByLabel getByPlaceholder getByText
  getByAltText getByTitle getByTestId css template` — shaped
  `{ strategy, args, name?, nth?, within?, unstable?, unstableReason? }`. See
  `scripts/framework-generator/locator-spec.mjs`. For `template`, `args[0]` is the template id and
  `name:` is the label substituted into it; an unknown id is a hard error, not a silent drop.
- **`comment:`** always the last key, always `"<label> (<component>)"`. The generator strips exactly
  `" (<component>)"` to recover the label; any other shape makes the whole string the label.
- **`name:`** camelCase label plus a component suffix, unique within the file — append `2`, `3`, … on a
  collision. Suffixes: `input→Input`, `longInput→TextArea`, `button→Button`, `link→Link`,
  `checkbox→Checkbox`, `radio→Radio`, `switch→Switch`, `dropdown→Dropdown`, `tab→Tab`, `image→Image`,
  `table→Table`, `text→Heading`, `menuItem→MenuItem`.
- **Tables** carry `columns: [- name: "…"]` and `rowCount:` before the comment.
- An element you cannot locate uniquely is **left out**. Do not write a locator-less entry — it is
  dropped silently and the gate will flag the file.

### What to include, and what to leave out

Include the controls a test would drive: inputs, dropdowns, buttons, tabs, the table, and the screen's
own heading. Aim for roughly 25 elements on a busy screen.

Leave out decoration and repetition. Specifically **never** emit:

- per-row controls of table data — `elementCheckbox1..8`, `elementButton4..16` and friends. They are
  positional, and they break the moment the seed data changes. Record the row action once, as an
  `actions:` entry with a `filter`-based target.
- dropdown option values read out of the live database. Those are someone's test data, not UI.
- unnamed decorative images and spacer nodes.

### The chrome rule — the one that bites

The generator lifts elements that appear on ≥80% of map files into a single shared `NavigationBar`,
keyed on the exact locator. Today that is **20 elements**, and 19 of them appear on 30 of 32 files, so
**the margin is 4 files**. Verified: altering one nav locator in 5 files drops the shared set to 19 and
that nav element re-inlines into every page object.

**So paste the chrome block verbatim from the file you are replacing, and never re-locate it.** Copy the
leading nav entries exactly — same `name`, `component`, `locator` and `comment`. Improving a nav locator
is the specific act that breaks this. For a brand-new screen with no predecessor, copy the block from
any sibling file in the same module.

## 5. Close the session

In order, from the repo root:

```bash
node scripts/framework-generator/check-map.mjs --strict <slug> [<slug>...]
node scripts/framework-generator/inventory.mjs
node scripts/framework-generator/generate.mjs --dry-run
```

`check-map.mjs` must pass. Pass every slug you wrote to `--strict` so a mistake in your files is a
failure rather than a warning. If it reports shared navigation as anything other than 20, you broke the
chrome rule — fix it before going further.

Then `playwright-cli -s=smartmap close` and report:

- screens written, with element and action counts per screen;
- unstable locator count before and after, from the two `--dry-run` reports;
- **shared navigation elements — must still be 20**;
- destructive actions recorded but not performed;
- any screen that failed to load, and any locator left `unstable: true`.

## Rules

- Never use the Playwright MCP (`mcp__playwright__*`). `playwright-cli` is the browser lane.
- Never perform a destructive action, even to see what it does. Record it and move on.
- Never write a locator you have not seen return `count === 1`, unless you mark it `unstable: true`.
- Never re-locate a shared chrome element.
- Never hand-edit `generated-framework/**` — run the generator instead.
