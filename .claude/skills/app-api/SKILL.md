---
name: app-api
description: Document the API surface of a local clone of the app under test so preconditions and test data have real endpoints instead of guesses — including how a test user authenticates. Use for "what APIs does the app have", "document the API", "how do I log in via API", "regenerate api.json". Runs after app-dossier.
---

# app-api

A UI test that creates its preconditions through the UI is slow and tests the wrong
thing twice. This file is what lets a spec set up state directly. Its other job is
**authentication**: the cheapest possible way to get a logged-in session.

Inputs: `analysis/<app>/app-profile.yaml`, `dossier.json`. Output: `analysis/<app>/api.json`.

## Work the tiers in order and stop when one pays

**Tier A — a specification exists.** Look for `openapi.{json,yaml}`, `swagger.json`,
`api-docs`, a `.proto`, a GraphQL schema, or a published spec route in the app's own
config. If you find one, read it and you are largely done. This is the only tier whose
output needs no hedging.

**Tier B — the routes are declared.** Backend route tables and annotations:
Symfony `#[Route]`, Rails `config/routes.rb`, Laravel `routes/api.php`, Spring
`@RequestMapping`, Express/Fastify `app.get(...)`, Next.js `app/api/**/route.ts`,
tRPC routers (`router({ ... })` — each procedure is an endpoint, and its input schema is
usually a Zod object you can read the payload from).

**Tier C — the client calls them.** Grep the frontend for its HTTP layer (`axios`,
`fetch`, a generated client, a `Model.url` convention) and record the endpoints it calls.
Tier C is evidence that an endpoint is *used*, not that it exists as documented — mark
every Tier C row `"confidence": "observed-in-client"` and never present it as a contract.

Record the tier per endpoint. Mixing tiers is normal; hiding which tier a row came from
is not.

## Authentication — do this even if you skip everything else

Find, in order of usefulness:

1. **A token or API-key flow.** An endpoint that exchanges credentials for a token, and
   the header it goes in. Record the exact request shape.
2. **The session login endpoint.** The form POST target, the field names, the CSRF
   token's name and where it comes from, and what a success looks like (cookie name,
   redirect, 200 body).
3. **Roles.** If the app ships seed users or documents roles, record them — a test that
   needs an admin needs to know which user is one.

Never put a credential in this file. Reference `env:APP_USERNAME` / `env:APP_PASSWORD`.

## Output

```jsonc
{ "app": "espocrm-demo", "generatedAt": "...", "baseUrl": "...", "apiPrefix": "/api/v1",
  "tiers": { "A": 0, "B": 142, "C": 31 },
  "auth": { "kind": "session|token|basic|none",
            "loginEndpoint": { "method": "POST", "path": "/api/v1/App/user",
                               "auth": "basic", "fields": {} },
            "success": { "cookie": "auth-token-secret", "status": 200 },
            "csrf": null,
            "users": [ { "role": "admin", "username": "env:APP_USERNAME" } ] },
  "endpoints": [ { "method": "POST", "path": "/api/v1/Contact",
                   "summary": "create a contact", "tier": "B",
                   "request": { "firstName": "string", "lastName": "string" },
                   "response": { "id": "string" },
                   "auth": true, "source": "application/Espo/.../Controller.php:44",
                   "confidence": "declared" } ],
  "notes": [] }
```

Prefer the entities a test would actually need — the ones the UI creates — over
exhaustive coverage of an admin API nothing will call.

## Rules

- **Cite a file and line for every endpoint.** No citation, no row.
- **State the tier and the confidence.** A Tier C guess presented as a contract is worse
  than an omission, because it fails at 3am inside a precondition rather than in review.
- **This file is a reference, not a promise.** An endpoint here may still 403 for the
  test user. Say so in `notes` when you have reason to think it will.
