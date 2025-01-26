import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { PlayerActions } from '../../../store/player/player.actions';
import { selectAllSongs } from '../../../store/song/song.selectors';
import { SongActions } from '../../../store/song/song.actions';

@Component({
  selector: 'app-user-songs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule
  ],
  template: `
    <div class="songs-container">
      <mat-card>
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let song of songs$ | async" class="song-item">
              <mat-icon matListItemIcon>music_note</mat-icon>
              <div matListItemTitle>{{song.title}}</div>
              <div matListItemLine>{{song.artist}}</div>
              <div class="song-actions">
                <button mat-icon-button (click)="playSong(song)">
                  <mat-icon>play_arrow</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['/user/songs', song.id]">
                  <mat-icon>info</mat-icon>
                </button>
                <button mat-icon-button (click)="toggleFavorite(song)">
                  <mat-icon>{{song.isFavorite ? 'favorite' : 'favorite_border'}}</mat-icon>
                </button>
              </div>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .songs-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .song-item {
      cursor: pointer;
      &:hover {
        background: rgba(0,0,0,0.04);
      }
    }

    .song-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class UserSongsComponent implements OnInit {
  songs$ = this.store.select(selectAllSongs);

  constructor(
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(SongActions.loadSongs({ page: 0, size: 10 }));
  }

  playSong(song: any) {
    this.store.dispatch(PlayerActions.play({ song }));
  }

  toggleFavorite(song: any) {
    // Dispatch action to toggle favorite
    // this.store.dispatch(SongActions.toggleFavorite({ songId: song.id }));
  }
}
