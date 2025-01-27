import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Album } from '../../../../core/models/album.model';
import * as AlbumActions from '../../../../store/album/album.actions';
import { selectAllAlbums, selectAlbumLoading, selectAlbumError, selectTotalElements } from '../../../../store/album/album.selectors';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-album-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <mat-card class="container">
      <mat-card-header>
        <mat-card-title>Albums Management</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="onCreateAlbum()">
            <mat-icon>add</mat-icon>
            <span>Create New Album</span>
          </button>
        </div>

        <div class="loading-shade" *ngIf="loading$ | async">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="error$ | async as error" class="error-message">
          {{ error }}
        </div>

        <table mat-table [dataSource]="(albums$ | async) || []" class="album-table">
          <!-- Cover Column -->
          <ng-container matColumnDef="imageUrl">
            <th mat-header-cell *matHeaderCellDef>Cover</th>
            <td mat-cell *matCellDef="let album">
              <img [src]="getImageUrl(album.imageUrl)" 
                   [alt]="album.title" 
                   class="album-cover">
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let album">{{album.title}}</td>
          </ng-container>

          <!-- Artist Column -->
          <ng-container matColumnDef="artist">
            <th mat-header-cell *matHeaderCellDef>Artist</th>
            <td mat-cell *matCellDef="let album">{{album.artist}}</td>
          </ng-container>

          <!-- Release Date Column -->
          <ng-container matColumnDef="releaseDate">
            <th mat-header-cell *matHeaderCellDef>Release Date</th>
            <td mat-cell *matCellDef="let album">{{album.releaseDate | date}}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let album">
              <button mat-icon-button color="primary" (click)="onEdit(album)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDelete(album)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="(total$ | async) || 0"
          [pageSize]="pageSize"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .container {
      margin: 20px;
    }

    .actions {
      margin: 20px 0;
      display: flex;
      justify-content: flex-start;
    }

    .actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .loading-shade {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.15);
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .error-message {
      color: red;
      margin: 10px 0;
      padding: 10px;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .album-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .album-cover {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
    }

    .mat-column-imageUrl {
      width: 80px;
    }

    .mat-column-actions {
      width: 100px;
      text-align: right;
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }
  `]
})
export class AlbumListComponent implements OnInit {
  albums$: Observable<Album[]> = this.store.select(selectAllAlbums);
  loading$ = this.store.select(selectAlbumLoading);
  error$ = this.store.select(selectAlbumError);
  total$ = this.store.select(selectTotalElements);

  pageSize = 10;
  displayedColumns = ['imageUrl', 'title', 'artist', 'releaseDate', 'actions'];

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.store.dispatch(AlbumActions.loadAlbums());
  }

  onCreateAlbum() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  onEdit(album: Album) {
    this.router.navigate(['edit', album.id], { relativeTo: this.route });
  }

  onDelete(album: Album) {
    const songCount = album.songs?.length || 0;
    const message = songCount > 0 
      ? `This will also delete ${songCount} song${songCount > 1 ? 's' : ''} associated with this album. Are you sure?`
      : 'Are you sure you want to delete this album?';

    if (confirm(message)) {
      this.store.dispatch(AlbumActions.deleteAlbum({ id: album.id }));
    }
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.loadAlbums();
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return 'assets/images/default-album.png';
    }
    return `${environment.apiUrl}/files/${imageUrl}`;
  }
} 