import { Routes } from '@angular/router';
import { AuthGuard, adminGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './shared/layouts/admin/admin-layout.component';
import { UserLayoutComponent } from './shared/layouts/user/user-layout.component';

export const APP_ROUTES: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  // Auth routes (public)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // User routes (protected)
  {
    path: '',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.USER_ROUTES)
      }
    ]
  },

  // Admin routes (protected + admin only)
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, adminGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
      }
    ]
  },

  // Catch all route
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
