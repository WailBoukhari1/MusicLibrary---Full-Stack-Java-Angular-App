import { Routes } from '@angular/router';
import { AuthGuard, adminGuard, authGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './shared/layouts/admin/admin-layout.component';
import { UserLayoutComponent } from './shared/layouts/user/user-layout.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { SongListComponent } from './features/admin/songs/song-list/song-list.component';
import { SongFormComponent } from './features/admin/songs/song-form/song-form.component';
import { songResolver } from './core/resolvers/song.resolver';

export const APP_ROUTES: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: 'user/library',
    pathMatch: 'full'
  },

  // Auth routes (no layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES),
    canActivate: [noAuthGuard]
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
    component: UserLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES),
  },

  // Catch all route
  {
    path: '**',
    redirectTo: 'auth/login'
  },
];
