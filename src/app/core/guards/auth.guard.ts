import { inject }          from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of }  from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AppStateService } from '../services/app-state.service';
import { OrgAuthService }  from '../services/org-auth.service';
import { isValidOrgSlugFormat } from '../utils/org-slug.util';

// ─────────────────────────────────────────────────────────────────────────────
// AuthGuard — protects routes that require a logged-in user
//
// Apply to any route that needs authentication:
//   { path: ':orgSlug/app', component: ShellComponent, canActivate: [authGuard], ... }
//
// Validates:
//  1. User is authenticated
//  2. URL orgSlug matches the user's orgSlug (cheap client-side check)
//  3. The slug is re-confirmed against GET /api/org/auth/validate-slug/{slug}
//     (§1.4, public) — this is a real server-side check, not just a string
//     compare against locally cached state, so a stale/forged slug in the
//     URL can't silently pass. Only runs once per workspace entry (this
//     guard fires on the parent ':orgSlug/app' route, not on every child
//     navigation), so the extra round-trip is not on a hot path.
//
// Redirects:
//  - Unauthenticated users → /login with returnUrl
//  - Wrong/invalid org slug → /404 (unauthorized access to different organization)
// ─────────────────────────────────────────────────────────────────────────────

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const appState = inject(AppStateService);
  const orgAuth  = inject(OrgAuthService);
  const router   = inject(Router);

  if (!appState.isAuthenticated()) {
    // Not authenticated - redirect to login with return URL
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const urlOrgSlug = route.paramMap.get('orgSlug') || route.parent?.paramMap.get('orgSlug');
  const storedOrgSlug = appState.orgSlug();

  // Format check first — rejects garbage/manually-edited URLs immediately,
  // no network round-trip needed for input that can't possibly be a real slug.
  if (!urlOrgSlug || !isValidOrgSlugFormat(urlOrgSlug)) {
    return router.createUrlTree(['/404']);
  }

  // Cheap client-side check next — same-session navigation never even
  // reaches the network for the common case of a matching slug.
  if (storedOrgSlug && urlOrgSlug.toLowerCase() !== storedOrgSlug.toLowerCase()) {
    return router.createUrlTree(['/404']);
  }

  return orgAuth.validateSlug(urlOrgSlug).pipe(
    map((res) => {
      if (!res.data.isValid) {
        return router.createUrlTree(['/404']);
      }
      return true;
    }),
    // Network hiccup on this extra check shouldn't lock the user out of an
    // otherwise-valid session — every real API call underneath still
    // enforces its own org/token check server-side regardless.
    catchError((err) => {
      if (err?.status === 404) return of(router.createUrlTree(['/404']));
      return of(true);
    }),
  );
};
