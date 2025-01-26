import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private _currentTime = new BehaviorSubject<number>(0);
  private _duration = new BehaviorSubject<number>(0);

  currentTime$ = this._currentTime.asObservable();
  duration$ = this._duration.asObservable();

  constructor() {
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

  play(url?: string) {
    if (url) {
      this.audio.src = url;
      this.audio.load();
    }
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
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
} 