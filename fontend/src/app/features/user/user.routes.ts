import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'library',
        loadComponent: () => import('./library/user-library.component').then(m => m.UserLibraryComponent)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/user-favorites.component').then(m => m.UserFavoritesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/user-profile.component').then(m => m.UserProfileComponent)
      }
    ]
  }
]; 