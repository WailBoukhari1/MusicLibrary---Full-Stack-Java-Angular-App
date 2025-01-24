import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../core/auth/store/auth.actions';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="admin-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="logo">
          <mat-icon>music_note</mat-icon>
          <span>Admin Panel</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/admin/albums" routerLinkActive="active">
            <mat-icon matListItemIcon>album</mat-icon>
            <span>Albums</span>
          </a>
          <a mat-list-item routerLink="/admin/songs" routerLinkActive="active">
            <mat-icon matListItemIcon>music_note</mat-icon>
            <span>Songs</span>
          </a>
          <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
            <mat-icon matListItemIcon>people</mat-icon>
            <span>Users</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <span>Music Streaming Admin</span>
          <span class="toolbar-spacer"></span>
          
          <a mat-button routerLink="/user/library">
            <mat-icon>library_music</mat-icon>
            Music Library
          </a>

          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .admin-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
      background: #f5f5f5;
    }
    .logo {
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      color: #333;
      border-bottom: 1px solid #ddd;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 20px;
    }
    mat-nav-list {
      padding-top: 0;
    }
    .active {
      background: rgba(0,0,0,0.04);
    }
    mat-icon {
      margin-right: 10px;
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private store: Store) {}

  logout() {
    this.store.dispatch(AuthActions.logoutRequest());
  }
} 