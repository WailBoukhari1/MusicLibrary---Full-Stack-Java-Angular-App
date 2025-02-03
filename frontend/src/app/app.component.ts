import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';
import { AuthService } from './core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PlayerComponent } from './features/user/player/player.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, 
    MatSidenavModule, 
    PlayerComponent
  ],
  template: `
    <mat-sidenav-container>
      <!-- Your existing navigation -->
      <router-outlet></router-outlet>
      <app-player></app-player>
    </mat-sidenav-container>
  `,
  styles: [`
    .player-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    app-player {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit() {
    // Initialize auth state
    this.store.dispatch(AuthActions.init());
    
    // If we have a token, also get current user
    if (this.authService.getToken()) {
      this.store.dispatch(AuthActions.getCurrentUser());
    }
  }

  title = 'fontend';
}
