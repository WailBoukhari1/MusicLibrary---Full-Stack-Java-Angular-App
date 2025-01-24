import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserModel } from '../../../core/auth/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div class="admin-cards">
        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>album</mat-icon>
              Albums Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage your music albums catalog</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/albums">
              Manage Albums
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>music_note</mat-icon>
              Songs Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage your songs collection</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/songs">
              Manage Songs
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card>
          <mat-card-header>
            <mat-card-title>
              <mat-icon>people</mat-icon>
              Users Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage user accounts and permissions</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/users">
              Manage Users
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      padding: 2rem;
    }
    h1 {
      margin-bottom: 2rem;
      color: #333;
    }
    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    mat-card {
      height: 100%;
    }
    mat-card-header {
      margin-bottom: 1rem;
    }
    mat-icon {
      margin-right: 0.5rem;
    }
    mat-card-actions {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: UserModel | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      response => {
        if (response.success && response.data) {
          this.currentUser = response.data;
        }
      }
    );
  }
} 