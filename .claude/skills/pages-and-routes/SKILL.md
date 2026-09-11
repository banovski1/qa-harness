---
name: pages-and-routes
description: Extract every page the app defines from a local clone, using its own routing convention (file-based router, client router config, or server-side routes). Use for "list the app's pages", "what routes does the app have", "regenerate analysis/pages-and-routes.md".
allowed-tools: Bash(node:*) Bash(npm:*)
---

# Pages and routes

Static analysis of a **local clone** of the application under test — a filesystem path the
engineer gives you, never a URL. Output is `../../../analysis/<app>/pages-and-routes.md` (`<app>` is `appName:` in root `app-config.yaml`, so one clone's reports never overwrite another's) plus the `.json`
sidecar that `live-urls` reads.

## Run it

```bash
npm ci --prefix scripts/repo-analyzer     # first time only, from the repo root
npm run routes --prefix scripts/repo-analyzer -- --app <app-path>            # from the repo root
npm run routes --prefix scripts/repo-analyzer -- --app <app-path> --dry-run
```

`--api-prefix <prefix>` changes which paths are treated as API rather than page routes
(default `/api`; those belong to the `api-documentation` skill). `--frontend-root` /
`--backend-root` override detection.

## Which strategy ran

The header names it, and that is the first thing to check. In order of preference:

1. a **file-based router** — Next, Nuxt, SvelteKit, Astro, Remix: routes come from the folder tree;
2. a **client router config** — Vue Router, React Router, Angular Router: the route array is parsed;
3. **server-side routing** — the backend declares the pages, and where it hands a component name
   to the frontend the bridge is followed to the actual file;
4. **nothing matched** — the report says so and lists no routes. That is the honest outcome; do
   not fill it in by hand. Record the flows you need with `playwright-codegen` instead.

Params are normalised to `{name}` whichever convention declared them.

## Reading it

A route with an empty **Renders** cell resolved to no component file — usually a redirect or a
download endpoint, sometimes a component chosen at runtime. It is listed unresolved rather than
guessed. Routes registered only at boot cannot appear at all; the *Not statically resolvable*
section says so explicitly.

This list is the generator's page inventory: every route here becomes a page object, and a
route whose `component` could not be resolved becomes one carrying a URL and nothing else.
