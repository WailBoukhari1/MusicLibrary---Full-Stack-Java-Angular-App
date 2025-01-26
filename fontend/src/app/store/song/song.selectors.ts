import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SongState } from './song.reducer';

export const selectSongState = createFeatureSelector<SongState>('songs');

export const selectAllSongs = createSelector(
  selectSongState,
  (state: SongState) => state.songs
);

export const selectSelectedSong = createSelector(
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