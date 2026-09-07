---
name: live-urls
description: Turn the extracted route list into full URLs against a running instance of the app. Use for "give me the URLs", "what can I open in the browser", "regenerate analysis/live-urls.md".
allowed-tools: Bash(node:*)
---

# Live URLs

Pure string composition over `analysis/pages-and-routes.json`. **No request is fired** and no
sample id is invented — this skill never touches the network.

## Run it

```bash
npm run routes --prefix scripts/repo-analyzer -- --app <app-path>     # must run first
npm run live-urls --prefix scripts/repo-analyzer -- [--base-url <url>] [--path-prefix <prefix>]
```

The base URL defaults to `baseUrl:` in `scripts/app-config.yaml` — the instance the rest of this
repo already targets. `--path-prefix` is for apps served under a front-controller path
(an app mounted under a prefix might use `/web/index.php`). If neither a flag nor the config yields a base URL, stop and
ask; never hardcode one.

## Placeholders stay placeholders

A route with a dynamic segment is written `…/empNumber/{empNumber}`, not with an invented id. A
fabricated id reads as a real URL and fails confusingly; the placeholder makes the missing
precondition obvious. Those URLs are rendered as plain text while static ones are links, so the
openable set is visible at a glance. Fill a placeholder from a precondition step — see
`analysis/api-documentation.md` for the endpoint that creates the record.
