import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-library',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>My Library</h2>
    </div>
  `
})
export class UserLibraryComponent {
} 