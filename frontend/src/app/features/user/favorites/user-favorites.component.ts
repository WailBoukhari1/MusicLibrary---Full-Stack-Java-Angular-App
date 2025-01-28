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
  templateUrl:"user-favorites.component.html"
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