---
name: app-dossier
description: Read a local clone of the app under test and write down its stack and every route its source declares. Use for "what stack is this app", "list the app's routes", "regenerate the dossier", "analyse this repo". Runs first — the other analysis skills read its output.
---

# app-dossier

You are reading a clone of an application you have never seen, to answer two questions:
**what is this built with**, and **what screens does its source declare**. No browser, no
install, no build. Read files.

Inputs: `analysis/<app>/app-profile.yaml` — `repoPath` and `baseUrl` are the only fields
you need. Outputs: `analysis/<app>/dossier.json` and `routes.json`

## 0. Read what the app already wrote about itself

Do this before any grep. A repo often documents its own conventions, and those documents
answer this skill's questions directly and correctly:

`AGENTS.md`, `CLAUDE.md`, `.agents/`, `.cursor/rules/`, `.github/copilot-instructions.md`,
`CONTRIBUTING.md`, `ARCHITECTURE.md`, `docs/`, and the CI workflows in `.github/workflows/`.

CI is the most reliable of them: it names the commands the project considers mandatory,
which is how you learn that a spec, a schema or a client is *generated* rather than
committed. A build step you did not know about is the single most common reason an
analysis is wrong rather than merely incomplete.

Anything you learn here still needs a citation, and still needs to match what the code
says. A stale `CONTRIBUTING.md` is a lead, not a finding.

## 1. Find the real roots

A clone is rarely one app. Look for `package.json`, `composer.json`, `pom.xml`,
`requirements.txt`, `go.mod` — then decide which is *the product* and which is an
installer, a docs site, a sample, or a tool. The product is the one the `baseUrl`
serves. In a monorepo (`apps/`, `packages/`) name the specific workspace:
`apps/web`, not the root.

Write down both a frontend root and a backend root when they differ. One may be absent.

## 2. Identify the stack

Read the manifest's dependencies before guessing from file extensions. You want:
the frontend framework and major version, the backend framework, the template or
component file extension, the router library, and the build tool.

Then find the **test-id attribute**, because the crawl needs it: grep the source for
`data-testid`, `data-test`, `data-cy`, `data-qa`, `testIdAttribute`, and any Playwright
or Cypress config in the repo. Report the one actually used in markup with a count —
not the one a config mentions. If there is none, say so; "none" is a finding.

## 3. Extract the routes

Find how this app declares routes and read them *that* way. The common shapes:

- **File-system router** — Next.js `app/**/page.tsx` or `pages/**`, Nuxt `pages/`,
  SvelteKit `routes/`. The path is the directory path; `[param]`/`[...slug]` are
  parameters; route groups `(group)` do not appear in the URL.
- **Client router config** — Angular `RouterModule.forRoot([...])` / `routes.ts`,
  Vue Router `createRouter({routes})`, React Router `<Route path>` or `createBrowserRouter`.
  Nested children concatenate onto the parent path.
- **Hash router** — Backbone/Bullbone `routes:` hash or `routeList` array. **Keep the
  `#`** (`/#Contact`): that is the URL a browser must be pointed at. A splat (`*actions`)
  is a fallback handler, not a screen — drop it. An optional group (`admin/jobs(/:status)`)
  resolves to the URL without it.
- **Server-side routes** — Symfony attributes/YAML, Rails `config/routes.rb`, Laravel
  `routes/web.php`, Spring `@RequestMapping`. Take the GET routes that render HTML.

Two rules that matter more than completeness:

- **Note the mount prefix.** An app served under `/web/index.php` or `/admin` has a
  prefix its own route table does not record. Derive it from `baseUrl` plus any router
  `basePath`/`baseHref`/`RewriteBase` you find, and record it once in the dossier —
  never glued onto each path.
- **Record the component that renders each route** when the declaration names one.
  Where a route hands off to a controller that picks a view at runtime (Backbone, and most
  server-rendered back offices),
  say `null` and say why once. It is not a failure; it is the app's design.

Drop API-only routes (`/api/*`, JSON endpoints) — they belong to `app-api`.

## 4. Write the output

```jsonc
// dossier.json
{ "app": "espocrm-demo", "repoPath": "...", "repoCommit": "8b4f900085",
  "generatedAt": "...",
  "frontend": { "root": "client", "framework": "backbone", "version": "1.8",
                "router": "bullbone", "componentExt": ".js", "templateExt": ".tpl" },
  "backend":  { "root": ".", "framework": "php-custom" },
  "testId":   { "attribute": null, "occurrences": 0, "note": "no test ids in markup" },
  "mountPrefix": "/",
  "apiDocs":  { "kind": "none|spec-file|spec-route|generated", "path": "...",
                "generateWith": "the command that produces it, if it is generated" },
  "notes":    ["anything a human should know before trusting this"] }

// routes.json
{ "app": "espocrm-demo", "mountPrefix": "/", "strategy": "hash-router",
  "routes": [ { "path": "/#Contact", "component": null, "params": [], "source": "client/src/router.js:88" } ],
  "skipped": [ { "path": "*actions", "reason": "splat fallback, not a screen" } ] }
```

## Rules

- **Every claim cites a file.** `source` on a route, a path in the dossier. A claim you
  cannot cite, you do not make.
- **Say what you could not find.** An empty `routes` array with a note explaining why is
  a usable result; a plausible invented route is not. Silence is the one failure mode
  that costs a human a day.
- **Do not run the app**, install dependencies, or read `node_modules/` and `vendor/`.
- Prefer `rg`/`grep` with a pattern over reading whole trees. Large monorepos will not
  fit in context and do not need to.
