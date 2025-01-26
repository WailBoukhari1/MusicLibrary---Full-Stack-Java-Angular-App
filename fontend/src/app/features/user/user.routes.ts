import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full'
  },
  {
    path: 'library',
    loadComponent: () => import('./library/user-library.component')
      .then(m => m.UserLibraryComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/user-profile.component')
      .then(m => m.UserProfileComponent)
  }
]; 