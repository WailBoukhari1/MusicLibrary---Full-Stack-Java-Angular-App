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
    <div class="layout-container">
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-player></app-player>
    </div>
  `,
  styles: [`
    .layout-container {
      min-height: 100vh;
      padding-bottom: 90px; // Height of the player
    }

    .main-content {
      padding: 20px;
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