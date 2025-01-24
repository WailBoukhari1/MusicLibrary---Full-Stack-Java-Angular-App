import { Routes } from '@angular/router';

export const ADMIN_SONG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-songs.component').then(m => m.AdminSongsComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/admin-songs-create.component').then(m => m.AdminSongsCreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit/admin-songs-edit.component').then(m => m.AdminSongsEditComponent)
  }
]; 