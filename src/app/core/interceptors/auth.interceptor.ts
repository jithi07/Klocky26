import { HttpInterceptorFn } from '@angular/common/http';
import { inject }            from '@angular/core';
import { AppStateService }   from '../services/app-state.service';
import { PlatformAdminStateService } from '../services/platform-admin-state.service';
import { AUTH_SCOPE }        from '../http/auth-scope.context';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Interceptor
//
// Attaches the right bearer token depending on the request's AUTH_SCOPE
// (default 'user'):
//  • 'user'     → employee access token (day-to-day work, everyone)
//  • 'org'      → org-admin step-up token (org registration / org-admin login)
//  • 'platform' → Klocky platform-admin token
//
// If the relevant token isn't present, the request goes out with no
// Authorization header — public endpoints (OTP, validate-slug, the three
// logins) are unaffected either way.
// ─────────────────────────────────────────────────────────────────────────────

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const appState      = inject(AppStateService);
  const platformState = inject(PlatformAdminStateService);

  const scope = req.context.get(AUTH_SCOPE);
  const token =
    scope === 'org'      ? appState.getOrgAdminTokenSync() :
    scope === 'platform' ? platformState.getTokenSync() :
    appState.getAccessTokenSync();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};
