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

  // Auth routes (no layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },

  // Admin routes (with admin layout)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },

  // User routes (no layout)
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES)
  },

  // Catch all route
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
