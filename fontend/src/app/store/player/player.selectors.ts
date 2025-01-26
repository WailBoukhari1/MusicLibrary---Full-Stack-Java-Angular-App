import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentSong = createSelector(
  selectPlayerState,
  (state) => state.currentSong
);

export const selectIsPlaying = createSelector(
  selectPlayerState,
  (state) => state.isPlaying
);

export const selectProgress = createSelector(
  selectPlayerState,
  (state) => state.progress
);

export const selectVolume = createSelector(
  selectPlayerState,
  (state) => state.volume
); 