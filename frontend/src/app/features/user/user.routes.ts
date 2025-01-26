import { Routes } from '@angular/router';
import { UserLibraryComponent } from './library/user-library.component';
import { AlbumDetailsComponent } from './album/album-details.component';

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
  },
  {
    path: 'albums/:id',
    loadComponent: () => import('./album/album-details.component')
    .then(m => m.AlbumDetailsComponent)
  }
]; 