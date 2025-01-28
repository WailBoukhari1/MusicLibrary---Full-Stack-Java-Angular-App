import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AlbumListComponent } from './album-list/album-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin-albums',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AlbumListComponent, MatToolbarModule],
  template: `
    <div class="albums-admin-container">
      <mat-toolbar color="primary" class="page-header">
        <h1>Album Management</h1>
      </mat-toolbar>
      
      <div class="content-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .albums-admin-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;
    }

    .page-header {
      padding: 0 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      h1 {
        font-size: 24px;
        font-weight: 500;
        margin: 0;
      }
    }

    .content-container {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  `]
})
export class AdminAlbumsComponent {} 