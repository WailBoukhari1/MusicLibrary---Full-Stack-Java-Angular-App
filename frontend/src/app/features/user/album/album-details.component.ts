import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { environment } from '../../../../environments/environment';

import { Album } from '../../../core/models/album.model';
import { Song } from '../../../core/models/song.model';
import { AlbumService } from '../../../core/services/album.service';
import { PlayerActions } from '../../../store/player/player.actions';
import { selectCurrentTrack, selectIsPlaying } from '../../../store/player/player.selectors';

@Component({
  selector: 'app-album-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="album-details" *ngIf="album">
      <div class="album-header">
        <img [src]="getImageUrl(album.imageUrl)" [alt]="album.title">
        <div class="album-info">
          <h1>{{album.title}}</h1>
          <p class="artist">{{album.artist}}</p>
          <p class="metadata">
            <span class="category">{{album.category}}</span>
            <span class="genre">{{album.genre}}</span>
            <span class="year">{{album.releaseDate | date:'yyyy'}}</span>
          </p>
          <button mat-raised-button color="primary" (click)="playAlbum(album)">
            <mat-icon>{{(isCurrentAlbum && (isPlaying$ | async)) ? 'pause' : 'play_arrow'}}</mat-icon>
            {{(isCurrentAlbum && (isPlaying$ | async)) ? 'PAUSE' : 'PLAY'}}
          </button>
        </div>
      </div>

      <table mat-table [dataSource]="album.songs" class="songs-table">
        <ng-container matColumnDef="play">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let song">
            <button mat-icon-button (click)="playSong(song)">
              <mat-icon>
                {{(isCurrentSong(song) && (isPlaying$ | async)) ? 'pause' : 'play_arrow'}}
              </mat-icon>
            </button>
          </td>
        </ng-container>

        <ng-container matColumnDef="trackNumber">
          <th mat-header-cell *matHeaderCellDef>No.</th>
          <td mat-cell *matCellDef="let song">{{song.trackNumber}}</td>
        </ng-container>

        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let song">{{song.title}}</td>
        </ng-container>

        <ng-container matColumnDef="duration">
          <th mat-header-cell *matHeaderCellDef>Duration</th>
          <td mat-cell *matCellDef="let song">{{formatDuration(song.duration)}}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"
            [class.active]="isCurrentSong(row)"></tr>
      </table>
    </div>
  `,
  styles: [`
    .album-details {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .album-header {
      display: flex;
      gap: 20px;
      margin-bottom: 40px;
    }
    .album-header img {
      width: 300px;
      height: 300px;
      object-fit: cover;
    }
    .album-info {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 10px;
    }
    .songs-table {
      width: 100%;
    }
    .mat-mdc-row.active {
      background: rgba(0,0,0,0.05);
    }
  `]
})
export class AlbumDetailsComponent implements OnInit {
  album: Album | null = null;
  isPlaying$ = this.store.select(selectIsPlaying);
  currentTrack$ = this.store.select(selectCurrentTrack);
  currentTrackId: string | null = null;
  isCurrentAlbum = false;
  displayedColumns = ['play', 'trackNumber', 'title', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
    private store: Store
  ) {}

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.albumService.getAlbumById(albumId).subscribe(response => {
        if (response.success && response.data) {
          this.album = response.data;
        }
      });
    }

    this.currentTrack$.subscribe(track => {
      this.currentTrackId = track?.id || null;
      this.isCurrentAlbum = track?.albumId === this.album?.id;
    });
  }

  playAlbum(album: Album) {
    if (this.isCurrentAlbum) {
      this.store.dispatch(PlayerActions.togglePlay());
    } else {
      this.store.dispatch(PlayerActions.playAlbum({ album }));
    }
  }

  playSong(song: Song) {
    if (this.isCurrentSong(song)) {
      this.store.dispatch(PlayerActions.togglePlay());
    } else {
      this.store.dispatch(PlayerActions.play({ song }));
    }
  }

  isCurrentSong(song: Song): boolean {
    return song.id === this.currentTrackId;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getImageUrl(imageUrl: string | undefined): string {
    return imageUrl ? `${environment.apiUrl}/files/${imageUrl}` : 'assets/default-cover.png';
  }
} 