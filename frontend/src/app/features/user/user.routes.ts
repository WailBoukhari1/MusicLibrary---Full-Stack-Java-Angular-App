import { Routes } from '@angular/router';
import { UserLibraryComponent } from './library/user-library.component';
import { AlbumDetailsComponent } from './album/album-details.component';
import { UserFavoritesComponent } from './favorites/user-favorites.component';
import { UserSongsComponent } from './songs/user-songs.component';

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
    path: 'songs/:id',
    component: UserSongsComponent
  }
]; 