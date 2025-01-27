import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { selectSelectedSong, selectSongsLoading, selectSongsError } from '../../../store/song/song.selectors';
import { SongActions } from '../../../store/song/song.actions';
import { PlayerActions } from '../../../store/player/player.actions';
import { Song } from '../../../core/models/song.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-song-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <div class="container" *ngIf="song$ | async as song">
      <mat-card class="song-card">
        <img [src]="song.imageUrl" [alt]="song.title">
            <mat-card-content>
          <h2>{{song.title}}</h2>
          <p class="artist">{{song.artist}}</p>
          <p class="album" *ngIf="song.albumTitle">From: {{song.albumTitle}}</p>
              <p class="description" *ngIf="song.description">{{song.description}}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" (click)="playSong(song)">
            <mat-icon>play_arrow</mat-icon>
            Play
                </button>
          <button mat-button (click)="toggleFavorite(song)">
                  <mat-icon>{{song.isFavorite ? 'favorite' : 'favorite_border'}}</mat-icon>
            {{song.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}}
                </button>
        </mat-card-actions>
      </mat-card>
      <mat-progress-bar *ngIf="loading$ | async" mode="indeterminate"></mat-progress-bar>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .song-card {
      img {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
      }
    .artist {
        color: #666;
        font-size: 1.1em;
      }
      .album {
        color: #888;
      }
    .description {
      margin-top: 16px;
        white-space: pre-line;
      }
    }
  `]
})
export class SongDetailsComponent implements OnInit, OnDestroy {
  song$: Observable<Song | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.song$ = this.store.select(selectSelectedSong);
    this.loading$ = this.store.select(selectSongsLoading);
    this.error$ = this.store.select(selectSongsError);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(SongActions.loadSong({ id }));
    }
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
      this.store.dispatch(SongActions.toggleFavorite({ song }));
    }
  }
} 