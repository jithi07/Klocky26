import { Routes } from '@angular/router';
import { dashboardRedirectGuard } from '../../core/guards/dashboard-redirect.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [dashboardRedirectGuard],
    loadComponent: () =>
      import('./pages/employee-dashboard/employee-dashboard.component').then(
        m => m.EmployeeDashboardComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['admin', 'hr', 'manager', 'super_admin'] },
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
  },
];
