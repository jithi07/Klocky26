import { Routes } from '@angular/router';
export const shiftRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/shifts/shifts.component').then(m => m.ShiftsComponent) },
];
