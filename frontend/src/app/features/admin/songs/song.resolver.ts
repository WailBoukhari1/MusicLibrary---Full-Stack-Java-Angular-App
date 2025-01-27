import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, filter, first, map, tap } from 'rxjs/operators';
import { Song } from '../../../core/models/song.model';
import { Album } from '../../../core/models/album.model';
import * as SongActions from '../../../store/song/song.actions';
import * as SongSelectors from '../../../store/song/song.selectors';
import * as AlbumActions from '../../../store/album/album.actions';
import * as AlbumSelectors from '../../../store/album/album.selectors';

interface SongResolverData {
  song: Song | null;
  albums: Album[];
}

@Injectable({ providedIn: 'root' })
export class SongResolver implements Resolve<SongResolverData> {
  constructor(private store: Store) {}

  resolve(route: ActivatedRouteSnapshot): Observable<SongResolverData> {
    const songId = route.paramMap.get('id');

    // Load albums for dropdown
    this.store.dispatch(AlbumActions.loadAlbums());
    const albums$ = this.store.select(AlbumSelectors.selectAllAlbums).pipe(
      filter(albums => !!albums.length),
      first()
    );

    // If no songId, just return albums
    if (!songId) {
      return albums$.pipe(
        map(albums => ({ song: null, albums }))
      );
    }

    // Dispatch action to load song
    this.store.dispatch(SongActions.loadSong({ id: songId }));
    const song$ = this.store.select(SongSelectors.selectSelectedSong).pipe(
      filter(song => !!song),
      first()
    );

    // Return both song and albums
    return combineLatest([song$, albums$]).pipe(
      map(([song, albums]) => ({ song, albums })),
      catchError(() => of({ song: null, albums: [] }))
    );
  }
} 