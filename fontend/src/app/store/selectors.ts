import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectSongState = (state: AppState) => state.songs;
export const selectAlbumState = (state: AppState) => state.albums;

export const selectSelectedSong = createSelector(
  selectSongState,
  (state) => state.selectedSong
);

export const selectSelectedAlbum = createSelector(
  selectAlbumState,
  (state) => state.selectedAlbum
);

export const selectAllAlbums = createSelector(
  selectAlbumState,
  (state) => state.albums
); 