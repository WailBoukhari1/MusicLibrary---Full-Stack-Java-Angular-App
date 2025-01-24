import { Routes } from '@angular/router';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { AlbumFormComponent } from './components/album-form/album-form.component';

export const ADMIN_ALBUM_ROUTES: Routes = [
  {
    path: '',
    component: AlbumListComponent
  },
  {
    path: 'new',
    component: AlbumFormComponent
  },
  {
    path: 'edit/:id',
    component: AlbumFormComponent
  }
]; 