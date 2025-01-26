import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlbumState } from './album.state';

export const selectAlbumState = createFeatureSelector<AlbumState>('albums');

export const selectAllAlbums = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.albums
);

export const selectCurrentAlbum = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.selectedAlbum
);

export const selectTotalElements = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.totalElements
);

export const selectAlbumLoading = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.loading
);

export const selectAlbumError = createSelector(
  selectAlbumState,
  (state: AlbumState) => state.error
); 