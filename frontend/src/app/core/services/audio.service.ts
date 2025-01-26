import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement;
  private _currentTime = new BehaviorSubject<number>(0);
  private _duration = new BehaviorSubject<number>(0);

  currentTime$ = this._currentTime.asObservable();
  duration$ = this._duration.asObservable();

  constructor() {
    this.audio = new Audio();

    this.audio.addEventListener('timeupdate', () => {
      this._currentTime.next(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this._duration.next(this.audio.duration);
    });

    this.audio.addEventListener('ended', () => {
      // Handle song end
      this._currentTime.next(0);
    });
  }

  play(song?: Song) {
    if (song?.audioUrl) {
      const fullUrl = `${environment.apiUrl}/files/${song.audioUrl}`;
      if (this.audio.src !== fullUrl) {
        this.audio.src = fullUrl;
      }
    }
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  getDuration(): number {
    return this.audio.duration;
  }

  getCurrentTime(): number {
    return this.audio.currentTime;
  }

  isPaused(): boolean {
    return this.audio.paused;
  }

  addEventListener(event: string, handler: (e: Event) => void) {
    this.audio.addEventListener(event, handler);
  }

  removeEventListener(event: string, handler: (e: Event) => void) {
    this.audio.removeEventListener(event, handler);
  }
} 