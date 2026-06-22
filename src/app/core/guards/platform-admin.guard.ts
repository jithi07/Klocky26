import { inject }          from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlatformAdminStateService } from '../services/platform-admin-state.service';

// ─────────────────────────────────────────────────────────────────────────────
// platformAdminGuard — protects /klocky-admin/dashboard/*
//
// Completely separate from authGuard (org employees) — checks the platform
// admin's own session, not AppStateService.
// ─────────────────────────────────────────────────────────────────────────────

export const platformAdminGuard: CanActivateFn = () => {
  const state  = inject(PlatformAdminStateService);
  const router = inject(Router);

  if (!state.isAuthenticated()) {
    return router.createUrlTree(['/klocky-admin']);
  }
  return true;
};
