import { Routes } from '@angular/router';

export const ADMIN_ALBUM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./album-list/album-list.component')
      .then(m => m.AlbumListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./album-form/album-form.component')
      .then(m => m.AlbumFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./album-form/album-form.component')
      .then(m => m.AlbumFormComponent)
  }
]; 