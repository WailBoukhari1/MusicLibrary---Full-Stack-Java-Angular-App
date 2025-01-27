import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, first, tap } from 'rxjs/operators';
import { Song } from '../models/song.model';
import * as SongActions from '../../store/song/song.actions';
import { selectSelectedSong } from '../../store/song/song.selectors';

export const songResolver: ResolveFn<Song | null> = (route) => {
  const store = inject(Store);
  const id = route.paramMap.get('id');
  console.log('Resolver ID:', id);

  if (!id) {
    console.log('No ID provided');
    return of(null);
  }

  store.dispatch(SongActions.clearSelectedSong());
  
  store.dispatch(SongActions.loadSong({ id }));

  return store.select(selectSelectedSong).pipe(
    tap(song => console.log('Selected song in resolver:', song)),
    filter(song => !!song),
    first(),
    catchError((error) => {
      console.error('Resolver error:', error);
      return of(null);
    })
  );
}; 