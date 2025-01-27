import { Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { SongFormComponent } from './song-form/song-form.component';
import { songResolver } from '../../../core/resolvers/song.resolver';

export const ADMIN_SONGS_ROUTES: Routes = [
  {
    path: '',
    component: SongListComponent
  },
  {
    path: 'create',
    component: SongFormComponent
  },
  {
    path: 'edit/:id',
    component: SongFormComponent,
    resolve: { song: songResolver }
  }
]; 