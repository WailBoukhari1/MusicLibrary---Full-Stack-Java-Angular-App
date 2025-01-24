import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Edit User</h2>
      <!-- User edit form will go here -->
    </div>
  `
})
export class AdminUsersEditComponent {
} 