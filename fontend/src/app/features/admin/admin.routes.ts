import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminGuard } from '../../core/guards/admin.guard';
import { AlbumListComponent } from './albums/album-list/album-list.component';
import { AlbumFormComponent } from './albums/album-form/album-form.component';
import { AlbumListResolver } from '../../core/resolvers/album-list.resolver';
import { AlbumDetailResolver } from '../../core/resolvers/album-detail.resolver';
import { AlbumEnumResolver } from '../../core/resolvers/album-enum.resolver';

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
              albumsData: AlbumListResolver
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
              albumData: AlbumDetailResolver,
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