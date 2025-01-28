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
  templateUrl:"user-list.component.html"
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

  onPageChange(event: PageEvent): void {
    // Handle page change event
    // You might want to load data for the new page here
  }
}
