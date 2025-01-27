import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { SongService } from '../../core/services/song.service';
import { SongActions } from './song.actions';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Song } from '../../core/models/song.model';

@Injectable()
export class SongEffects {
  loadSongs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongActions.loadSongs),
      mergeMap(({ page, size }) =>
        this.songService.getSongs(page, size).pipe(
          map(response => SongActions.loadSongsSuccess({
            songs: response.data?.content || [],
            totalElements: response.data?.totalElements || 0,
            totalPages: response.data?.totalPages || 0,
            currentPage: response.data?.number || 0,
            pageSize: response.data?.size || 0
          })),
          catchError(error => of(SongActions.loadSongsFailure({ error: error.message })))
        )
      )
    )
  );

  createSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongActions.createSong),
      mergeMap(({ song }) =>
        this.songService.createSong(song).pipe(
          map(response => SongActions.createSongSuccess({ song: response.data as Song   })),
          catchError(error => of(SongActions.createSongFailure({ error: error.message })))
        )
      )
    )
  );

  createSongSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongActions.createSongSuccess),
      tap(() => {
        this.router.navigate(['/admin/songs']);
      })
    ),
    { dispatch: false }
  );

  updateSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongActions.updateSong),
      mergeMap(({ id, song }) =>
        this.songService.updateSong(id, song).pipe(
          map(response => {
            if (!response.data) {
              throw new Error('No song received');
            }
            return SongActions.updateSongSuccess({ song: response.data });
          }),
          catchError(error => of(SongActions.updateSongFailure({ error: error.message })))
        )
      )
    )
  );

  deleteSong$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongActions.deleteSong),
      mergeMap(({ id }) =>
        this.songService.deleteSong(id).pipe(
          map(() => SongActions.deleteSongSuccess({ id })),
          catchError(error => of(SongActions.deleteSongFailure({ error: error.message })))
        )
      )
    )
  );

  searchSongs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SongActions.searchSongs),
      mergeMap(({ query }) =>
        this.songService.searchSongs(query).pipe(
          map(response => SongActions.searchSongsSuccess({ songs: response.data as Song[] })),
          catchError(error => of(SongActions.searchSongsFailure({ 
            error: error.error?.message || 'Failed to search songs' 
          })))
        )
      )
    )
  );

  loadSong$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SongActions.loadSong),
      switchMap(({ id }) => 
        this.songService.getSong(id).pipe(
          map(response => {
            console.log('Loaded song:', response.data);
            return SongActions.loadSongSuccess({ song: response.data as Song });
          }),
          catchError(error => {
            console.error('Load song error:', error);
            return of(SongActions.loadSongFailure({ error: error.message }));
          })
        )
      )
    );
  });

  toggleFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(SongActions.toggleFavorite),
    switchMap(({ song }) => this.songService.toggleFavorite(song).pipe(
      map(response => SongActions.toggleFavoriteSuccess({ 
        song: { ...song, isFavorite: !song.isFavorite }
      })),
      catchError(error => of(SongActions.toggleFavoriteFailure({ 
        error: error.message || 'Failed to toggle favorite'
      })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private songService: SongService,
    private router: Router
  ) {}
} 