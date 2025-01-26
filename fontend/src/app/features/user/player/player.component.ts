import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PlayerActions } from '../../../store/player/player.actions';
import { Song } from '../../../core/models/song.model';
import { selectCurrentSong, selectIsPlaying, selectVolume, selectProgress } from '../../../store/player/player.selectors';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule,
    MatSliderModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatMenuModule
  ],
  template: `
    <div class="player-container" *ngIf="currentSong$ | async as song">
      <div class="song-info">
        <img [src]="song.coverUrl || 'assets/default-cover.png'" alt="Song cover" class="cover-image">
        <div class="text-info">
          <div class="title">{{ song.title }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
      </div>

      <div class="controls">
        <button mat-icon-button (click)="onPrevious()">
          <mat-icon>skip_previous</mat-icon>
        </button>

        <button mat-icon-button (click)="onPlayPause()">
          <mat-icon>{{ (isPlaying$ | async) ? 'pause' : 'play_arrow' }}</mat-icon>
        </button>

        <button mat-icon-button (click)="onNext()">
          <mat-icon>skip_next</mat-icon>
        </button>
      </div>

      <div class="progress-container">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <mat-slider class="progress-slider" [max]="100" [step]="0.1">
          <input matSliderThumb [ngModel]="currentProgress" (ngModelChange)="onSeek($event)">
        </mat-slider>
        <span class="time">{{ formatTime(duration) }}</span>
      </div>

      <div class="volume-container">
        <mat-icon>{{ currentVolume > 0 ? 'volume_up' : 'volume_off' }}</mat-icon>
        <mat-slider class="volume-slider" [max]="1" [step]="0.01">
          <input matSliderThumb [ngModel]="currentVolume" (ngModelChange)="onVolumeChange($event)">
        </mat-slider>
      </div>
    </div>
  `,
  styles: [`
    .player-container {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #1a1a1a;
      color: white;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 90px;
      z-index: 1000;
    }

    .song-info {
      display: flex;
      align-items: center;
      width: 300px;
      gap: 12px;
    }

    .cover-image {
      width: 56px;
      height: 56px;
      border-radius: 4px;
      object-fit: cover;
    }

    .text-info {
      .title {
        font-weight: 500;
        margin-bottom: 4px;
      }
      .artist {
        font-size: 0.9em;
        color: #b3b3b3;
      }
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: 0 32px;
    }

    .progress-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;

      .time {
        font-size: 0.8em;
        color: #b3b3b3;
        width: 45px;
        text-align: center;
      }

      .progress-slider {
        flex: 1;
      }
    }

    .volume-container {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 150px;
      margin-left: 16px;

      .volume-slider {
        flex: 1;
      }
    }
  `]
})
export class PlayerComponent implements OnInit {
  currentSong$: Observable<Song | null>;
  isPlaying$: Observable<boolean>;
  volume$: Observable<number>;
  progress$: Observable<number>;
  currentTime = 0;
  duration = 0;
  currentVolume = 1;
  currentProgress = 0;

  constructor(private store: Store) {
    this.currentSong$ = this.store.select(selectCurrentSong);
    this.isPlaying$ = this.store.select(selectIsPlaying);
    this.volume$ = this.store.select(selectVolume);
    this.progress$ = this.store.select(selectProgress);
    
    // Subscribe to volume and progress changes
    this.volume$.subscribe(volume => {
      this.currentVolume = volume || 1;
    });
    
    this.progress$.subscribe(progress => {
      this.currentProgress = progress || 0;
      if (this.duration) {
        this.currentTime = (progress / 100) * this.duration;
      }
    });
  }

  ngOnInit(): void {}

  onPlayPause(): void {
    this.isPlaying$.subscribe(isPlaying => {
      if (isPlaying) {
        this.store.dispatch(PlayerActions.pause());
      } else {
        this.store.dispatch(PlayerActions.resume());
      }
    }).unsubscribe();
  }

  onPrevious(): void {
    this.store.dispatch(PlayerActions.skipPrevious());
  }

  onNext(): void {
    this.store.dispatch(PlayerActions.skipNext());
  }

  onSeek(event: any): void {
    this.store.dispatch(PlayerActions.setProgress({ progress: event }));
  }

  onVolumeChange(event: any): void {
    this.store.dispatch(PlayerActions.setVolume({ volume: event }));
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
} 