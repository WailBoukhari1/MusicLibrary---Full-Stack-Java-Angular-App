import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./home/home.component')
          .then(m => m.HomeComponent),
        title: 'Home'
      },
      {
        path: 'library',
        loadComponent: () => import('./library/user-library.component')
          .then(m => m.UserLibraryComponent),
        title: 'My Library'
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/user-favorites.component')
          .then(m => m.UserFavoritesComponent),
        title: 'My Favorites'
      },
      {
        path: 'albums/:id',
        loadComponent: () => import('./album/album-details.component')
          .then(m => m.AlbumDetailsComponent),
        title: 'Album Details'
      },
      {
        path: 'song-details/:id',
        loadComponent: () => import('./song/song-details.component')
          .then(m => m.SongDetailsComponent),
        title: 'Song Details'
      }
    ]
  }
]; 