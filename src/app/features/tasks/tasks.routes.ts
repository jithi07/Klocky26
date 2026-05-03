import { Routes } from '@angular/router';
export const taskRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/tasks/tasks.component').then(m => m.TasksComponent) },
];
