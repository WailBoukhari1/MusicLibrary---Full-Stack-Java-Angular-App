import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../models/song.model';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { PlayerActions } from '../../store/player/player.actions';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AudioService extends BaseService {
  private audio = new Audio();
  private currentSong = new BehaviorSubject<Song | null>(null);
  private isPlaying = new BehaviorSubject<boolean>(false);
  private currentTime = new BehaviorSubject<number>(0);
  private duration = new BehaviorSubject<number>(0);

  readonly currentSong$ = this.currentSong.asObservable();
  readonly isPlaying$ = this.isPlaying.asObservable();
  readonly currentTime$ = this.currentTime.asObservable();
  readonly duration$ = this.duration.asObservable();

  constructor(http: HttpClient, private store: Store) {
    super(http);
    this.initializeAudioListeners();
  }

  private initializeAudioListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.next(this.audio.currentTime);
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.store.dispatch(PlayerActions.setProgress({ progress }));
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.next(this.audio.duration);
    });

    this.audio.addEventListener('ended', () => {
      this.store.dispatch(PlayerActions.setPlaying({ isPlaying: false }));
      this.store.dispatch(PlayerActions.nextSong());
    });
  }

  play(song: Song): void {
    if (song.audioFileId && this.currentSong.value?.id !== song.id) {
      this.audio.src = this.getFileUrl(song.audioFileId);
      this.currentSong.next(song);
    }
    this.audio.play()
      .then(() => this.isPlaying.next(true))
      .catch(error => this.handleError(error));
  }

  pause() {
    this.audio.pause();
    this.isPlaying.next(false);
  }

  getCurrentSong(): Song | null {
    return this.currentSong.value;
  }

  isPaused(): boolean {
    return this.audio.paused;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }
} 