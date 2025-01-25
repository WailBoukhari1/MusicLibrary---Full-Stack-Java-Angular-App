import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlbumListComponent } from './album-list/album-list.component';

@Component({
  selector: 'app-admin-albums',
  standalone: true,
  imports: [CommonModule, AlbumListComponent],
  template: `
    <div>
      <h2>Album Management</h2>
      <app-album-list></app-album-list>
    </div>
  `
})
export class AdminAlbumsComponent {
} 