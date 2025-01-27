import { Routes } from '@angular/router';
import { songResolver } from '../../../core/resolvers/song.resolver';

export const ADMIN_SONGS_ROUTES: Routes = [
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
    resolve: {
      song: songResolver
    },
    loadComponent: () => import('./song-form/song-form.component')
      .then(m => m.SongFormComponent)
  }
]; 