import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
  },
  {
    path: 'employee',
    loadComponent: () =>
      import('./pages/employee-dashboard/employee-dashboard.component').then(
        m => m.EmployeeDashboardComponent
      ),
  },
];