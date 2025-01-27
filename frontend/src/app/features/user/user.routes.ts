import { Routes } from '@angular/router';
import { UserLibraryComponent } from './library/user-library.component';
import { AlbumDetailsComponent } from './album/album-details.component';
import { UserFavoritesComponent } from './favorites/user-favorites.component';
import { SongDetailsComponent } from './song/song-details.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full'
  },
  {
    path: 'library',
    component: UserLibraryComponent
  },
  {
    path: 'albums/:id',
    component: AlbumDetailsComponent
  },
  {
    path: 'favorites',
    component: UserFavoritesComponent
  },
  {
    path: 'song-details/:id',
    component: SongDetailsComponent
  }
]; 