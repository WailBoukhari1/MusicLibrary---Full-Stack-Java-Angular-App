import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <mat-card>
      <mat-card-content>
        <div class="loading-shade" *ngIf="isLoading">
          <mat-spinner></mat-spinner>
        </div>

        <table mat-table [dataSource]="users" class="mat-elevation-z8">
          
          <!-- Username Column -->
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef> Username </th>
            <td mat-cell *matCellDef="let user"> 
              {{user.username}}
              <mat-icon *ngIf="!user.active" 
                       class="inactive-user" 
                       matTooltip="Inactive User">
                block
              </mat-icon>
            </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let user"> {{user.email}} </td>
          </ng-container>

          <!-- Roles Column -->
          <ng-container matColumnDef="roles">
            <th mat-header-cell *matHeaderCellDef> Roles </th>
            <td mat-cell *matCellDef="let user">
              <mat-select [value]="user.roles" multiple 
                         (selectionChange)="updateRoles(user, $event.value)"
                         [disabled]="isUpdating">
                <mat-option value="ADMIN">Admin</mat-option>
                <mat-option value="USER">User</mat-option>
              </mat-select>
            </td>
          </ng-container>

          <!-- Created At Column -->
          <ng-container matColumnDef="createdAt">
            <th mat-header-cell *matHeaderCellDef> Created At </th>
            <td mat-cell *matCellDef="let user"> {{user.createdAt | date}} </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="warn" 
                      (click)="deleteUser(user)"
                      [disabled]="isUpdating">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [length]="totalElements"
                      [pageSize]="pageSize"
                      [pageSizeOptions]="[5, 10, 25, 100]"
                      (page)="onPageChange($event)"
                      aria-label="Select page">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 80px;
      text-align: center;
    }

    .mat-column-roles {
      width: 200px;
    }

    mat-card {
      margin: 20px;
    }

    mat-select {
      width: 180px;
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .inactive-user {
      font-size: 16px;
      height: 16px;
      width: 16px;
      margin-left: 8px;
      vertical-align: middle;
      color: #999;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'roles', 'createdAt', 'actions'];
  isLoading = false;
  isUpdating = false;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<User>;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers(this.currentPage, this.pageSize)
      .pipe(
        catchError(error => {
          this.showError('Failed to load users');
          return of({ success: false, data: { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 } });
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(response => {
        if (response.success) {
          this.users = response.data.content;
          this.totalElements = response.data.totalElements;
        }
      });
  }

  updateRoles(user: User, newRoles: string[]) {
    this.isUpdating = true;
    this.userService.updateUserRoles(user.id, newRoles)
      .pipe(
        catchError(error => {
          this.showError('Failed to update user roles');
          return of({ success: false, data: user });
        }),
        finalize(() => this.isUpdating = false)
      )
      .subscribe(response => {
        if (response.success) {
          this.showSuccess('User roles updated successfully');
          const index = this.users.findIndex(u => u.id === user.id);
          if (index !== -1) {
            this.users[index] = { ...user, roles: newRoles };
            this.table.renderRows();
          }
        }
      });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.isUpdating = true;
      this.userService.deleteUser(user.id)
        .pipe(
          catchError(error => {
            this.showError('Failed to delete user');
            return of({ success: false, data: user });
          }),
          finalize(() => this.isUpdating = false)
        )
        .subscribe(response => {
          if (response.success) {
            this.showSuccess('User deleted successfully');
            this.loadUsers(); // Reload the entire list
          }
        });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
