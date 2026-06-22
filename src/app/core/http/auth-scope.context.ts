import { HttpContextToken } from '@angular/common/http';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH_SCOPE — tells authInterceptor which token to attach to a request.
//
// The backend issues three independent token types (INTEGRATION_GUIDE.md):
//  • 'user'     — employee token, day-to-day work (default, used by everyone)
//  • 'org'      — org-admin step-up token (org registration / org-admin login)
//  • 'platform' — Klocky's own internal platform-admin token
//
// Set explicitly via HttpContext on requests that need the 'org' or 'platform'
// token while a 'user' token may also be present, e.g.:
//   this.api.post(path, body, { context: new HttpContext().set(AUTH_SCOPE, 'org') })
// ─────────────────────────────────────────────────────────────────────────────

export type AuthScope = 'user' | 'org' | 'platform';

export const AUTH_SCOPE = new HttpContextToken<AuthScope>(() => 'user');
