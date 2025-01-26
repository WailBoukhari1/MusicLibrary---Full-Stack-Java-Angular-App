import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PlayerActions } from '../../../store/player/player.actions';
import { selectFavoriteSongs } from '../../../store/song/song.selectors';
import { Song } from '../../../core/models/song.model';
import { AppState } from '../../../store/app.state';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <div class="favorites-page">
      <mat-card>
        <mat-card-header>
          <mat-card-title>My Favorites</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let song of favorites$ | async" 
                          (click)="playSong(song)"
                          class="song-item">
              <img matListItemAvatar [src]="song.imageUrl" [alt]="song.title">
              <div matListItemTitle>{{song.title}}</div>
              <div matListItemLine>{{song.artist}}</div>
              <button mat-icon-button (click)="toggleFavorite(song); $event.stopPropagation()">
                <mat-icon>favorite</mat-icon>
              </button>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .favorites-page {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .song-item {
      cursor: pointer;
      &:hover {
        background: rgba(0,0,0,0.04);
      }
    }
  `]
})
export class UserFavoritesComponent implements OnInit {
  favorites$ = this.store.select(selectFavoriteSongs);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // Load favorites
    // this.store.dispatch(SongActions.loadFavorites());
  }

  playSong(song: Song) {
    this.store.dispatch(PlayerActions.play({ song }));
  }

  toggleFavorite(song: Song) {
    // this.store.dispatch(SongActions.toggleFavorite({ songId: song.id }));
  }
}