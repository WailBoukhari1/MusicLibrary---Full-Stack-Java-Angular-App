import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { AuthActions } from '../../../store/auth/auth.actions';
import { PlayerComponent } from '../../../features/user/player/player.component';
import { AuthService } from '../../../core/services/auth.service';
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
    MatDividerModule,
    PlayerComponent
  ],
  templateUrl: "user-layout.component.html",
  styles: [`
    :host {
      display: block;
    }
    
    .mat-toolbar {
      background: transparent;
    }
  `]
})
export class UserLayoutComponent implements OnInit {
  currentUser$ = this.store.select(selectUser);
  
  isAdmin$ = this.authService.currentUser$.pipe(
    map(() => this.authService.isAdmin())
  );

  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.store.dispatch(AuthActions.getCurrentUser());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}