import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { AuthActions } from '../../../store/auth/auth.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <nav class="bg-white dark:bg-gray-800 shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and main nav -->
          <div class="flex items-center space-x-8">
            <a routerLink="/user/home" class="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              MusicApp
            </a>
            
            <div class="hidden md:flex space-x-4">
              <a *ngFor="let link of navLinks" 
                 [routerLink]="link.path"
                 routerLinkActive="text-indigo-600 dark:text-indigo-400"
                 class="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                {{ link.label }}
              </a>
            </div>
          </div>

          <!-- User menu -->
          <div class="flex items-center space-x-4">
            <button mat-icon-button [matMenuTriggerFor]="menu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="onLogout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class UserNavbarComponent {
  user$ = this.store.select(selectUser);
  
  navLinks = [
    { path: '/user/home', label: 'Home' },
    { path: '/user/library', label: 'Library' },
    { path: '/user/favorites', label: 'Favorites' }
  ];

  constructor(private store: Store) {}

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
} 