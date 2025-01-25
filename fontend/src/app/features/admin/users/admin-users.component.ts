import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, UserListComponent],
  template: `
       <div class="container">
      <h2>Users Management</h2>
      <app-user-list></app-user-list>
    </div>
  `
})
export class AdminUsersComponent {} 