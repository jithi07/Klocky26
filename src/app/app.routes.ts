import { Routes }     from '@angular/router';
import { authGuard }   from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { roleGuard }   from './core/guards/role.guard';

export const routes: Routes = [
  // ── Public / marketing ─────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'login',
    // publicGuard: already-authenticated users skip login → dashboard
    canActivate: [publicGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'register',
    canActivate: [publicGuard],
    loadComponent: () =>
      import('./features/auth/pages/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'request-demo',
    loadComponent: () =>
      import('./features/landing/pages/request-demo/request-demo.component').then(
        (m) => m.RequestDemoComponent,
      ),
  },
  {
    path: 'free-trial',
    loadChildren: () =>
      import('./features/onboarding/onboarding.routes').then((m) => m.onboardingRoutes),
  },

  // ── Klocky internal admin (separate auth flow) ──────────────────────────
  {
    path: 'klocky-admin',
    loadChildren: () =>
      import('./features/klocky-admin/klocky-admin.routes').then((m) => m.klockyAdminRoutes),
  },

  // ── App shell (requires authentication) ────────────────────────────────
  {
    path: 'app',
    // authGuard: unauthenticated → /login?returnUrl=/app/...
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.routes),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('./features/employees/employees.routes').then((m) => m.routes),
      },
      {
        path: 'attendance',
        loadChildren: () =>
          import('./features/attendance/attendance.routes').then((m) => m.routes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./features/ui-components/ui-components.routes').then((m) => m.routes),
      },
      {
        // roleGuard example: only admin/hr can access settings
        // Remove canActivate or change roles array once RBAC is finalised
        path: 'settings',
        canActivate: [roleGuard],
        data: { roles: ['admin', 'hr', 'super_admin'] },
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.routes),
      },
    ],
  },

  // ── Catch-all — redirect unknown URLs to landing ─────────────────────────
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
