import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/guards/auth.guard';
import { AdminGuard } from '../../core/auth/guards/admin.guard';
import { AlbumListComponent } from './albums/components/album-list/album-list.component';
import { AlbumFormComponent } from './albums/components/album-form/album-form.component';
import { AlbumListResolver } from './albums/resolvers/album-list.resolver';
import { AlbumDetailResolver } from './albums/resolvers/album-detail.resolver';
import { AlbumEnumResolver } from './albums/resolvers/album-enum.resolver';

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
        children: [
          {
            path: '',
            component: AlbumListComponent,
            resolve: {
              albums: AlbumListResolver
            }
          },
          {
            path: 'new',
            component: AlbumFormComponent,
            resolve: {
              enums: AlbumEnumResolver
            }
          },
          {
            path: 'edit/:id',
            component: AlbumFormComponent,
            resolve: {
              album: AlbumDetailResolver,
              enums: AlbumEnumResolver
            }
          }
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