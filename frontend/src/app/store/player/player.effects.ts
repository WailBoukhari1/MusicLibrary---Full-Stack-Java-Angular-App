import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PlayerActions } from './player.actions';
import { tap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AudioService } from '../../core/services/audio.service';

@Injectable()
export class PlayerEffects {
  
  play$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.play),
      tap(({ song }) => {
        if (song.audioUrl) {
          this.audioService.play(song.audioUrl);
        }
      })
    ),
    { dispatch: false }
  );
  
  pause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.pause),
      tap(() => this.audioService.pause())
    ),
    { dispatch: false }
  );
  
  resume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.resume),
      tap(() => this.audioService.play())
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

  playAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.playAlbum),
      map(({ album }) => {
        if (album.songs && album.songs.length > 0) {
          // Set the queue and play first song
          this.store.dispatch(PlayerActions.setQueue({ songs: album.songs }));
          return PlayerActions.play({ song: album.songs[0] });
        }
        return PlayerActions.pause();
      })
    )
  );

  togglePlay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.togglePlay),
      map(() => {
        if (this.audioService.isPaused()) {
          this.audioService.play();
          return PlayerActions.resume();
        } else {
          this.audioService.pause();
          return PlayerActions.pause();
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private audioService: AudioService
  ) {}
} 