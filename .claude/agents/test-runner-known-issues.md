# Known issues — test-runner's fix library

`test-runner` reads this table to decide whether a failure has a documented fix. A
symptom with no matching row is a handoff to a human, not something to improvise.
Each row `test-runner` appends after a confirmed fix must keep this same shape.

| Symptom (from playwright-cli reproduction) | Root cause | Fix location | Fix |
|---|---|---|---|
| Locator resolves to 0 elements; playwright-cli snapshot shows the label text differs from the map's `comment:` | Stale map — the app's label changed since the module was walked | `ui-map-results/application-map/<slug>.yaml` | Re-run the `smart-map` skill for that module, then regenerate |
| Element found but action times out; playwright-cli snapshot shows a spinner/overlay still present at the moment of failure | Missing readiness wait | `generated-framework/src/utils/waitHelpers.ts` or the protected `<Name>Page.ts` | Call `waitForSpinnerToClear` (or add a targeted wait) before the action |
| Assertion/save fails with an "already exists" / duplicate-value server error | Test data collision (e.g. reused username across runs) | The spec's own generated test data | Add/extend a uniqueness suffix (timestamp/random) to the offending field |
| `page.goto('/auth/login')` never shows the login form; playwright-cli snapshot shows the app already on the authenticated Dashboard for the previous user | Switching users without logging out first — the app redirects an authenticated session straight past `/auth/login` | The `loginAs`/`login` helper in `generated-framework/src/utils/auth.ts` | Log out (open the profile menu and click Logout, or navigate to the app's logout URL) before navigating to `/auth/login` for the next user |
| Form save appears to click through, then a downstream login/assertion fails with wrong-state errors (e.g. "Invalid credentials") even though a manual, step-by-step playwright-cli replay of the same form succeeds | Race: an autocomplete suggestion or a submit button was clicked before it rendered/settled, so the automated run outraced the app while a manually-paced replay did not | The protected `<Name>Page.ts` method driving the multi-field form | Wait for the suggestion/option `waitFor({ state: 'visible' })` before clicking it, and after submit call `waitForSpinnerToClear` plus `page.waitForURL(...)` for the expected redirect before continuing |
