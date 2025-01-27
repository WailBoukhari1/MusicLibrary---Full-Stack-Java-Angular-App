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
import { Album } from '../../../core/models/album.model';
import { SongActions } from '../../../store/song/song.actions';

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
            <mat-list-item *ngFor="let song of album.songs; let i = index" class="song-item">
              <div class="song-item-content">
                <div class="song-info">
                  <mat-icon>music_note</mat-icon>
                  <div class="song-text">
                    <div class="song-title">{{song.title}}</div>
                    <div class="song-duration">{{song.duration | date:'mm:ss'}}</div>
                  </div>
                </div>
                <div class="song-actions">
                  <button mat-icon-button (click)="playSong(song); $event.stopPropagation()">
                    <mat-icon>play_arrow</mat-icon>
                  </button>
                  <button mat-icon-button [routerLink]="['/user/song-details', song.id]" (click)="$event.stopPropagation()">
                    <mat-icon>info</mat-icon>
                  </button>
                  <button mat-icon-button (click)="toggleFavorite(song); $event.stopPropagation()">
                    <mat-icon>{{song.isFavorite ? 'favorite' : 'favorite_border'}}</mat-icon>
                  </button>
                </div>
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

    .song-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 8px;
    }

    .song-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .song-text {
      display: flex;
      flex-direction: column;
    }

    .song-title {
      font-weight: 500;
    }

    .song-duration {
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
    }

    .song-actions {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }

    mat-list-item {
      height: auto !important;
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

  playAlbum(album: Album) {
    if (album.songs) {
      this.store.dispatch(PlayerActions.playAlbum({ songs: album.songs }));
    }
  }

  playSong(song: any) {
    this.store.dispatch(PlayerActions.play({ song }));
  }

  toggleFavorite(song: any) {
      // Dispatch action to toggle favorite
    // this.store.dispatch(SongActions.toggleFavorite({ songId: song.id }));
  }
} 