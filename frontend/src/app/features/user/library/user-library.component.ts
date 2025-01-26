@Component({
  // ... existing component metadata ...
  template: `
    <!-- ... other template content ... -->
    <div class="albums-grid" *ngIf="!isLoading">
      <mat-card *ngFor="let album of filteredAlbums" class="album-card">
        <img mat-card-image [src]="getImageUrl(album.imageUrl)" 
             [alt]="album.title"
             (error)="onImageError($event)">
        <mat-card-content>
          <!-- ... other content ... -->
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary" 
                  [disabled]="!album.songs?.length"
                  (click)="playAlbum(album)">
            <mat-icon>
              {{(isCurrentAlbum(album) && (isPlaying$ | async)) ? 'pause' : 'play_arrow'}}
            </mat-icon> 
            {{(isCurrentAlbum(album) && (isPlaying$ | async)) ? 'Pause' : 'Play'}}
          </button>
          <!-- ... other buttons ... -->
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class UserLibraryComponent implements OnInit {
  // ... existing properties ...
  currentTrack$ = this.store.select(selectCurrentTrack);
  isPlaying$ = this.store.select(selectIsPlaying);
  canSkipNext$ = this.store.select(selectCanSkipNext);
  canSkipPrevious$ = this.store.select(selectCanSkipPrevious);

  constructor(
    private store: Store,
    // ... other dependencies
  ) {
    // ... existing constructor code ...
  }

  playAlbum(album: Album) {
    if (!album.songs?.length) {
      this.showError('No songs available in this album');
      return;
    }

    if (this.isCurrentAlbum(album)) {
      this.store.dispatch(PlayerActions.pause());
    } else {
      this.store.dispatch(PlayerActions.playAlbum({ album }));
      this.showSuccess(`Playing album: ${album.title}`);
    }
  }

  isCurrentAlbum(album: Album): boolean {
    let isCurrentAlbum = false;
    this.currentTrack$.pipe(take(1)).subscribe(track => {
      isCurrentAlbum = track?.albumId === album.id;
    });
    return isCurrentAlbum;
  }

  // ... rest of the component code ...
} 