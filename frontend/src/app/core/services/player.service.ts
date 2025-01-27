import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PlayerActions } from '../../store/player/player.actions';
import { Song } from '../models/song.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Album } from '../models/album.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audioElement: HTMLAudioElement;
  private progressSubject = new BehaviorSubject<number>(0);
  progress$ = this.progressSubject.asObservable();
  private currentPlaylist: Song[] = [];
  private currentIndex = 0;

  constructor(private store: Store) {
    this.audioElement = new Audio();
    
    // Handle audio events
    this.audioElement.addEventListener('timeupdate', () => {
      const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
      this.progressSubject.next(progress);
      this.store.dispatch(PlayerActions.setProgress({ progress }));
    });

    this.audioElement.addEventListener('ended', () => {
      this.store.dispatch(PlayerActions.skipNext());
    });
  }

  play(song: Song): void {
    this.audioElement.src = song.audioUrl ?? '';
    this.audioElement.play();
  }

  pause(): void {
    this.audioElement.pause();
  }

  resume(): void {
    this.audioElement.play();
  }

  stop(): void {
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
  }

  setVolume(volume: number): void {
    this.audioElement.volume = volume;
  }

  seek(progress: number): void {
    const time = (progress / 100) * this.audioElement.duration;
    this.audioElement.currentTime = time;
  }

  getDuration(): number {
    return this.audioElement.duration;
  }

  getCurrentTime(): number {
    return this.audioElement.currentTime;
  }

  setPlaylist(songs: Song[]) {
    this.currentPlaylist = songs;
  }

  getCurrentSong(): Song | null {
    return this.currentPlaylist[this.currentIndex] || null;
  }

  getNextSong(): Song | null {
    if (this.currentIndex < this.currentPlaylist.length - 1) {
      this.currentIndex++;
      return this.getCurrentSong();
    }
    return null;
  }

  getPreviousSong(): Song | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.getCurrentSong();
    }
    return null;
  }

  setCurrentSong(song: Song) {
    const index = this.currentPlaylist.findIndex(s => s.id === song.id);
    if (index !== -1) {
      this.currentIndex = index;
    }
  }
} 