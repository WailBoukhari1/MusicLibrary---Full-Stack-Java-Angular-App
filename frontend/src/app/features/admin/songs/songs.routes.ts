import { Routes } from '@angular/router';
import { SongResolver } from './song.resolver';

export const SONGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./song-list/song-list.component')
      .then(m => m.SongListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./song-form/song-form.component')
      .then(m => m.SongFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./song-form/song-form.component')
      .then(m => m.SongFormComponent),
    resolve: {
      song: SongResolver
    }
  }
]; 