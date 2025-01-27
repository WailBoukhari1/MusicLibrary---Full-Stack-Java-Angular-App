import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SongState } from './song.reducer';

export const selectSongsState = createFeatureSelector<SongState>('songs');

export const selectSongsLoading = createSelector(
  selectSongsState,
  state => state?.loading ?? false
);

export const selectSongsError = createSelector(
  selectSongsState,
  state => state?.error ?? null
);

export const selectSongsSuccess = createSelector(
  selectSongsState,
  state => state?.success ?? false
);

export const selectCurrentSong = createSelector(
  selectSongsState,
  state => state?.currentSong ?? null
);

export const selectAllSongs = createSelector(
  selectSongsState,
  state => state?.songs ?? []
);

export const selectSongsTotalElements = createSelector(
  selectSongsState,
  state => state?.totalElements ?? 0
);

export const selectFavoriteSongs = createSelector(
  selectSongsState,
  state => state?.favorites ?? []
);

export const selectSelectedSong = createSelector(
  selectSongsState,
  state => state?.selectedSong ?? null
);

// For backward compatibility
export const selectSongLoading = selectSongsLoading;
export const selectSongError = selectSongsError;
export const selectSongSuccess = selectSongsSuccess; 