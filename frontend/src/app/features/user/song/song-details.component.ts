import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedSong, selectSongsLoading, selectSongsError } from '../../../store/song/song.selectors';
import * as SongActions from '../../../store/song/song.actions';
import { PlayerActions } from '../../../store/player/player.actions';
import { Song } from '../../../core/models/song.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-song-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  templateUrl: "song-details.component.html"
})
export class SongDetailsComponent implements OnInit, OnDestroy {
  song$: Observable<Song | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  currentSong: Song | null = null;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.song$ = this.store.select(selectSelectedSong).pipe(
      tap(song => {
        this.currentSong = song;
      })
    );
    this.loading$ = this.store.select(selectSongsLoading);
    this.error$ = this.store.select(selectSongsError);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(SongActions.loadSong({ id }));
    }
  }

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/default-album.png';
    return imageUrl.startsWith('http') ? 
      imageUrl : 
      `${environment.apiUrl}/files/${imageUrl}`;
  }

  ngOnDestroy() {
    this.store.dispatch(SongActions.clearSelectedSong());
  }

  playSong(song: Song) {
    if (song) {
      this.store.dispatch(PlayerActions.play({ song }));
    }
  }

  toggleFavorite(song: Song) {
    if (song) {
      // Update the local state immediately for better UX
      if (this.currentSong) {
        this.currentSong = {
          ...this.currentSong,
          isFavorite: !this.currentSong.isFavorite
        };
      }
      this.store.dispatch(SongActions.toggleFavorite({ song }));
    }
  }

  // Helper method to check favorite status
  isFavorite(): boolean {
    return this.currentSong?.isFavorite || false;
  }
} 