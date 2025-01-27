import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerActions } from '../../../store/player/player.actions';
import { 
  selectCurrentSong, 
  selectIsPlaying,
  selectVolume,
  selectCanSkipNext,
  selectCanSkipPrevious
} from '../../../store/player/player.selectors';
import { Song } from '../../../core/models/song.model';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../../core/services/audio.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSliderModule,
    FormsModule
  ],
  template: `
    <mat-toolbar *ngIf="currentTrack$ | async as track" class="player">
      <div class="track-info">
        <img [src]="getImageUrl(track.imageUrl)" [alt]="track.title">
        <div class="details">
          <span class="title">{{track.title}}</span>
          <span class="artist">{{track.artist}}</span>
        </div>
      </div>

      <div class="controls">
        <div class="buttons">
          <button mat-icon-button 
                  [disabled]="!(canSkipPrevious$ | async)"
                  (click)="skipPrevious()">
            <mat-icon>skip_previous</mat-icon>
          </button>
          <button mat-icon-button class="play-button" (click)="togglePlay()">
            <mat-icon>{{(isPlaying$ | async) ? 'pause' : 'play_arrow'}}</mat-icon>
          </button>
          <button mat-icon-button 
                  [disabled]="!(canSkipNext$ | async)"
                  (click)="skipNext()">
            <mat-icon>skip_next</mat-icon>
          </button>
        </div>
        
        <div class="progress-container">
          <span class="time">{{formatTime(currentTime)}}</span>
          <mat-slider class="progress-bar">
            <input matSliderThumb
                   [max]="duration"
                   [step]="1"
                   [value]="currentTime"
                   (valueChange)="seek($event)">
          </mat-slider>
          <span class="time">{{formatTime(duration)}}</span>
        </div>
      </div>

      <div class="volume-control">
        <button mat-icon-button (click)="toggleMute()">
          <mat-icon>{{isMuted ? 'volume_off' : 'volume_up'}}</mat-icon>
        </button>
        <mat-slider class="volume-slider">
          <input matSliderThumb
                 [max]="100"
                 [step]="1"
                 [value]="volume"
                 (valueChange)="setVolume($event)">
        </mat-slider>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .player {
      height: 90px;
      background: #fff;
      border-top: 1px solid #ddd;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    .track-info {
      display: flex;
      align-items: center;
      width: 300px;
      img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        margin-right: 12px;
      }
      .details {
        display: flex;
        flex-direction: column;
        .title {
          font-weight: 500;
        }
        .artist {
          font-size: 0.9em;
          color: #666;
        }
      }
    }

    .controls {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      max-width: 600px;
      
      .buttons {
        display: flex;
        align-items: center;
        gap: 16px;
        .play-button {
          transform: scale(1.2);
        }
      }

      .progress-container {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        
        .progress-bar {
          flex: 1;
        }
        
        .time {
          font-size: 0.8em;
          color: #666;
          min-width: 40px;
          text-align: center;
        }
      }
    }

    .volume-control {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 200px;
      
      .volume-slider {
        width: 100px;
      }
    }
  `]
})
export class PlayerComponent implements OnInit, OnDestroy {
  currentTrack$: Observable<Song | null>;
  isPlaying$: Observable<boolean>;
  canSkipNext$ = this.store.select(selectCanSkipNext);
  canSkipPrevious$ = this.store.select(selectCanSkipPrevious);
  private destroy$ = new Subject<void>();
  
  currentTime = 0;
  duration = 0;
  volume = 100;
  isMuted = false;
  private lastVolume = 100;

  constructor(
    private store: Store,
    private audioService: AudioService
  ) {
    this.currentTrack$ = this.store.select(selectCurrentSong);
    this.isPlaying$ = this.store.select(selectIsPlaying);
  }

  ngOnInit() {
    this.audioService.currentTime$.pipe(takeUntil(this.destroy$))
      .subscribe(time => this.currentTime = time);

    this.audioService.duration$.pipe(takeUntil(this.destroy$))
      .subscribe(duration => this.duration = duration);

    this.store.select(selectVolume).pipe(takeUntil(this.destroy$))
      .subscribe(volume => {
        this.volume = volume * 100;
        this.audioService.setVolume(volume);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePlay() {
    const currentSong = this.audioService.getCurrentSong();
    if (currentSong) {
      if (this.audioService.isPaused()) {
        this.store.dispatch(PlayerActions.play({ song: currentSong }));
      } else {
        this.store.dispatch(PlayerActions.pause());
      }
    }
  }

  seek(value: number) {
    this.audioService.seek(value);
  }

  toggleMute() {
    if (this.isMuted) {
      this.volume = this.lastVolume;
      this.audioService.setVolume(this.lastVolume / 100);
    } else {
      this.lastVolume = this.volume;
      this.volume = 0;
      this.audioService.setVolume(0);
    }
    this.isMuted = !this.isMuted;
    this.store.dispatch(PlayerActions.setVolume({ volume: this.volume / 100 }));
  }

  setVolume(value: number) {
    this.audioService.setVolume(value / 100);
    this.isMuted = value === 0;
    this.store.dispatch(PlayerActions.setVolume({ volume: value / 100 }));
  }

  skipNext() {
    this.store.dispatch(PlayerActions.skipNext());
  }

  skipPrevious() {
    this.store.dispatch(PlayerActions.skipPrevious());
  }
  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/default-album.png';
    return imageUrl.startsWith('http') ? 
      imageUrl : 
      `${environment.apiUrl}/files/${imageUrl}`;
  }
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
} 