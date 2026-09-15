// Generated once from analysis.json (56e23b3b09) on 2026-09-15.
// This file is yours now. Nothing regenerates it.

// Proven 2026-09-15T16:17:08.174Z by scripts/api-auth/verify-auth.ts:
//   /web/index.php/api/v2/buzz/feed answers 401 anonymously and 200 with the credential
import type { AuthPlan } from '../support/auth-plan-types.ts';

export type { AuthPlan, ReplaySource } from '../support/auth-plan-types.ts';

export const AUTH_PLAN: AuthPlan = {
  "strategy": "session",
  "login": {
    "method": "POST",
    "path": "/web/index.php/auth/validate"
  },
  "fields": {
    "username": "APP_USERNAME",
    "password": "APP_PASSWORD"
  },
  "csrf": {
    "field": "_token",
    "fromPath": "/web/index.php/auth/login"
  },
  "success": {
    "status": 302,
    "redirectIncludes": "/web/index.php/dashboard/index",
    "cookie": "orangehrm"
  },
  "verifyWith": {
    "method": "GET",
    "path": "/web/index.php/api/v2/buzz/feed"
  }
};
