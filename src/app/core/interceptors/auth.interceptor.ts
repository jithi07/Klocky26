import { HttpInterceptorFn } from '@angular/common/http';
import { inject }            from '@angular/core';
import { AppStateService }   from '../services/app-state.service';

// ─────────────────────────────────────────────────────────────────────────────
// Auth Interceptor
//
// Attaches the JWT access token as a Bearer header on every API request.
// Only adds the header when a token exists — public endpoints are unaffected.
//
// Example header added:
//   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
// ─────────────────────────────────────────────────────────────────────────────

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const appState    = inject(AppStateService);
  const accessToken = appState.getAccessTokenSync();

  if (!accessToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
        // Include the org slug so the server can route multi-tenant requests
        ...(appState.orgSlug() ? { 'X-Org-Slug': appState.orgSlug()! } : {}),
      },
    }),
  );
};
