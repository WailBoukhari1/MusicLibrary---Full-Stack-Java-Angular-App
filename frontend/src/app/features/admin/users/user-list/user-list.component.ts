import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { UserActions } from '../../../../store/user/user.actions';
import { 
  selectUsers,
  selectUserLoading,
  selectUserError,
  selectUserTotalElements
} from '../../../../store/user/user.selectors';
import { User } from '../../../../core/models/user.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  template: `
    <mat-card class="users-container">
      <mat-card-header>
        <mat-card-title>Users Management</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="loading$ | async" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="error$ | async as error" class="error-message">
          {{ error }}
        </div>

        <table mat-table [dataSource]="dataSource" class="user-table">
          <!-- Username Column -->
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Username</th>
            <td mat-cell *matCellDef="let user">{{ user.username }}</td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let user">{{ user.email }}</td>
          </ng-container>

          <!-- Roles Column -->
          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef>Roles</th>
            <td mat-cell *matCellDef="let user">{{ user.roles.join(', ') }}</td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let user">
              <span [class.active]="user.active" [class.inactive]="!user.active">
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let user">
              <!-- Role Menu -->
              <button mat-icon-button [matMenuTriggerFor]="roleMenu">
                <mat-icon>admin_panel_settings</mat-icon>
              </button>
              <mat-menu #roleMenu="matMenu">
                <div (click)="$event.stopPropagation()" class="role-menu-content">
                  <mat-checkbox
                    [checked]="user.roles.includes('USER')"
                    (change)="toggleRole(user, 'USER', $event.checked)">
                    User
                  </mat-checkbox>
                  <mat-checkbox
                    [checked]="user.roles.includes('ADMIN')"
                    (change)="toggleRole(user, 'ADMIN', $event.checked)">
                    Admin
                  </mat-checkbox>
                </div>
              </mat-menu>

              <!-- Status Toggle -->
              <button mat-icon-button 
                      [color]="user.active ? 'warn' : 'primary'"
                      [matTooltip]="user.active ? 'Deactivate User' : 'Activate User'"
                      (click)="onToggleUserStatus(user)">
                <mat-icon>{{ user.active ? 'person_off' : 'person' }}</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalElements$ | async"
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .users-container {
      margin: 20px;
    }

    .user-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .error-message {
      color: red;
      margin: 10px 0;
      padding: 10px;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .active {
      color: green;
    }

    .inactive {
      color: red;
    }

    .mat-column-actions {
      width: 80px;
      text-align: right;
    }

    .role-menu-content {
      padding: 8px 16px;
    }
    .role-menu-content mat-checkbox {
      display: block;
      margin: 8px 0;
    }
  `]
})
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  dataSource = new MatTableDataSource<User>([]);
  users$ = this.store.select(selectUsers);
  loading$ = this.store.select(selectUserLoading);
  error$ = this.store.select(selectUserError);
  totalElements$ = this.store.select(selectUserTotalElements);
  displayedColumns = ['username', 'email', 'roles', 'status', 'actions'];

  constructor(private store: Store) {
    this.users$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(users => {
      console.log('Received users:', users);
      this.dataSource.data = users || [];
    });
  }

  ngOnInit(): void {
    console.log('Component initialized');
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    console.log('Dispatching loadUsers action');
    this.store.dispatch(UserActions.loadUsers());
  }

  onPageChange(event: PageEvent): void {
    // Pagination is handled on the frontend since backend doesn't support it
    // You might want to implement client-side pagination here
  }

  onEditUser(userId: string): void {
    // Implement edit user logic
  }

  onToggleUserStatus(user: User): void {
    const message = user.active ? 'deactivate' : 'activate';
    if (confirm(`Are you sure you want to ${message} this user?`)) {
      this.store.dispatch(UserActions.toggleUserStatus({ userId: user.id }));
    }
  }

  toggleRole(user: User, role: string, checked: boolean): void {
    const newRoles = checked 
      ? [...user.roles, role]
      : user.roles.filter(r => r !== role);
    
    this.store.dispatch(UserActions.updateUserRole({ 
      userId: user.id, 
      roles: newRoles 
    }));
  }
}
