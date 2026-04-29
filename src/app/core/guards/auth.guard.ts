import { inject }          from '@angular/core';
import { CanActivateFn }   from '@angular/router';
import { Router }          from '@angular/router';
import { AppStateService } from '../services/app-state.service';

// ─────────────────────────────────────────────────────────────────────────────
// AuthGuard — protects routes that require a logged-in user
//
// Apply to any route that needs authentication:
//   { path: 'app', component: ShellComponent, canActivate: [authGuard], ... }
//
// Redirects unauthenticated users to /login while preserving the attempted URL
// as a `returnUrl` query param so they can be sent back after login.
// ─────────────────────────────────────────────────────────────────────────────

export const authGuard: CanActivateFn = (route, state) => {
  const appState = inject(AppStateService);
  const router   = inject(Router);

  if (appState.isAuthenticated()) {
    return true;
  }

  // Preserve the attempted URL for post-login redirect
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
