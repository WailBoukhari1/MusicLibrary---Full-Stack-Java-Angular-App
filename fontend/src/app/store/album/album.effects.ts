import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlbumActions } from './album.actions';
import { AlbumService } from '../../core/services/album.service';
import { Page } from '../../core/models/page.model';
import { Album } from '../../core/models/album.model';
import { ApiResponse } from '../../core/models/api-response.model';

@Injectable()
export class AlbumEffects {
  loadAlbums$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.loadAlbums),
      mergeMap(({ page, size }) =>
        this.albumService.getAlbums(page, size).pipe(
          map(response => {
            if (!response.data) throw new Error('No data received');
            return AlbumActions.loadAlbumsSuccess({ 
              albums: response.data.content,
              totalElements: response.data.totalElements,
              totalPages: response.data.totalPages,
              currentPage: response.data.number,
              pageSize: response.data.size
            });
          }),
          catchError(error => of(AlbumActions.loadAlbumsFailure({ error: error.message })))
        )
      )
    )
  );

  createAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.createAlbum),
      mergeMap(({ album }) =>
        this.albumService.createAlbum(album).pipe(
          map(response => {
            if (response.success && response.data) {
              return AlbumActions.createAlbumSuccess({ album: response.data });
            }
            throw new Error('Failed to create album: No data received');
          }),
          catchError(error => of(AlbumActions.createAlbumFailure({ 
            error: error.message || 'Failed to create album'
          })))
        )
      )
    )
  );

  updateAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.updateAlbum),
      mergeMap(({ id, album }) =>
        this.albumService.updateAlbum(id, album).pipe(
          map(response => {
            if (response.success && response.data) {
              return AlbumActions.updateAlbumSuccess({ album: response.data });
            }
            throw new Error('Failed to update album: No data received');
          }),
          catchError(error => of(AlbumActions.updateAlbumFailure({ 
            error: error.message || 'Failed to update album'
          })))
        )
      )
    )
  );

  deleteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlbumActions.deleteAlbum),
      mergeMap(({ id }) =>
        this.albumService.deleteAlbum(id).pipe(
          map(() => AlbumActions.deleteAlbumSuccess({ id })),
          catchError(error => of(AlbumActions.deleteAlbumFailure({ error: error.message })))
        )
      )
    )
  );

  loadAlbum$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlbumActions.loadAlbum),
      mergeMap(({ id }) => this.albumService.getAlbum(Number(id))
        .pipe(
          map((response: ApiResponse<Album>) => {
            if (!response.data) throw new Error('No data received');
            return AlbumActions.loadAlbumSuccess({ album: response.data });
          }),
          catchError(error => of(AlbumActions.loadAlbumFailure({ error: error.message })))
        ))
    );
  });

  // Add navigation effects
  albumSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AlbumActions.createAlbumSuccess,
        AlbumActions.updateAlbumSuccess
      ),
      tap(() => this.router.navigate(['/admin/albums']))
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private albumService: AlbumService,
    private router: Router
  ) {}
} 