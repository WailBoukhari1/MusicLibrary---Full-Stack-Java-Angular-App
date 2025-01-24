import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>User Profile</h2>
    </div>
  `
})
export class UserProfileComponent {
} 