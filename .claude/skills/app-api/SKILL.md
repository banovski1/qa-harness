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

**Tier A — a specification exists, or can be produced.**

The mistake to avoid is searching for a *spec file*. A project that takes its API
seriously usually generates the spec instead of committing it, so the file is a build
artifact that does not exist in a fresh clone. **Absence of a spec file is not absence of
a spec.** Look for the spec's *source*, in this order:

1. **A committed spec** — `openapi.{json,yaml}`, `swagger.json`, `api-docs`, `.proto`, a
   GraphQL SDL file.
2. **A spec served at runtime** — a documentation route in the app's own routing
   (`/swagger`, `/api-docs`, `/openapi.json`, `/graphql`, `/redoc`). Reachable later even
   when nothing is committed.
3. **A spec generated from annotations in the source.** This is the common case in a
   mature codebase and the easiest to miss. Detect it by the *annotation marker*, not by
   the framework name — you will meet frameworks this file does not list:

   | ecosystem | marker to grep for |
   | --- | --- |
   | PHP | `@OA\\`, `#[OA\\`, `swagger-php`, `zircote`, `nelmio` |
   | Java/Kotlin | `@Operation`, `@Schema`, `springdoc`, `swagger-annotations` |
   | Python | `drf-spectacular`, `apispec`, `FastAPI` (its spec is automatic) |
   | .NET | `Swashbuckle`, `NSwag`, `[ProducesResponseType]` |
   | Go | `swaggo`, `// @Router` |
   | JS/TS | `zod-to-openapi`, `tsoa`, `@nestjs/swagger`, `fastify-swagger` |

   A generic sweep that outlives this table: grep case-insensitively for
   `open-?api`, `swagger`, `@OA`, `api-?doc` and `schema`, then read what the hits are.
   Match the hyphenated spellings too — a real project's command was
   `generate-open-api-doc`, which a search for `openapi` does not find.
4. **A command that produces one.** Check `package.json` scripts, `composer.json`,
   `Makefile`, `Rakefile`, `manage.py`, and above all **the CI workflows** — a project
   that lints its spec in CI has a spec, and the workflow names the exact command.

If the spec is generated and the toolchain is available, run the command and read the
result. If the toolchain is missing, **read the annotations directly** — they carry the
same schemas — and record `"tier": "A", "specStatus": "generated-not-run"` with the
command in `apiDocs.generateWith`, so a human with the toolchain can produce it in one
step. Never silently downgrade a generated spec to Tier B: an annotated codebase is a
documented API, and reporting it as undocumented is a false negative that costs far more
than an incomplete list.

**Tier B — the routes are declared.** Backend route tables and annotations:
Symfony `#[Route]`, Rails `config/routes.rb`, Laravel `routes/api.php`, Spring
`@RequestMapping`, Express/Fastify `app.get(...)`, Next.js `app/api/**/route.ts`, Django
`urls.py`, tRPC routers (each procedure is an endpoint, and its input schema is usually a
Zod object you can read the payload from).

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
  "spec": { "kind": "none|committed|served|generated", "path": "...",
            "generateWith": "...", "specStatus": "read|generated-not-run" },
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
- **Before concluding Tier A is empty, say where you looked.** An empty `spec` block must
  record the searches that came back nothing — the committed paths, the annotation markers,
  the CI workflows. "No spec" is a claim, and an unevidenced one is usually wrong.
- **This file is a reference, not a promise.** An endpoint here may still 403 for the
  test user. Say so in `notes` when you have reason to think it will.
