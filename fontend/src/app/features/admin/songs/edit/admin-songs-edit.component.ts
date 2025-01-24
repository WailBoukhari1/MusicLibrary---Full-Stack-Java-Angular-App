import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-songs-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Edit Song</h2>
      <!-- Song edit form will go here -->
    </div>
  `
})
export class AdminSongsEditComponent {
} 