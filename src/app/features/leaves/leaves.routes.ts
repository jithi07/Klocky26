import { Routes } from '@angular/router';

export const leaveRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/leave-approvals/leave-approvals.component').then(m => m.LeaveApprovalsComponent),
  },
];
