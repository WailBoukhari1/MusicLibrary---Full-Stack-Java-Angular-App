import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.state';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentSong = createSelector(
  selectPlayerState,
  (state) => state.currentSong
);

export const selectIsPlaying = createSelector(
  selectPlayerState,
  (state) => state.isPlaying
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state) => state.volume
);

export const selectProgress = createSelector(
  selectPlayerState,
  (state) => state.progress
);

export const selectCurrentAlbum = createSelector(
  selectPlayerState,
  (state) => state.currentAlbum
);

export const selectCanSkipNext = createSelector(
  selectPlayerState,
  (state) => {
    const currentIndex = state.currentAlbum?.songs?.findIndex(s => s.id === state.currentSong?.id) ?? -1;
    return currentIndex < (state.currentAlbum?.songs?.length ?? 0) - 1;
  }
);

export const selectCanSkipPrevious = createSelector(
  selectPlayerState,
  (state) => {
    const currentIndex = state.currentAlbum?.songs?.findIndex(s => s.id === state.currentSong?.id) ?? -1;
    return currentIndex > 0;
  }
);