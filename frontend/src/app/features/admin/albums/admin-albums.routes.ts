import { Routes } from '@angular/router';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumFormComponent } from './album-form/album-form.component';

export const ADMIN_ALBUMS_ROUTES: Routes = [
  {
    path: '',
    component: AlbumListComponent
  },
  {
    path: 'create',
    component: AlbumFormComponent
  },
  {
    path: 'edit/:id',
    component: AlbumFormComponent
  }
]; 