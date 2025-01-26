import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongListComponent } from './song-list/song-list.component';

@Component({
  selector: 'app-admin-songs',
  standalone: true,
  imports: [CommonModule, SongListComponent],
  template: `
    <div>
      <h2>Song Management</h2>
  
      <app-song-list></app-song-list>
    </div>
  `
})
export class AdminSongsComponent {
} 