import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  }
];
