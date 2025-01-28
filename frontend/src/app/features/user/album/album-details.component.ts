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
import {
  selectCurrentSong,
  selectIsPlaying,
} from '../../../store/player/player.selectors';
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
    RouterModule,
  ],
  templateUrl:"album-details.component.html"

})
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  album$ = this.store.select(selectCurrentAlbum).pipe(
    map((album) => {
      if (!album) return null;
      const uniqueSongs = album.songs
        ? [...new Map(album.songs.map((song) => [song.id, song])).values()]
        : [];
      return {
        ...album,
        songs: uniqueSongs,
      };
    })
  );
  isPlaying$ = this.store.select(selectIsPlaying);
  currentSong$ = this.store.select(selectCurrentSong);
  currentSongId: string | null = null;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.store.dispatch(AlbumActions.loadAlbum({ id: albumId }));
    }

    this.currentSong$.pipe(takeUntil(this.destroy$)).subscribe((song) => {
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
    const uniqueSongs = album.songs
      ? [...new Map(album.songs.map((song) => [song.id, song])).values()]
      : [];

    if (uniqueSongs.length) {
      if (this.isCurrentAlbum(album)) {
        this.isPlaying$.pipe(take(1)).subscribe((isPlaying) => {
          if (isPlaying) {
            this.store.dispatch(PlayerActions.pause());
          } else {
            this.store.dispatch(
              PlayerActions.playAlbum({ songs: uniqueSongs })
            );
          }
        });
      } else {
        this.store.dispatch(PlayerActions.playAlbum({ songs: uniqueSongs }));
      }
    }
  }

  playSong(song: Song): void {
    if (this.isCurrentSong(song)) {
      this.isPlaying$.pipe(take(1)).subscribe((isPlaying) => {
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
      map((album) => {
        if (!album) return null;
        return {
          ...album,
          songs:
            album.songs?.map((s) =>
              s.id === song.id ? { ...s, isFavorite: !s.isFavorite } : s
            ) ?? [],
        };
      })
    );
  }

  isCurrentSong(song: Song): boolean {
    return this.currentSongId === song.id;
  }

  isCurrentAlbum(album: Album): boolean {
    return album.songs?.some((song) => song.id === this.currentSongId) ?? false;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-album.png';
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/default-album.png';
    return imageUrl.startsWith('http')
      ? imageUrl
      : `${environment.apiUrl}/files/${imageUrl}`;
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
