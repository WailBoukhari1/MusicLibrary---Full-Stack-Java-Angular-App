@Component({
  selector: 'app-player-controls',
  template: `
    <div class="player-controls">
      <button mat-icon-button 
              [disabled]="!(canSkipPrevious$ | async)"
              (click)="previousTrack()">
        <mat-icon>skip_previous</mat-icon>
      </button>
      
      <button mat-icon-button (click)="togglePlay()">
        <mat-icon>{{(isPlaying$ | async) ? 'pause' : 'play_arrow'}}</mat-icon>
      </button>
      
      <button mat-icon-button 
              [disabled]="!(canSkipNext$ | async)"
              (click)="nextTrack()">
        <mat-icon>skip_next</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
    }
  `]
})
export class PlayerControlsComponent {
  isPlaying$ = this.store.select(selectIsPlaying);
  canSkipNext$ = this.store.select(selectCanSkipNext);
  canSkipPrevious$ = this.store.select(selectCanSkipPrevious);

  constructor(private store: Store) {}

  togglePlay() {
    this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
      if (isPlaying) {
        this.store.dispatch(PlayerActions.pause());
      } else {
        this.store.dispatch(PlayerActions.resume());
      }
    });
  }

  nextTrack() {
    this.store.dispatch(PlayerActions.nextTrack());
  }

  previousTrack() {
    this.store.dispatch(PlayerActions.previousTrack());
  }
} 