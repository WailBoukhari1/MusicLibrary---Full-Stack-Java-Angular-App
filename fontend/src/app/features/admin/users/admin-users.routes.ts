import { Routes } from '@angular/router';

export const ADMIN_USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent)
  },
]; 