import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';

import { PlayerActions } from '../../../store/player/player.actions';
import { selectCurrentSong, selectIsPlaying } from '../../../store/player/player.selectors';
import { selectFavoriteSongs } from '../../../store/song/song.selectors';
import { AppState } from '../../../store/app.state';
import * as SongActions from '../../../store/song/song.actions';
import { Song } from '../../../core/models/song.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-favorites',
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
    <div class="favorites-container">
      <mat-card class="favorites-header">
        <mat-card-content>
          <div class="header-content">
            <div class="header-text">
              <h1>Your Favorites</h1>
              <p>Songs you've marked as favorites</p>
            </div>
            <button mat-raised-button 
                    color="primary" 
                    class="play-all-button"
                    [disabled]="!(favoriteSongs$ | async)?.length"
                    (click)="playAllFavorites()">
              <mat-icon>play_arrow</mat-icon>
              Play All
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="songs-list">
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let song of favoriteSongs$ | async; let i = index" 
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
                    <div class="song-details">
                      <span class="song-artist">{{song.artist}}</span>
                      <span class="bullet">•</span>
                      <span class="album-title">{{song.albumTitle}}</span>
                    </div>
                  </div>
                  <div class="song-duration">{{formatDuration(song.duration)}}</div>
                </div>
                <div class="song-actions">
                  <button mat-icon-button (click)="playSong(song)">
                    <mat-icon>
                      {{isCurrentSong(song) && (isPlaying$ | async) ? 'pause' : 'play_arrow'}}
                    </mat-icon>
                  </button>
                  <button mat-icon-button 
                          [routerLink]="['/user/song-details', song.id]">
                    <mat-icon>info</mat-icon>
                  </button>
                  <button mat-icon-button 
                          color="warn"
                          (click)="toggleFavorite(song)">
                    <mat-icon>favorite</mat-icon>
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
    .favorites-container {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .favorites-header {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
    }

    .header-text {
      h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: #1a1a1a;
      }

      p {
        color: #666;
        margin: 8px 0 0;
      }
    }

    .play-all-button {
      height: 48px;
      padding: 0 24px;
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

    .song-details {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 0.9rem;
    }

    .bullet {
      font-size: 0.5rem;
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
  `]
})
export class UserFavoritesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  favoriteSongs$ = this.store.select(selectFavoriteSongs);
  isPlaying$ = this.store.select(selectIsPlaying);
  currentSong$ = this.store.select(selectCurrentSong);
  currentSongId: string | null = null;

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Loading favorites...');
    this.store.dispatch(SongActions.loadFavoriteSongs());

    this.favoriteSongs$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(songs => {
      console.log('Favorite songs:', songs);
    });

    // Track current song
    this.currentSong$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(song => {
      this.currentSongId = song?.id ?? null;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  playAllFavorites(): void {
    this.favoriteSongs$.pipe(take(1)).subscribe(songs => {
      if (songs?.length) {
        this.store.dispatch(PlayerActions.playAlbum({ songs }));
      }
    });
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
  }

  isCurrentSong(song: Song): boolean {
    return this.currentSongId === song.id;
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
}