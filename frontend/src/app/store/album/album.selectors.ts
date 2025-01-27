import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumState } from './album.state';

export const selectAlbumStateSelector = createFeatureSelector<AlbumState>('albums');

export const selectAllAlbums = createSelector(
  selectAlbumStateSelector,
  (state: AlbumState) => state.albums
);

export const selectCurrentAlbum = createSelector(
  selectAlbumStateSelector,
  (state) => state?.selectedAlbum ?? null
);

export const selectTotalElements = createSelector(
  selectAlbumStateSelector,
  (state: AlbumState) => state.totalElements
);

export const selectAlbumLoading = createSelector(
  selectAlbumStateSelector,
  (state: AlbumState) => state.loading
);

export const selectAlbumError = createSelector(
  selectAlbumStateSelector,
  (state: AlbumState) => state.error
);

export const selectSelectedAlbum = createSelector(
  selectAlbumStateSelector,
  (state) => state.selectedAlbum
);

export const selectAlbumSuccess = createSelector(
  selectAlbumStateSelector,
  (state) => state.success
);

export const selectAlbumById = (id: string) => createSelector(
  selectAlbumStateSelector,
  (state) => state.albums.find(album => album.id === id)
); 