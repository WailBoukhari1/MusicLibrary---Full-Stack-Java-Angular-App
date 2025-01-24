import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../core/auth/store/auth.actions';
import { AuthService } from '../../core/auth/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSliderModule
  ],
  template: `
    <div class="user-container">
      <mat-toolbar color="primary">
        <button mat-icon-button routerLink="/user/library">
          <mat-icon>music_note</mat-icon>
        </button>
        <span>Music Streaming</span>
        
        <div class="nav-links">
          <a mat-button routerLink="/user/library" routerLinkActive="active">
            <mat-icon>library_music</mat-icon>
            Library
          </a>
          <a mat-button routerLink="/user/favorites" routerLinkActive="active">
            <mat-icon>favorite</mat-icon>
            Favorites
          </a>
          <a mat-button *ngIf="isAdmin$ | async" routerLink="/admin/dashboard">
            <mat-icon>dashboard</mat-icon>
            Admin Dashboard
          </a>
        </div>

        <span class="toolbar-spacer"></span>

        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item routerLink="/user/profile">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="content">
        <router-outlet></router-outlet>
      </div>

      <!-- Music Player -->
      <div class="player-bar">
        <mat-toolbar>
          <div class="now-playing">
            <img src="assets/default-album.png" alt="Album cover" class="album-thumb">
            <div class="track-info">
              <span class="track-name">Track Name</span>
              <span class="artist-name">Artist Name</span>
            </div>
          </div>

          <div class="player-controls">
            <button mat-icon-button>
              <mat-icon>skip_previous</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>play_circle</mat-icon>
            </button>
            <button mat-icon-button>
              <mat-icon>skip_next</mat-icon>
            </button>
          </div>

          <div class="volume-control">
            <mat-icon>volume_up</mat-icon>
            <mat-slider>
              <input matSliderThumb [value]="50">
            </mat-slider>
          </div>
        </mat-toolbar>
      </div>
    </div>
  `,
  styles: [`
    .user-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .nav-links {
      margin-left: 20px;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
    .player-bar {
      border-top: 1px solid rgba(0,0,0,0.12);
    }
    .now-playing {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 300px;
    }
    .album-thumb {
      width: 40px;
      height: 40px;
      border-radius: 4px;
    }
    .track-info {
      display: flex;
      flex-direction: column;
    }
    .track-name {
      font-size: 14px;
      font-weight: 500;
    }
    .artist-name {
      font-size: 12px;
      color: rgba(0,0,0,0.6);
    }
    .player-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .volume-control {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .active {
      background: rgba(255,255,255,0.1);
    }
  `]
})
export class UserLayoutComponent {
  isAdmin$ = this.authService.currentUser$.pipe(
    map(user => user?.roles?.includes('ADMIN'))
  );

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  logout() {
    this.store.dispatch(AuthActions.logoutRequest());
  }
} 