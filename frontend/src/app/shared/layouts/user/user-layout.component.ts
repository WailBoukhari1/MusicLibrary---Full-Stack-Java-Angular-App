import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../../store/auth/auth.actions';
import { AuthService } from '../../../core/services/auth.service';
import { map } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { PlayerComponent } from '../../../features/user/player/player.component';

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
    MatSliderModule,
    RouterOutlet,
    PlayerComponent
  ],
  template: `
    <!-- Navbar -->
    <mat-toolbar color="primary" class="navbar">
      <a mat-button routerLink="/user/library">
        <mat-icon>music_note</mat-icon>
        Music App
      </a>
      
      <span class="spacer"></span>

      <nav>
        <a mat-button routerLink="/user/library" routerLinkActive="active">
          <mat-icon>library_music</mat-icon>
          Library
        </a>
        <a mat-button routerLink="/user/profile" routerLinkActive="active">
          <mat-icon>person</mat-icon>
          Profile
        </a>
        <ng-container *ngIf="isAdmin$ | async">
          <a mat-button routerLink="/admin" routerLinkActive="active">
            <mat-icon>admin_panel_settings</mat-icon>
            Admin
          </a>
        </ng-container>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Logout
        </button>
      </nav>
    </mat-toolbar>

    <!-- Main Content -->
    <div class="layout-container">
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Music App. All rights reserved.</p>
        <nav>
          <a mat-button>About</a>
          <a mat-button>Privacy</a>
          <a mat-button>Terms</a>
        </nav>
      </div>
    </footer>

    <!-- Player -->
    <app-player></app-player>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .spacer {
      flex: 1 1 auto;
    }

    nav a.active {
      background: rgba(255,255,255,0.1);
    }

    .layout-container {
      min-height: 100vh;
      padding: 64px 0 140px 0; // Toolbar height + player height + footer
    }

    .main-content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer {
      position: fixed;
      bottom: 90px; // Player height
      left: 0;
      right: 0;
      background: #f5f5f5;
      padding: 16px;
      z-index: 900;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-content p {
      margin: 0;
    }

    mat-toolbar a {
      margin: 0 8px;
      text-decoration: none;
      color: white;
    }

    mat-toolbar mat-icon {
      margin-right: 4px;
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
    this.store.dispatch(AuthActions.logout());
  }
} 