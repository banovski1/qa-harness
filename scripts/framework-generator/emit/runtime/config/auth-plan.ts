// A placeholder, like components/locator-templates.ts beside it.
//
// authenticate.ts imports AUTH_PLAN at module scope, so this file exists to let the
// runtime typecheck and be tested standalone inside the generator. renderAuthPlan()
// writes the real, app-specific file at the same output path, so the SKIP set in
// emit/components.ts excludes this one — copying it too would plan the same path twice.
import type { AuthPlan } from '../support/auth-plan-types.ts';

export type { AuthPlan, ReplaySource } from '../support/auth-plan-types.ts';

export const AUTH_PLAN: AuthPlan = {
  strategy: 'session',
  login: { method: 'POST', path: '/login' },
  fields: { username: 'APP_USERNAME', password: 'APP_PASSWORD' },
  verifyWith: { method: 'GET', path: '/' },
};
