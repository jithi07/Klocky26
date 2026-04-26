import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'org-profile',
    pathMatch: 'full',
  },
  {
    path: 'org-profile',
    loadComponent: () =>
      import('./pages/org-profile/org-profile.component').then(
        (m) => m.OrgProfileComponent,
      ),
  },
];
