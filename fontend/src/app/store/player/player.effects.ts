import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PlayerActions } from './player.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class PlayerEffects {
  
  audioElement: HTMLAudioElement = new Audio();
  
  play$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.play),
      tap(({ song }) => {
        this.audioElement.src = song.audioUrl;
        this.audioElement.play();
      })
    ),
    { dispatch: false }
  );
  
  pause$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.pause),
      tap(() => this.audioElement.pause())
    ),
    { dispatch: false }
  );
  
  resume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.resume),
      tap(() => this.audioElement.play())
    ),
    { dispatch: false }
  );
  
  setVolume$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayerActions.setVolume),
      tap(({ volume }) => {
        this.audioElement.volume = volume;
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {
    // Handle audio element events
    this.audioElement.addEventListener('timeupdate', () => {
      const progress = (this.audioElement.currentTime / this.audioElement.duration) * 100;
      // Dispatch progress update action
    });
  }
} 