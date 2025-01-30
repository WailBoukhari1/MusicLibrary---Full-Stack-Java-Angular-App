import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { AdminLayoutComponent } from './shared/layouts/admin/admin-layout.component';
import { UserLayoutComponent } from './shared/layouts/user/user-layout.component';
import { SongListComponent } from './features/admin/songs/song-list/song-list.component';
import { SongFormComponent } from './features/admin/songs/song-form/song-form.component';
import { songResolver } from './core/resolvers/song.resolver';
import { HomeComponent } from './features/user/home/home.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user/home'
  },

  // Auth routes
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./features/auth/auth.routes')
      .then(m => m.AUTH_ROUTES)
  },

  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes')
      .then(m => m.ADMIN_ROUTES)
  },

  // User routes
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES)
  },

  // Not found
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
