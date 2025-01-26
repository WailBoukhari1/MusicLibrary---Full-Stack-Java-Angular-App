import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SongState } from './song.state';

export const selectSongState = createFeatureSelector<SongState>('songs');

export const selectAllSongs = createSelector(
  selectSongState,
  (state: SongState) => state.songs
);

export const selectCurrentSong = createSelector(
  selectSongState,
  (state: SongState) => state.selectedSong
);

export const selectSongsTotalElements = createSelector(
  selectSongState,
  (state: SongState) => state.totalElements
);

export const selectSongsLoading = createSelector(
  selectSongState,
  (state: SongState) => state.loading
);

export const selectSongsError = createSelector(
  selectSongState,
  (state: SongState) => state.error
);

export const selectFavoriteSongs = createSelector(
  selectSongState,
  (state: SongState) => state.favorites
);

export const selectSelectedSong = createSelector(
  selectSongState,
  (state) => state.selectedSong
); 