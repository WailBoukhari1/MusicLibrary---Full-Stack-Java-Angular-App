import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>User Management</h2>
      <!-- User list will go here -->
    </div>
  `
})
export class AdminUsersComponent {
} 