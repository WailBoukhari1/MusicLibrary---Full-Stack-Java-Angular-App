import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminGuard } from '../../core/guards/admin.guard';
import { AlbumListComponent } from './albums/album-list/album-list.component';
import { AlbumFormComponent } from './albums/album-form/album-form.component';
import { AlbumListResolver } from '../../core/resolvers/album-list.resolver';
import { AlbumDetailResolver } from '../../core/resolvers/album-detail.resolver';
import { AlbumEnumResolver } from '../../core/resolvers/album-enum.resolver';
import { adminGuard } from '../../core/guards/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'albums',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./albums/admin-albums.routes')
              .then(m => m.ADMIN_ALBUM_ROUTES)
          },
        ]
      },
      {
        path: 'songs',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./songs/admin-songs.routes')
              .then(m => m.ADMIN_SONG_ROUTES)
          },
        ]
      },
      {
        path: 'users',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./users/admin-users.routes')
              .then(m => m.ADMIN_USER_ROUTES)
          },
        ]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
]; 