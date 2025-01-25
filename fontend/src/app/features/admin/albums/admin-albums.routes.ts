import { Routes } from '@angular/router';

export const ADMIN_ALBUM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-albums.component').then(m => m.AdminAlbumsComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./album-form/album-form.component').then(m => m.AlbumFormComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./album-form/album-form.component').then(m => m.AlbumFormComponent)
  }
]; 