# api-auth

Turns the `auth` block in `api.json` from a citation into a fact.

```bash
npx tsx scripts/api-auth/verify-auth.ts            # look
npx tsx scripts/api-auth/verify-auth.ts --all --write              # stamp every app
npx tsx scripts/api-auth/verify-auth.ts --json       # for an agent
```

`APP_USERNAME` and `APP_PASSWORD` come from the environment. Nothing here names an
application: the app-specific part is `api.json`, which the tool reads.

## What "verified" costs

Running the login is the easy half. A login that answers `200` has proved nothing — an
app will happily re-render its login page with a `200`, and a rejected form POST often
redirects rather than erroring. So the credential is put to work:

1. pick a `GET` from the app's own `endpoints` with no path parameter (Tier A first, so
   no record has to exist for it to answer),
2. call it anonymously,
3. call it with the credential.

`verified` requires the endpoint to **refuse step 2 and admit step 3**. If every
candidate is public, the verdict is `unverifiable`, not `verified` — the login may be
fine, but this run did not prove it.

## Exit codes

`1` only when a login `failed`. `unverifiable` and `skipped` exit `0`: they are states of
the world, not defects in the analysis.

## Adding an auth shape

`strategies.ts` holds one function per shape — `tokenLogin`, `basicLogin`, `sessionLogin`
— each returning a `Credential` or a reason it could not get one. An app whose login does
not fit belongs in a new strategy, never in a special case: the point of the corpus is
that the next app inherits the fix.

The dispatch keys off the **request** shape, not the credential returned. An app that
exchanges HTTP Basic for a token is a `basicLogin`, whatever `auth.kind` says.
