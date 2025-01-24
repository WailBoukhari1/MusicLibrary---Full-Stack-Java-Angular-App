import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-songs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Song Management</h2>
      <div class="actions">
        <button class="btn btn-primary">Upload New Song</button>
      </div>
      <!-- Add song list with edit/delete actions -->
    </div>
  `
})
export class AdminSongsComponent {
  // Add CRUD operations for songs
} 