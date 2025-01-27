import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PlayerActions } from './player.actions';
import { tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AudioService } from '../../core/services/audio.service';

@Injectable()
export class PlayerEffects {
  
  play$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.play),
    tap(({ song }) => {
      if (song) {
        this.audioService.play(song);
      }
    }),
    map(() => PlayerActions.setPlaying({ isPlaying: true }))
  ));
  
  pause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.pause),
      tap(() => this.audioService.pause())
    ),
    { dispatch: false }
  );
  
  setVolume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.setVolume),
      tap(({ volume }) => this.audioService.setVolume(volume))
    ),
    { dispatch: false }
  );

  togglePlay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.togglePlay),
      map(() => {
        const currentSong = this.audioService.getCurrentSong();
        if (this.audioService.isPaused()) {
          if (currentSong) {
            this.audioService.play(currentSong);
          }
          return PlayerActions.resume();
        } else {
          this.audioService.pause();
          return PlayerActions.pause();
        }
      })
    )
  );

  playAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.playAlbum),
      map(({ songs }) => {
        if (songs.length > 0) {
          this.store.dispatch(PlayerActions.setQueue({ songs }));
          return PlayerActions.play({ song: songs[0] });
        }
        return PlayerActions.pause();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private audioService: AudioService
  ) {}
} 