import { Routes } from '@angular/router';
export const performanceRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/performance/performance.component').then(m => m.PerformanceComponent) },
];
