import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PlayerActions } from '../../../store/player/player.actions';
import { selectCurrentAlbum } from '../../../store/album/album.selectors';
import { AppState } from '../../../store/app.state';
import { AlbumActions } from '../../../store/album/album.actions';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-album-details',
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
    <div class="album-details" *ngIf="album$ | async as album">
      <mat-card class="album-info">
        <img [src]="album.imageUrl" [alt]="album.title" class="album-cover">
        <mat-card-content>
          <h1>{{album.title}}</h1>
          <p>{{album.artist}}</p>
          <button mat-raised-button color="primary" (click)="playAlbum(album)">
            <mat-icon>play_arrow</mat-icon> Play Album
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card class="songs-list">
        <mat-card-content>
          <mat-list>
            <mat-list-item *ngFor="let song of album.songs; let i = index" 
                          (click)="playSong(song)"
                          class="song-item">
              <mat-icon matListItemIcon>music_note</mat-icon>
              <div matListItemTitle>{{song.title}}</div>
              <div matListItemLine>{{song.duration | date:'mm:ss'}}</div>
              <div class="song-actions">
                <button mat-icon-button (click)="playSong(song)">
                  <mat-icon>play_arrow</mat-icon>
                </button>
                <button mat-icon-button [routerLink]="['/user/songs', song.id]">
                  <mat-icon>info</mat-icon>
                </button>
                <button mat-icon-button (click)="toggleFavorite(song); $event.stopPropagation()">
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
    .album-details {
      padding: 20px;
      display: grid;
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .album-info {
      display: flex;
      gap: 20px;
      padding: 20px;

      .album-cover {
        width: 300px;
        height: 300px;
        object-fit: cover;
      }

      mat-card-content {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
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
export class AlbumDetailsComponent implements OnInit, OnDestroy {
  album$ = this.store.select(selectCurrentAlbum);

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.store.dispatch(AlbumActions.loadAlbum({ id: albumId }));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(AlbumActions.clearSelectedAlbum());
  }

  playAlbum(album: any) {
    this.store.dispatch(PlayerActions.playAlbum({ album }));
  }

  playSong(song: any) {
    this.store.dispatch(PlayerActions.play({ song }));
  }

  toggleFavorite(song: any) {
    // Dispatch action to toggle favorite
    // this.store.dispatch(SongActions.toggleFavorite({ songId: song.id }));
  }
} 