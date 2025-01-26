import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Song } from '../../../../core/models/song.model';
import { SongActions } from '../../../../store/song/song.actions';
import { selectAllSongs, selectSongsLoading, selectSongsError, selectSongsTotalElements } from '../../../../store/song/song.selectors';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PlayerActions } from '../../../../store/player/player.actions';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-song-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <mat-card class="song-list-container">
      <mat-card-header>
        <mat-card-title>Songs Management</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="onCreateSong()">
            <mat-icon>add</mat-icon>
            <span>Create New Song</span>
          </button>
        </div>

        <div *ngIf="loading$ | async" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>

        <div *ngIf="error$ | async as error" class="error-message">
          {{ error }}
        </div>

        <table mat-table [dataSource]="(songs$ | async) || []" class="song-table">
          <!-- Cover Column -->
          <ng-container matColumnDef="cover">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let song">
              <img [src]="getImageUrl(song.imageFileId)" 
                   [alt]="song.title" 
                   class="song-cover">
            </td>
          </ng-container>

          <!-- Title Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let song">{{ song.title }}</td>
          </ng-container>

          <!-- Artist Column -->
          <ng-container matColumnDef="artist">
            <th mat-header-cell *matHeaderCellDef>Artist</th>
            <td mat-cell *matCellDef="let song">{{ song.artist }}</td>
          </ng-container>

          <!-- Album Column -->
          <ng-container matColumnDef="album">
            <th mat-header-cell *matHeaderCellDef>Album</th>
            <td mat-cell *matCellDef="let song">{{ song.album }}</td>
          </ng-container>

          <!-- Duration Column -->
          <ng-container matColumnDef="duration">
            <th mat-header-cell *matHeaderCellDef>Duration</th>
            <td mat-cell *matCellDef="let song">{{ formatDuration(song.duration) }}</td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef></th>
            <td mat-cell *matCellDef="let song">
              <button mat-icon-button (click)="onEditSong(song.id)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="onDeleteSong(song.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator
          [length]="totalElements$ | async"
          [pageSize]="10"
          [pageSizeOptions]="[5, 10, 25, 100]"
          (page)="onPageChange($event)">
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .song-list-container {
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

    .loading-spinner {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    .error-message {
      color: red;
      margin: 10px 0;
      padding: 10px;
      background-color: #ffebee;
      border-radius: 4px;
    }

    .song-table {
      width: 100%;
      margin-bottom: 20px;
    }

    .song-cover {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
    }

    .mat-column-cover {
      width: 60px;
    }

    .mat-column-actions {
      width: 100px;
      text-align: right;
    }

    .mat-mdc-row:hover {
      background-color: #f5f5f5;
    }

    .mat-mdc-header-cell {
      font-weight: bold;
      color: rgba(0, 0, 0, 0.87);
    }
  `]
})
export class SongListComponent implements OnInit {
  songs$: Observable<Song[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalElements$: Observable<number>;
  displayedColumns = ['cover', 'title', 'artist', 'album', 'duration', 'actions'];

  constructor(
    private router: Router,
    private store: Store
  ) {
    this.songs$ = this.store.select(selectAllSongs);
    this.loading$ = this.store.select(selectSongsLoading);
    this.error$ = this.store.select(selectSongsError);
    this.totalElements$ = this.store.select(selectSongsTotalElements);
  }

  ngOnInit(): void {
    this.store.dispatch(SongActions.loadSongs({ page: 0, size: 10 }));
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(SongActions.loadSongs({ page: event.pageIndex, size: event.pageSize }));
  }

  playSong(song: Song): void {
    this.store.dispatch(PlayerActions.play({ song }));
  }

  addToQueue(song: Song): void {
    this.store.dispatch(PlayerActions.addToQueue({ song }));
  }

  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onCreateSong() {
    this.router.navigate(['/admin/songs/create']);
  }

  onEditSong(id: string) {
    this.router.navigate(['/admin/songs/edit', id]);
  }
  getImageUrl(coverUrl: string | null | undefined): string {
    if (!coverUrl) return 'assets/default-album.png';
    return `${environment.apiUrl}/files/${coverUrl}`;
  }
  onDeleteSong(id: string) {
    if (confirm('Are you sure you want to delete this song?')) {
      this.store.dispatch(SongActions.deleteSong({ id: Number(id) }));
    }
  }
} 