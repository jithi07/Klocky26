import { Routes } from '@angular/router';
export const recruitmentRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/recruitment/recruitment.component').then(m => m.RecruitmentComponent) },
];
