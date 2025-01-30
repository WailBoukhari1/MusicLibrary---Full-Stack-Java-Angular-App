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
  templateUrl:"player.component.html",
  // styleUrls:['player.component.scss']
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