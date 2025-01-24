import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { AdminGuard } from './core/auth/guards/admin.guard';
import { AlbumListComponent } from './features/admin/albums/components/album-list/album-list.component';
import { AlbumFormComponent } from './features/admin/albums/components/album-form/album-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/library',
    pathMatch: 'full'
  },
  // Public routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  // User routes
  {
    path: 'user',
    loadComponent: () => import('./layouts/user/user-layout.component').then(m => m.UserLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
      }
    ]
  },
  // Admin routes
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      },
      {
        path: 'albums',
        component: AlbumListComponent
      },
      {
        path: 'albums/new',
        component: AlbumFormComponent
      },
      {
        path: 'albums/edit/:id',
        component: AlbumFormComponent
      }
    ]
  },
  // Fallback route
  {
    path: '**',
    redirectTo: 'user/library'
  }
];
