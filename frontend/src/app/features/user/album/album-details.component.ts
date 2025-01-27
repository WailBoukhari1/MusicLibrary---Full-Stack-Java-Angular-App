import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { take, takeUntil, map } from 'rxjs/operators';

import { PlayerActions } from '../../../store/player/player.actions';
import { selectCurrentAlbum } from '../../../store/album/album.selectors';
import { selectCurrentSong, selectIsPlaying } from '../../../store/player/player.selectors';
import { AppState } from '../../../store/app.state';
import * as AlbumActions from '../../../store/album/album.actions';
import * as SongActions from '../../../store/song/song.actions';
import { Album } from '../../../core/models/album.model';
import { Song } from '../../../core/models/song.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-album-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    RouterModule
  ],
  template: `
    <div class="album-details" *ngIf="album$ | async as album">
      <div class="album-header">
        <mat-card class="album-info">
          <div class="album-cover-container">
            <img [src]="getImageUrl(album.imageUrl)" 
                 [alt]="album.title" 
                 class="album-cover"
                 (error)="onImageError($event)">
          </div>
          <mat-card-content>
            <div class="album-text">
              <h1 class="album-title">{{album.title}}</h1>
              <h2 class="album-artist">{{album.artist}}</h2>
              <div class="album-meta">
                <span class="meta-item">
                  <mat-icon>album</mat-icon>
                  {{album.category}}
                </span>
                <span class="meta-item">
                  <mat-icon>music_note</mat-icon>
                  {{album.genre}}
                </span>
                <span class="meta-item">
                  <mat-icon>calendar_today</mat-icon>
                  {{album.releaseDate | date:'yyyy'}}
                </span>
                <span class="meta-item">
                  <mat-icon>queue_music</mat-icon>
                  {{album.songs?.length || 0}} songs
                </span>
              </div>
              <button mat-raised-button color="primary" 
                      class="play-button"
                      [disabled]="!album.songs?.length"
                      (click)="playAlbum(album)">
                <mat-icon>
                  {{isCurrentAlbum(album) && (isPlaying$ | async) ? 'pause' : 'play_arrow'}}
                </mat-icon>
                {{isCurrentAlbum(album) && (isPlaying$ | async) ? 'Pause' : 'Play Album'}}
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="songs-list">
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let song of album.songs; let i = index" 
                          class="song-item"
                          [class.playing]="isCurrentSong(song)">
              <div class="song-item-content">
                <div class="song-info">
                  <span class="track-number">{{(i + 1).toString().padStart(2, '0')}}</span>
                  <img [src]="getImageUrl(song.imageUrl)" 
                       class="song-thumbnail"
                       (error)="onImageError($event)">
                  <div class="song-text">
                    <div class="song-title">{{song.title}}</div>
                    <div class="song-artist">{{song.artist}}</div>
                  </div>
                  <div class="song-duration">{{formatDuration(song.duration)}}</div>
                </div>
                <div class="song-actions">
                  <button mat-icon-button (click)="playSong(song)">
                    <mat-icon>
                      {{isCurrentSong(song) && (isPlaying$ | async) ? 'pause' : 'play_arrow'}}
                    </mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/user/song-details', song.id]">
                    <mat-icon>info</mat-icon>
                  </button>
                  <button mat-icon-button 
                          [color]="isFavorite(song) ? 'warn' : ''"
                          (click)="toggleFavorite(song); $event.stopPropagation()">
                    <mat-icon>
                      {{isFavorite(song) ? 'favorite' : 'favorite_border'}}
                    </mat-icon>
                  </button>
                </div>
              </div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .album-details {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .album-header {
      position: relative;
      padding-top: 24px;
    }

    .album-info {
      display: flex;
      gap: 32px;
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .album-cover-container {
      flex-shrink: 0;
      width: 300px;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .album-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }

    .album-text {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .album-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 0;
      color: #1a1a1a;
    }

    .album-artist {
      font-size: 1.5rem;
      font-weight: 500;
      margin: 0;
      color: #666;
    }

    .album-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 0.9rem;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .play-button {
      margin-top: 16px;
      width: fit-content;
      padding: 0 24px;
      height: 48px;
      font-size: 1.1rem;

      mat-icon {
        margin-right: 8px;
      }
    }

    .songs-list {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .song-item {
      border-bottom: 1px solid #eee;
      
      &:hover {
        background: #f8f8f8;
      }

      &.playing {
        background: #e3f2fd;
      }
    }

    .song-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 12px;
    }

    .song-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .track-number {
      color: #666;
      font-size: 0.9rem;
      width: 24px;
    }

    .song-thumbnail {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      object-fit: cover;
    }

    .song-text {
      flex: 1;
    }

    .song-title {
      font-weight: 500;
      color: #1a1a1a;
    }

    .song-artist {
      font-size: 0.9rem;
      color: #666;
    }

    .song-duration {
      color: #666;
      font-size: 0.9rem;
      margin-right: 16px;
    }

    .song-actions {
      display: flex;
      gap: 8px;
    }

    .song-actions button[color="warn"] {
      color: #f44336;
    }
  `]
})
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  album$ = this.store.select(selectCurrentAlbum).pipe(
    map(album => {
      if (!album) return null;
      // Deduplicate songs based on ID
      const uniqueSongs = album.songs ? 
        [...new Map(album.songs.map(song => [song.id, song])).values()] : 
        [];
      return {
        ...album,
        songs: uniqueSongs
      };
    })
  );
  isPlaying$ = this.store.select(selectIsPlaying);
  currentSong$ = this.store.select(selectCurrentSong);
  currentSongId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.store.dispatch(AlbumActions.loadAlbum({ id: albumId }));
    }

    this.currentSong$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(song => {
      this.currentSongId = song?.id ?? null;
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(AlbumActions.clearSelectedAlbum());
    this.destroy$.next();
    this.destroy$.complete();
  }

  playAlbum(album: Album): void {
    // Deduplicate songs before playing
    const uniqueSongs = album.songs ? 
      [...new Map(album.songs.map(song => [song.id, song])).values()] : 
      [];

    if (uniqueSongs.length) {
      if (this.isCurrentAlbum(album)) {
        this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
          if (isPlaying) {
            this.store.dispatch(PlayerActions.pause());
          } else {
            this.store.dispatch(PlayerActions.playAlbum({ songs: uniqueSongs }));
          }
        });
      } else {
        this.store.dispatch(PlayerActions.playAlbum({ songs: uniqueSongs }));
      }
    }
  }

  playSong(song: Song): void {
    if (this.isCurrentSong(song)) {
      this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
        if (isPlaying) {
          this.store.dispatch(PlayerActions.pause());
        } else {
          this.store.dispatch(PlayerActions.play({ song }));
        }
      });
    } else {
      this.store.dispatch(PlayerActions.play({ song }));
    }
  }

  toggleFavorite(song: Song): void {
    const updatedSong = { ...song, isFavorite: !song.isFavorite };
    this.store.dispatch(SongActions.toggleFavorite({ song: updatedSong }));

    // Update the song in the current album immediately
    this.album$ = this.album$.pipe(
      map(album => {
        if (!album) return null;
        return {
          ...album,
          songs: album.songs?.map(s => 
            s.id === song.id ? { ...s, isFavorite: !s.isFavorite } : s
          ) ?? []
        };
      })
    );
  }

  isCurrentSong(song: Song): boolean {
    return this.currentSongId === song.id;
  }

  isCurrentAlbum(album: Album): boolean {
    return album.songs?.some(song => song.id === this.currentSongId) ?? false;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-album.png';
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/default-album.png';
    return imageUrl.startsWith('http') ? 
      imageUrl : 
      `${environment.apiUrl}/files/${imageUrl}`;
  }

  formatDuration(seconds: number | undefined): string {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  isFavorite(song: Song): boolean {
    return song.isFavorite ?? false;
  }
} 