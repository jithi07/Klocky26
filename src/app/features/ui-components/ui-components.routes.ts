import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/ui-components/ui-components.component').then(
        (m) => m.UiComponentsComponent
      ),
  },
];
