import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/attendance/attendance.component').then(
        m => m.AttendanceComponent
      ),
  },
];