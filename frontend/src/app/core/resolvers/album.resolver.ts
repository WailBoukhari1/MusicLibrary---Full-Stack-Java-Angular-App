import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { Album } from '../models/album.model';
import * as AlbumActions from '../../store/album/album.actions';
import { selectSelectedAlbum } from '../../store/album/album.selectors';

export const albumResolver: ResolveFn<Album | null> = (route) => {
  const store = inject(Store);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  store.dispatch(AlbumActions.loadAlbum({ id }));

  return store.select(selectSelectedAlbum).pipe(
    filter(album => !!album),
    first(),
    catchError(() => of(null))
  );
}; 