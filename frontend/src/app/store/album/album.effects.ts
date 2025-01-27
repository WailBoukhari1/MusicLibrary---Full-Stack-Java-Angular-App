import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { AlbumService } from '../../core/services/album.service';
import * as AlbumActions from './album.actions';
import { catchError, map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Album } from '../../core/models/album.model';

@Injectable()
export class AlbumEffects {
  private currentPage = 0;
  private pageSize = 10;

  loadAlbums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.loadAlbums),
      mergeMap(() => this.albumService.getAlbums(this.currentPage, this.pageSize)
        .pipe(
          map(response => AlbumActions.loadAlbumsSuccess({ 
            albums: response.data?.content || [],
            totalElements: response.data?.totalElements || 0
          })),
          catchError(error => of(AlbumActions.loadAlbumsFailure({ error: error.message })))
        ))
    )
  );

  createAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.createAlbum),
      mergeMap(({ album }) => this.albumService.createAlbum(album)
        .pipe(
          map(response => AlbumActions.createAlbumSuccess({ album: response.data as Album })),
          catchError(error => of(AlbumActions.createAlbumFailure({ error: error.message })))
        ))
    )
  );

  updateAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.updateAlbum),
      mergeMap(({ id, album }) => this.albumService.updateAlbum(id, album)
        .pipe(
          map(response => AlbumActions.updateAlbumSuccess({ album: response.data as Album })),
          catchError(error => of(AlbumActions.updateAlbumFailure({ error: error.message })))
        ))
    )
  );

  deleteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.deleteAlbum),
      mergeMap(({ id }) => this.albumService.deleteAlbum(id)
        .pipe(
          map(() => AlbumActions.deleteAlbumSuccess({ id })),
          catchError(error => of(AlbumActions.deleteAlbumFailure({ error: error.message })))
        ))
    )
  );

  // Navigate after success
  albumSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AlbumActions.createAlbumSuccess,
        AlbumActions.updateAlbumSuccess,
        AlbumActions.deleteAlbumSuccess
      ),
      tap(() => this.router.navigate(['/admin/albums']))
    ),
    { dispatch: false }
  );

  loadAlbum$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlbumActions.loadAlbum),
      switchMap(({ id }) => 
        this.albumService.getAlbumById(id).pipe(
          map(response => {
            if (response.success && response.data) {
              return AlbumActions.loadAlbumSuccess({ album: response.data });
            }
            throw new Error('Failed to load album');
          }),
          catchError(error => of(AlbumActions.loadAlbumFailure({ 
            error: error.message || 'Failed to load album' 
          })))
        )
      )
    );
  });

  constructor(
    private actions$: Actions,
    private albumService: AlbumService,
    private router: Router
  ) {}
} 