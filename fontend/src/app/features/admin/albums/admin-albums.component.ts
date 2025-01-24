import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-albums',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Album Management</h2>
    </div>
  `
})
export class AdminAlbumsComponent {
} 