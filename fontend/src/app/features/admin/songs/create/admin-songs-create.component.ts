import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-songs-create',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Upload New Song</h2>
      <!-- Song upload form will go here -->
    </div>
  `
})
export class AdminSongsCreateComponent {
} 