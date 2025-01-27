import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PlayerActions } from './player.actions';
import { tap, map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AudioService } from '../../core/services/audio.service';
import { selectCurrentAlbum, selectCurrentSong } from './player.selectors';
import { PlayerService } from '../../core/services/player.service';

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

  playAlbum$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.playAlbum),
    tap(({ songs }) => {
      this.playerService.setPlaylist(songs);
    }),
    map(({ songs }) => PlayerActions.play({ song: songs[0] }))
  ));

  playSong$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.play),
    tap(({ song }) => {
      this.playerService.setCurrentSong(song);
    })
  ), { dispatch: false });

  playNextSong$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.nextSong),
    withLatestFrom(this.store.select(selectCurrentAlbum)),
    map(([_, album]) => {
      const nextSong = this.playerService.getNextSong();
      if (nextSong) {
        return PlayerActions.play({ song: nextSong });
      }
      return PlayerActions.pause();
    })
  ));

  playPreviousSong$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.previousSong),
    withLatestFrom(this.store.select(selectCurrentAlbum)),
    map(([_, album]) => {
      const previousSong = this.playerService.getPreviousSong();
      if (previousSong) {
        return PlayerActions.play({ song: previousSong });
      }
      return PlayerActions.pause();
    })
  ));

  skipNext$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.skipNext),
    withLatestFrom(this.store.select(selectCurrentSong)),
    map(([_, currentSong]) => {
      const nextSong = this.playerService.getNextSong();
      if (nextSong) {
        return PlayerActions.play({ song: nextSong });
      }
      return PlayerActions.pause();
    })
  ));

  skipPrevious$ = createEffect(() => this.actions$.pipe(
    ofType(PlayerActions.skipPrevious),
    withLatestFrom(this.store.select(selectCurrentSong)),
    map(([_, currentSong]) => {
      const previousSong = this.playerService.getPreviousSong();
      if (previousSong) {
        return PlayerActions.play({ song: previousSong });
      }
      return PlayerActions.pause();
    })
  ));

  constructor(
    private actions$: Actions,
    private store: Store,
    private audioService: AudioService,
    private playerService: PlayerService
  ) {}
} 