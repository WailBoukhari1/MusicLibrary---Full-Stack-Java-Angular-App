import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumState } from './album.state';

export const selectAlbumState = createFeatureSelector<AlbumState>('album');

export const selectAlbums = createSelector(
  selectAlbumState,
  (state) => state.albums
);

export const selectSelectedAlbum = createSelector(
  selectAlbumState,
  (state) => state.selectedAlbum
);

export const selectTotalElements = createSelector(
  selectAlbumState,
  (state) => state.totalElements
);

export const selectAlbumLoading = createSelector(
  selectAlbumState,
  (state) => state.loading
);

export const selectAlbumError = createSelector(
  selectAlbumState,
  (state) => state.error
); 