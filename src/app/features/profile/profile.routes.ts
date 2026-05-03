import { Routes } from '@angular/router';
export const profileRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/my-profile/my-profile.component').then(m => m.MyProfileComponent) },
];
