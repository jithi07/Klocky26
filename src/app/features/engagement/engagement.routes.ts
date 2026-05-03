import { Routes } from '@angular/router';
export const engagementRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/surveys/surveys.component').then(m => m.SurveysComponent) },
];
