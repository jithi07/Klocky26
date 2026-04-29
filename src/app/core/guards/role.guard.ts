import { inject }          from '@angular/core';
import { CanActivateFn }   from '@angular/router';
import { Router }          from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { UserRole }        from '../models/user.model';

// ─────────────────────────────────────────────────────────────────────────────
// RoleGuard — restricts a route to users with a specific role
//
// Pass the allowed roles in `data.roles`:
//
//   {
//     path: 'settings',
//     canActivate: [roleGuard],
//     data: { roles: ['admin', 'hr'] satisfies UserRole[] },
//     loadChildren: ...
//   }
//
// Redirects users with insufficient role to /app/dashboard.
// ─────────────────────────────────────────────────────────────────────────────

export const roleGuard: CanActivateFn = (route, _state) => {
  const appState     = inject(AppStateService);
  const router       = inject(Router);
  const allowedRoles = (route.data['roles'] ?? []) as UserRole[];

  if (allowedRoles.length === 0) {
    // No roles specified — guard is a no-op, allow through
    return true;
  }

  const userRole = appState.userRole();

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  return router.createUrlTree(['/app/dashboard']);
};
