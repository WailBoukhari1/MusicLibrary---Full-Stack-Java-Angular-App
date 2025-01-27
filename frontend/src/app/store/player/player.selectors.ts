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

export const selectQueue = createSelector(
  selectPlayerState,
  (state) => state.queue
);

export const selectCanSkipNext = createSelector(
  selectPlayerState,
  (state) => state.queue.length > 0 && state.currentSong !== null
);

export const selectCanSkipPrevious = createSelector(
  selectPlayerState,
  (state) => state.queue.length > 0 && state.currentSong !== null
); 